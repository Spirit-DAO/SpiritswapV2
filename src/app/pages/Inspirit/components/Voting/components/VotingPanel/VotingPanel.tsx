import { Flex, HStack, Skeleton, Text } from '@chakra-ui/react';
import usePieChartData from 'app/hooks/usePieChartData';
import { BoostedFarm } from 'app/interfaces/Inspirit';
import { useEffect, useState } from 'react';
import { selectFarmMasterData } from 'store/farms/selectors';
import { useAppSelector } from 'store/hooks';
import { FarmsDropdown } from '../../../Bribes/FarmsDropdown';
import { NewBribeModal } from '../../../Bribes/NewBribeModal';
import { PieChart } from '../PieChart';
import sortFn from '../TokensTable/sortUtils';
import { TokenTableV3 } from '../TokenTableV3';
import { inactiveInspirit } from 'constants/farms';

interface VotingFarms {
  farms: BoostedFarm[];
  userFarms: BoostedFarm[];
}

const VotingPanel = ({
  handleVote,
  errorMessage,
  farmType,
  isLoading,
  cleanError,
  newBribeDisclosure,
}) => {
  const allFarms = useAppSelector(selectFarmMasterData);
  const [userOnly, setUserOnly] = useState(false);
  const [variableCombineFarms, setVariableCombineFarms] = useState<VotingFarms>(
    {
      farms: [],
      userFarms: [],
    },
  );
  const [stableCombineFarms, setStableCombineFarms] = useState<VotingFarms>({
    farms: [],
    userFarms: [],
  });
  const [selectedFarms, setSelectedFarms] = useState<BoostedFarm[]>([]);
  const [sortBy, setSortBy] = useState();
  const [sortDirection, setSortDirection] = useState();
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [uniqueFarm, setUniqueFarm] = useState<BoostedFarm>();
  const [showAll, setShowAll] = useState(true);
  const toggleUserFarm = () => {
    setUserOnly(!userOnly);
  };

  const updatingFarm = ({
    variableCombine,
    userVariableCombine,
    stableCombine,
    userStableCombine,
  }) => {
    setVariableCombineFarms({
      farms: variableCombine,
      userFarms: userVariableCombine,
    });
    setStableCombineFarms({
      farms: stableCombine,
      userFarms: userStableCombine,
    });
  };

  const handleSort = (by, direction) => {
    setSelectedFarms(sortFn(finalSelectedFarms, by, direction));
    setSortBy(by);
    setSortDirection(direction);
  };

  useEffect(() => {
    // Combine farms
    if (farmType.value === 'Variable') {
      const filterInactivesFarms = variableCombineFarms.farms.filter(
        farm => !inactiveInspirit.includes(farm.name.toUpperCase()),
      );
      const filterInactivesUserFarms = variableCombineFarms.userFarms.filter(
        farm => !inactiveInspirit.includes(farm.name.toUpperCase()),
      );
      setSelectedFarms(
        sortFn(
          userOnly ? filterInactivesUserFarms : filterInactivesFarms,
          sortBy,
          sortDirection,
        ),
      );
    }
    if (farmType.value === 'Stable') {
      // Combine farms
      const filterInactivesFarms = stableCombineFarms.farms.filter(
        farm => !inactiveInspirit.includes(farm.name.toUpperCase()),
      );
      const filterInactivesUserFarms = stableCombineFarms.userFarms.filter(
        farm => !inactiveInspirit.includes(farm.name.toUpperCase()),
      );
      setSelectedFarms(
        sortFn(
          userOnly ? filterInactivesUserFarms : filterInactivesFarms,
          sortBy,
          sortDirection,
        ),
      );
    }
  }, [
    farmType,
    userOnly,
    sortBy,
    sortDirection,
    variableCombineFarms.farms,
    variableCombineFarms.userFarms,
    stableCombineFarms.farms,
    stableCombineFarms.userFarms,
    variableCombineFarms,
  ]);

  const farmsSize = selectedFarms?.length;

  const farmsWithApr = allFarms.filter(farm => farm.apr !== '0');

  const finalSelectedFarms: BoostedFarm[] = selectedFarms.map(listFarm => {
    const find = farmsWithApr.find(
      farm => farm.lpAddress === listFarm.fulldata.farmAddress,
    );
    if (find) {
      const poolLiquidity = find.totalLiquidity || 0;

      const liquidityPer10kInspirit: number =
        (poolLiquidity / listFarm.weight) * 10000;

      if (liquidityPer10kInspirit === Infinity) {
        return { ...listFarm, liquidityPer10kInspirit: 0 };
      }

      return { ...listFarm, liquidityPer10kInspirit };
    }
    return { ...listFarm };
  });

  const { pieChartData, pieChartOptions } = usePieChartData({
    farmsList: finalSelectedFarms,
  });

  const handleFarm = (lpAddress: string) => {
    setSelectedFarm(lpAddress);
    const findFarm = finalSelectedFarms.find(
      farm => farm.fulldata.farmAddress === lpAddress,
    );
    if (findFarm) {
      setUniqueFarm(findFarm);
    }
  };

  const onToggle = () => {
    setShowAll(!showAll);
    if (finalSelectedFarms && finalSelectedFarms.length) {
      setUniqueFarm(finalSelectedFarms[0]);
    }
  };

  return (
    <>
      <Flex justifyContent="center">
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          h="240px"
          w="240px"
          borderRadius="50%"
          isLoaded={!!selectedFarms.length}
        >
          <PieChart data={pieChartData} options={pieChartOptions} />
        </Skeleton>
      </Flex>

      {showAll ? null : (
        <HStack w="full" p="20px 15px">
          <Text w="50%">Select a Farm</Text>
          <FarmsDropdown
            value={selectedFarm}
            farms={selectedFarms}
            onChange={handleFarm}
          />
        </HStack>
      )}
      <TokenTableV3
        errorMessage={errorMessage}
        handleVote={handleVote}
        farmType={farmType}
        isLoading={isLoading}
        onUpdateFarm={updatingFarm}
        selectedFarm={finalSelectedFarms}
        farmsSize={farmsSize}
        handleSort={handleSort}
        userOnly={userOnly}
        toggleUserFarm={toggleUserFarm}
        cleanError={cleanError}
        showAll={showAll}
        toggleShow={onToggle}
        uniqueFarm={uniqueFarm}
      />

      {newBribeDisclosure.isOpen ? (
        <NewBribeModal
          farms={selectedFarms}
          {...newBribeDisclosure}
          farmType={farmType.index}
        />
      ) : null}
    </>
  );
};

export default VotingPanel;
