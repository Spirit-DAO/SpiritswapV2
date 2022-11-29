import { EcosystemFarmType } from 'app/interfaces/Farm';
import { CHAIN_ID } from 'constants/index';
import contracts from 'constants/contracts';
import { Contract, Web3Provider } from 'utils/web3';
import { ecosystemFarmObject } from './ecosystemFarmObject';
import { FarmConfigWithStatistics } from 'utils/data';

export const getAllEcosystemFarms = async (
  provider: Web3Provider | undefined,
  getTokensDetails,
  setEcosystemFarms,
  dispatch,
) => {
  const TWILIGHT_FARM_FACTORY = contracts.twilight_farm_factory[CHAIN_ID];

  if (provider && provider.network.chainId === CHAIN_ID) {
    const twilightFactory = async () => {
      const contract = await Contract(
        TWILIGHT_FARM_FACTORY,
        'twilightFarmFactory',
        undefined,
        undefined,
        provider,
      );
      return contract;
    };

    const contract = await twilightFactory();

    const [verifiedFarms, unverifiedFarms] = await Promise.all([
      contract.getAllVerifiedFarms(),
      contract.getAllUnverifiedFarms(),
    ]);

    const ecosystemFarmsPromises: Promise<FarmConfigWithStatistics>[] = [];

    unverifiedFarms.map(async farm => {
      if (farm[3]) {
        ecosystemFarmsPromises.push(
          getEcosystemTokenDetails(
            farm,
            getTokensDetails,
            ecosystemFarmObject,
            EcosystemFarmType.UNVERIFIED,
          ),
        );
      }
    });
    verifiedFarms.map(async farm => {
      if (farm[3]) {
        ecosystemFarmsPromises.push(
          getEcosystemTokenDetails(
            farm,
            getTokensDetails,
            ecosystemFarmObject,
            EcosystemFarmType.VERIFIED,
          ),
        );
      }
    });

    const unionEcosystemFarms = await Promise.all(ecosystemFarmsPromises);
    dispatch(setEcosystemFarms(unionEcosystemFarms));

    return unionEcosystemFarms;
  }

  return [];
};

const getEcosystemTokenDetails = async (
  farm: any,
  getTokensDetails,
  ecosystemFarmObject,
  type,
) => {
  const [firstTokenDetails, secondTokenDetails] = await Promise.all([
    getTokensDetails(farm.token0),
    getTokensDetails(farm.token1),
  ]);

  const lpAddress = farm[3];
  const tokenAddress = farm[4];
  const ecoFarms = ecosystemFarmObject(
    farm,
    firstTokenDetails,
    secondTokenDetails,
    lpAddress,
    tokenAddress,
    type,
  );

  return ecoFarms;
};
