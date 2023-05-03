import { FARMS } from 'constants/icons';

import { useState, useEffect, useMemo } from 'react';

import { Box, Button, HStack, useDisclosure } from '@chakra-ui/react';
import { CardHeader } from 'app/components/CardHeader';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { IFarm, IFarmFilters } from 'app/interfaces/Farm';
import { GetWalletBalance } from 'app/utils';
import debounce from 'lodash/debounce';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'app/hooks/Routing';
import { resetEcosystemValues, setEcosystemFarmAddress } from 'store/farms';
import {
  selectEcosystemValues,
  selectFarmAddress,
  selectFarmMasterData,
} from 'store/farms/selectors';
import { selectSpiritInfo } from 'store/general/selectors';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectFarmRewards, selectFarmsStaked } from 'store/user/selectors';
import { getEcosystemFarmAddress } from 'utils/web3/actions/farm';
import FarmControls from './components/FarmControls';
import FarmItems from './components/FarmItems';
import { FarmRewards } from './components/FarmRewards';
import SpiritsBackground from './components/SpiritsBackground';
import {
  filterByQuery,
  filterByState,
  handleFarmData,
} from './helpers/filters';
import { sortFarms } from './helpers/sortFarms';
import { StyledContainer } from './styles';
import { formatUnits } from 'ethers/lib/utils';
import { ConnectWallet } from 'app/components/ConnectWallet';
import { FarmCreateModal } from './components/FarmCreateModal';
import { ethers } from 'ethers';
import useWallets from 'app/hooks/useWallets';
import useLogin from 'app/connectors/EthersConnector/login';
import { FARMS as FARMS_ROUTE } from 'app/router/routes';

const translationPath = 'farms.common';

