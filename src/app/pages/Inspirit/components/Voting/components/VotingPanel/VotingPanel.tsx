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
  const [userOnly, setUserOnly] = useState(false);
  const [classicFarms, setclassicFarms] = useState<VotingFarms>({
    farms: [],
    userFarms: [],
  });
  const [stableFarms, setStableFarms] = useState<VotingFarms>({
    farms: [],
    userFarms: [],
  });

  const [v2Farms, setV2Farms] = useState<VotingFarms>({
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
    classics,
    userClassics,
    stables,
    userStables,
    v2Classics,
    userv2Classics,
  }) => {
    setclassicFarms({ farms: classics, userFarms: userClassics });
    setV2Farms({ farms: v2Classics, userFarms: userv2Classics });
    setStableFarms({ farms: stables, userFarms: userStables });
  };

  const handleSort = (by, direction) => {
    setSelectedFarms(sortFn(finalSelectedFarms, by, direction));
    setSortBy(by);
    setSortDirection(direction);
  };

  useEffect(() => {
    if (farmType.index === 0) {
      setSelectedFarms(
        sortFn(
          userOnly ? stableFarms.userFarms : stableFarms.farms,
          sortBy,
          sortDirection,
        ),
      );
    }
    if (farmType.index === 1) {
      setSelectedFarms(
        sortFn(
          userOnly ? v2Farms.userFarms : v2Farms.farms,
          sortBy,
          sortDirection,
        ),
      );
    }
  }, [farmType, userOnly, classicFarms, stableFarms, v2Farms]);

  const farmsSize = selectedFarms?.length;

  const allFarms = useAppSelector(selectFarmMasterData);

  const finalSelectedFarms: BoostedFarm[] = selectedFarms.map(listFarm => {
    const find = allFarms.find(
      farmInAllFarmList =>
        farmInAllFarmList.lpAddress === listFarm.fulldata.farmAddress,
    );
    if (find) {
      const poolLiquidity = find.totalLiquidity || 0;

      const liquidityPer10kInspirit: number =
        (poolLiquidity / listFarm.weight) * 10000;

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
    if (finalSelectedFarms) {
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
