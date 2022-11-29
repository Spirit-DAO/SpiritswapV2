import BigNumber from 'bignumber.js';
import { CHAIN_ID, VARIABLE } from 'constants/index';
import contracts from 'constants/contracts';
import PAIR_ABI from '../abis/IUniswapV2Pair.json';
import { Contract } from '../contracts';
import { getProvider } from 'app/connectors/EthersConnector/login';
import { ethers } from 'ethers';
import { setEcosystemFarmAddress } from 'store/farms';
import { transactionResponse } from './utils';
import { approve } from './general';
import { parseUnits } from 'ethers/lib/utils';

export const gaugeContract = async (
  _farmGaugeAddress: string,
  _chainId = CHAIN_ID,
) => {
  const _connector = getProvider();
  const instance = await Contract(
    _farmGaugeAddress,
    'gauge',
    _connector,
    _chainId,
  );

  return instance;
};

export const factoryContract = async () => {
  const _connector = getProvider();
  const address_factory = contracts.factoryV2[250];
  const instance = await Contract(address_factory, 'factory', _connector);

  return instance;
};

export const gaugeContractProxy = async ({ version }) => {
  let gauge = contracts.gauge[CHAIN_ID];
  let gaugeProxy = 'gaugeproxy';

  /* TODO Better version handling */
  if (version === 2) {
    gauge = contracts.gaugeV3[CHAIN_ID];
    gaugeProxy = 'gaugeproxyV3';
  }
  if (version === 3) {
    gauge = contracts.stableProxy[CHAIN_ID];
    gaugeProxy = 'stableproxy';
  }

  const _connector = getProvider();
  const gaugeContract = await Contract(gauge, gaugeProxy, _connector, CHAIN_ID);
  return gaugeContract;
};

export const masterChefContract = async (_version = 0, _chainId = CHAIN_ID) => {
  const _connector = getProvider();
  const instance = await Contract(
    contracts.masterchef[CHAIN_ID],
    !_version ? 'masterchef' : 'masterchef2',
    _connector,
    _chainId,
  );

  return instance;
};

// TODO: May need to be deprecated when stable and weighted farms are updated with SPIRIT contracts
export const externalMasterChef = async (
  _address: string,
  _abi = 'beetmasterchef',
  _chainId = CHAIN_ID,
) => {
  const _connector = getProvider();
  const instance = await Contract(_address, _abi, _connector, _chainId);

  return instance;
};

export const stakePoolToken = async (_pid: number, _amount: string) => {
  const masterchef = await masterChefContract();

  const depositAmount = new BigNumber(_amount).times(new BigNumber(10).pow(18));

  const tx = await masterchef.deposit(_pid, depositAmount);

  return tx;
};

export const stakeGaugePoolToken = async (
  _farmAddress: string,
  _amount: string,
  _chainId = CHAIN_ID,
) => {
  const gauge = await gaugeContract(_farmAddress, _chainId);
  const depositAmount = parseUnits(_amount, 18);

  const tx = await gauge.deposit(depositAmount);

  return tx;
};

export const depositAllGaugePoolToken = async (
  _farmAddress: string,
  _chainId = CHAIN_ID,
) => {
  const gauge = await gaugeContract(_farmAddress, _chainId);

  const tx = await gauge.depositAll();

  return tx;
};

export const unstakePoolToken = async (_pid: number, _amount: string) => {
  const masterchef = await masterChefContract();

  const withdrawAmount = new BigNumber(_amount)
    .times(new BigNumber(10).pow(18))
    .toString();

  const tx = await masterchef.withdraw(_pid, withdrawAmount);

  return tx;
};

export const unstakeGaugePoolToken = async (
  _farmAddress: string,
  _amount: string,
  _chainId = CHAIN_ID,
) => {
  const gauge = await gaugeContract(_farmAddress, _chainId);

  const withdrawAmount = parseUnits(_amount, 18);

  const tx = await gauge.withdraw(withdrawAmount);

  return tx;
};

export const unstakeGaugePoolTokenAll = async (
  _farmAddress: string,
  _connector = window.ethereum,
  _chainId = CHAIN_ID,
) => {
  const gauge = await gaugeContract(_farmAddress, _chainId);
  const tx = await gauge.withdrawAll();

  return tx;
};

export const harvest = async (_id: number, _chainId = CHAIN_ID) => {
  const masterchef = await masterChefContract();

  // Empty deposits harvest rewards in v1 masterchef
  const tx = await masterchef.deposit(_id, '0');

  return tx;
};