export const Farms = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { address } = useParams();
  const { addToQueue } = Web3Monitoring();
  const { userLiquidity } = GetWalletBalance();
  const { account } = useWallets();
  const { handleLogin } = useLogin();
  const pageTitle = `${t('common.name')} - ${t(`${translationPath}.title`)}`;
  const navigate = useNavigate();
  const [sortType, setSortType] = useState(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [farmData, setFarmData] = useState<IFarm[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [collectedRewards, setCollectedRewards] = useState('0');
  const [hashRewards, setHashRewards] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const farmMasterData = useAppSelector(selectFarmMasterData);
  const spiritPriceInfo = useAppSelector(selectSpiritInfo);
  const ecosystemValues = useAppSelector(selectEcosystemValues);
  const ecosystemFarmAddress = useAppSelector(selectFarmAddress);
  const rewards = useAppSelector(selectFarmRewards);
  const farmsStaked = useAppSelector(selectFarmsStaked);

  const { price: spiritPrice } = spiritPriceInfo;

  const farmCreate = useDisclosure();

  const initialFarmFilters = {
    staked: false,
    inactive: false,
  };

  const [farmFilters, setFarmFilters] =
    useState<IFarmFilters>(initialFarmFilters);

  const onCreateFarm = () => {
    if (!account) handleLogin();

    farmCreate.onOpen();
  };

  // Function that runs when component receives a new farm address (creation ecofarm)
  useMemo(() => {
    if (ecosystemFarmAddress) {
      getEcosystemFarmAddress(
        ecosystemFarmAddress,
        ecosystemValues,
        addToQueue,
        account,
      );
    }
    dispatch(setEcosystemFarmAddress(''));
    dispatch(resetEcosystemValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ecosystemFarmAddress]);

  useEffect(() => {
    if (farmMasterData.length !== 0) {
      if (address) {
        const getFarmByAddress = farmMasterData?.filter(
          pool => pool?.lpAddress?.toLowerCase() === address?.toLowerCase(),
        );
        setFarmData(getFarmByAddress);
        setIsLoading(false);
      }
    }
  }, [farmMasterData, address, setFarmData]);

  useEffect(() => {
    const updateCollectedRewards = () => {
      const rewardsMapping = {};
      let spirit = ethers.BigNumber.from('0');
      rewards.forEach(reward => {
        // NMC: Not master chef
        // MC: Master chef
        rewardsMapping[reward.lpAddress?.toLowerCase()] = reward;
        spirit = spirit.add(reward.earned);
      });

      if (spirit) {
        const formattedRewards = formatUnits(spirit, 18);

        setCollectedRewards(formattedRewards);
      }

      setHashRewards(rewardsMapping);
    };
    if (rewards && rewards.length > 0) {
      updateCollectedRewards();
    } else {
      setHashRewards({});
    }
  }, [rewards]);

  // Sorting options
  const dropdownSortOptions = [
    { id: 0, value: t('farms.sort.apr'), type: 'option' },
    { id: 1, value: t('farms.sort.earned'), type: 'option' },
    { id: 2, value: t('farms.sort.liquidity'), type: 'option' },
    { id: 3, value: t('farms.sort.emissions'), type: 'option' },
  ];

  // Filters
  const onFarmTabChange = ({ index }: { index: number }) => {
    setSelectedTab(index);
  };

  const handleResetFilters = () => {
    setFarmFilters(initialFarmFilters);
  };

  // Input Filter Search Term
  const handleChangeSearchTerm = e => {
    setSearchTerm(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChangeSearchTerm, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const onFarmFilterChange = array => {
    if (!address && array.length > 0) {
      const filterDataByState = array.filter(pool =>
        filterByState(
          pool,
          farmFilters.staked,
          farmFilters.inactive,
          farmsStaked,
        ),
      );
      const sortedFarms = sortFarms(
        filterDataByState,
        sortType,
        hashRewards,
        farmsStaked,
      );
      return sortedFarms;
    }
  };

  const onFilterByQueryChange = (result, searchTerm) => {
    const filteredDataByQuery = result.filter(pool =>
      filterByQuery(pool, searchTerm),
    );
    return filteredDataByQuery;
  };

  useEffect(() => {
    if (!address && farmMasterData && farmMasterData.length > 0) {
      let result: any = farmMasterData;
      if (result.length === 0) {
        result = farmMasterData;
      }

      result = onFarmFilterChange(result);
      result = handleFarmData(result, selectedTab);
      if (searchTerm.length > 0) {
        result = onFilterByQueryChange(result, searchTerm);
      }
      // setIsLoadingFarms(true);
      setFarmData(result);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedTab,
    farmFilters,
    searchTerm,
    sortType,
    farmMasterData,
    farmsStaked,
    hashRewards,
  ]);

  const handleBackToFarms = () => {
    navigate(FARMS_ROUTE.path);
    setFarmData(farmMasterData);
    setIsLoading(false);
  };

  return (
    <Box minH="100vh" overflowX="hidden">
      <HelmetProvider>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
      </HelmetProvider>

      <StyledContainer>
        <SpiritsBackground />
        <CardHeader
          title={t(`${translationPath}.title`)}
          id={FARMS}
          helperContent={{
            title: t(`${translationPath}.title`),
            text: t('farms.helperModal.farmExplanation'),
            showDocs: true,
          }}
        />
        <HStack justifyContent="space-between" mt="10px">
          <FarmRewards rewards={collectedRewards} spiritPrice={spiritPrice} />
          <Button onClick={onCreateFarm}>Create Farm</Button>
        </HStack>{' '}
        <div id="top" />
        {!address && (
          <FarmControls
            selectedTab={selectedTab}
            farmFilters={farmFilters}
            showFilters={showFilters}
            setFarmFilters={setFarmFilters}
            onFarmTabChange={onFarmTabChange}
            account={account}
            setShowFilters={setShowFilters}
            dropdownSortOptions={dropdownSortOptions}
            sortType={sortType}
            setSortType={setSortType}
            debouncedResults={debouncedResults}
          />
        )}
        <FarmItems
          address={address}
          handleBackToFarms={handleBackToFarms}
          handleResetFilters={handleResetFilters}
          userLiquidity={userLiquidity}
          farms={farmData}
          farmFilters={farmFilters}
          isLoading={isLoading}
          onOpen={onOpen}
        />
      </StyledContainer>
      {farmCreate.isOpen ? (
        <FarmCreateModal
          isOpen={farmCreate.isOpen}
          onClose={farmCreate.onClose}
          isConnected={account}
        />
      ) : null}
      {/* <EcosystemFarmModal {...ecoFarmDisclosure} /> */}
      <ConnectWallet isOpen={isOpen} dismiss={onClose} />
    </Box>
  );
};

export default Farms;