export const harvest2 = async (
  _id: number,
  _contract: string,
  _abi = 'beetmasterchef',
  _chainId = CHAIN_ID,
) => {
  const masterchef = await externalMasterChef(_contract, _abi, _chainId);
  const { signer } = masterchef;
  const userAddress = await signer.getAddress();

  const tx = await masterchef.harvest(_id, userAddress);

  return tx;
};

export const gaugeHarvest = async (
  _farmAddress: string,
  _chainId = CHAIN_ID,
) => {
  const gauge = await gaugeContract(_farmAddress, _chainId);

  const tx = await gauge.getReward();

  return tx;
};

export const farmStatus = async (
  _farmAddress: string,
  _gaugeAddress: string | undefined,
  account: string,
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const lpContract = new ethers.Contract(_farmAddress, PAIR_ABI, signer);

  const allowance = await lpContract.allowance(
    account,
    !_gaugeAddress ? contracts.masterchef[CHAIN_ID] : _gaugeAddress,
  );

  return allowance;
};

export const getPairs = async (
  proxy: boolean,
  addressA: string,
  addressB: string,
) => {
  try {
    const contract = await factoryContract();
    const pairs = await contract.getPair(addressA, addressB, proxy);
    return pairs;
  } catch (error) {
    return null;
  }
};
export const createFarm = async (typeProxy: string, farmAddress: string) => {
  try {
    const version = typeProxy === VARIABLE ? 2 : 3;
    const contract = await gaugeContractProxy({ version });
    const tx = await contract.addGauge(farmAddress);
    return tx;
  } catch (error) {
    throw '';
  }
};

export const approveFarm = async (
  _farmAddress: string,
  _gaugeAddress: string | undefined,
  _chainId = CHAIN_ID,
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const lpContract = new ethers.Contract(_farmAddress, PAIR_ABI, signer);
  const approve = await lpContract.approve(
    !_gaugeAddress ? contracts.masterchef[CHAIN_ID] : _gaugeAddress,
    ethers.constants.MaxUint256.toString(),
  );
  return approve;
};

export const addNewEcosystemFarm = async (
  dispatch,
  account,
  addToQueue,
  ecosystemValues,
  verifiedFarm,
) => {
  try {
    dispatch(setEcosystemFarmAddress(''));
    // TODO: Handle web3 integration here. Ticket: DEV2-543 Url: https://spiritswap.atlassian.net/jira/software/projects/DEV2/boards/17?assignee=5b902218fe487e2c80e9bfe7&selectedIssue=DEV2-543

    const TWILIGHT_FARM_FACTORY = contracts.twilight_farm_factory[250];
    const twilightFactory = async () => {
      const _connector = getProvider();
      const contract = await Contract(
        TWILIGHT_FARM_FACTORY,
        'twilightFarmFactory',
        _connector,
        CHAIN_ID,
      );
      return contract;
    };

    const contract = await twilightFactory();

    const tx = await contract.newFarm(
      account,
      ecosystemValues.emissionToken.address,
      ecosystemValues.lpTokenAddress,
      verifiedFarm,
      { value: ethers.utils.parseEther('1') },
    );

    addToQueue(
      transactionResponse('farm.ecosystem', {
        operation: 'FARM',
        tx: tx,
      }),
      'ecosystemFarm',
    );
  } catch (e) {
    console.error(e);
  }
};

const calculateSecondsDays = (days: number) => {
  const seconds = days * 24 * 60 * 60;
  return seconds;
};

export const getEcosystemFarmAddress = async (
  ecosystemFarmAddress,
  ecosystemValues,
  addToQueue,
  account,
) => {
  const twilightFarm = async () => {
    const _connector = getProvider();
    const contract = await Contract(
      ecosystemFarmAddress,
      'twilightFarm',
      _connector,
    );
    return contract;
  };

  const emissionAmount = ecosystemValues.emissionAmount;

  const tx = await approve(
    ecosystemValues.emissionToken.address,
    ecosystemFarmAddress,
    emissionAmount,
  );

  addToQueue(
    transactionResponse('farm.ecosystem', {
      operation: 'FARM',
      tx: tx,
    }),
    'ecosystemFarm',
  );

  if (tx) {
    await tx.wait();
    const contract = await twilightFarm();
    const duration = calculateSecondsDays(
      ecosystemValues.emissionSchedule.value,
    );

    const restartConfigTx = await contract.restartWithNewConfiguration(
      0,
      duration,
      account,
      ecosystemValues.emissionAmount,
    );

    addToQueue(
      transactionResponse('farm.ecosystem', {
        operation: 'FARM',
        tx: tx,
      }),
      'ecosystemFarm',
    );

    await restartConfigTx.wait();
  }
};
