import {
  Button,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Text,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { getUserFarms } from 'app/utils';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import {
  selectFarmsStaked,
  selectLiquidityWallet,
  selectLockedInSpiritAmount,
} from 'store/user/selectors';
import FarmsData from './FarmsData';
import HeaderTable from './HeaderTable';
import ToggleFilter from './ToggleFilter';
import { StyledHighlightMessage } from '../../styles';
import { useTranslation } from 'react-i18next';
import LabelTable from './LabelTable';
import sortFn from '../TokensTable/sortUtils';
import { selectSaturatedGauges } from 'store/general/selectors';
import useMobile from 'utils/isMobile';
import { MobileTable } from '../MobileTable';
import useWallets from 'app/hooks/useWallets';

const TokenTableV3 = ({
  errorMessage,
  handleVote,
  farmType,
  isLoading,
  onUpdateFarm,
  selectedFarm,
  farmsSize,
  handleSort,
  userOnly,
  toggleUserFarm,
  cleanError,
}) => {
  const { t } = useTranslation();
  const { account, isLoggedIn } = useWallets();
  const isMobile = useMobile();
  const translationPath = 'inSpirit.voting';

  const stakedFarms = useAppSelector(selectFarmsStaked);
  const lockedSpiritBalance = useAppSelector(selectLockedInSpiritAmount);
  const [searchValues, setSearchValues] = useState('');
  const [showMobileTableFilters, setShowMobileTableFilters] =
    useState<boolean>(false);
  const [newVotes, setNewVotes] = useState({});
  const onFarmSearch = e => {
    const query = e.target.value;
    setSearchValues(query);
  };

  const { boostedV2, boostedStable } = useAppSelector(selectSaturatedGauges);

  const toggleMobileTableFilters = () => {
    setShowMobileTableFilters(!showMobileTableFilters);
  };

  const onNewVote = (value: string, lpAddress: string) => {
    setNewVotes({ ...newVotes, [lpAddress]: value });
    setResetInputs(false);
  };

  useEffect(() => {
    const getBoostedFarms = async () => {
      const userBoostedV2 = getUserFarms(boostedV2, stakedFarms);
      const userBoostedStable = getUserFarms(boostedStable, stakedFarms);

      onUpdateFarm({
        v2Classics: sortFn(boostedV2, 'yourVote', 'des'),
        userv2Classics: sortFn(userBoostedV2, 'yourVote', 'des'),
        stables: sortFn(boostedStable, 'yourVote', 'des'),
        userStables: sortFn(userBoostedStable, 'yourVote', 'des'),
      });
    };
    getBoostedFarms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValues, userOnly, farmType, account, boostedV2, boostedStable]);

  const filteredBribes = useMemo(() => {
    if (searchValues) {
      const newList = selectedFarm.filter(farm => {
        const [tokenA, tokenB] = farm.name.split(' ');
        const lowerSearch = searchValues.toLowerCase();
        const lowertokenA = tokenA.toLowerCase();
        const lowertokenB = tokenB.toLowerCase();

        const isIncluded =
          lowertokenA.includes(lowerSearch) ||
          lowertokenB.includes(lowerSearch);
        if (isIncluded) return true;
        return false;
      });
      return newList;
    }
    return selectedFarm;
  }, [selectedFarm, searchValues]);

  const [resetInputs, setResetInputs] = useState<boolean>(false);

  const resetVoting = () => {
    setResetInputs(true);
    setNewVotes({});
  };
  const labelData = [
    {
      id: 1,
      label: isMobile ? `${farmsSize} Farms` : 'Farm',
      sortYpe: 'globalVoting',
      onSort: handleSort,
    },
    {
      id: 2,
      label: 'APR%',
      sortYpe: 'rewards',
      onSort: handleSort,
    },
    {
      id: 3,
      label: 'Rewards / 10k inSPIRIT',
      sortYpe: 'rewards',
      onSort: handleSort,
    },
    {
      id: 4,
      label: 'Liquidity / 10k inSPIRIT',
      sortYpe: 'liquidityPer10kInspirit',
      onSort: handleSort,
    },
    {
      id: 5,
      label: 'Voting Fees Earned',
      sortYpe: 'userRewards',
      onSort: handleSort,
    },
    { id: 6, label: 'Voting', sortYpe: 'globalVoting', onSort: handleSort },
    { id: 7, label: 'Your vote (%)', sortYpe: 'yourVote', onSort: handleSort },
  ];

  const showBanner =
    lockedSpiritBalance !== '0.0' ? (account ? false : true) : true;

  return (
    <VStack w="full">
      <HeaderTable
        onFarmSearch={onFarmSearch}
        toggleMobileTableFilters={toggleMobileTableFilters}
        toggleUserFarm={toggleUserFarm}
        userFarmsOnly={userOnly}
        farmsSize={farmsSize}
      />
      {showMobileTableFilters && (
        <ToggleFilter toggleFarms={toggleUserFarm} userFarmsOnly={userOnly} />
      )}

      {isMobile ? (
        <MobileTable
          labelData={labelData}
          filteredBribes={filteredBribes}
          resetInputs={resetInputs}
          onNewVote={onNewVote}
          cleanError={cleanError}
        />
      ) : (
        <TableContainer w="full">
          <Table variant="inspirit">
            <Thead>
              <Tr>
                {labelData.map((label, i) => (
                  <LabelTable
                    id={label.id}
                    label={label.label}
                    sortType={label.sortYpe}
                    onSort={label.onSort}
                    key={label.label}
                    isLast={labelData.length === ++i}
                    isFirst={label.id === 1}
                  />
                ))}
              </Tr>
            </Thead>
            <Tbody w="full">
              {filteredBribes.length
                ? filteredBribes.map((farm, i) => (
                    <FarmsData
                      farm={farm}
                      key={`farm-${farm.name}-${i}`}
                      resetVoting={resetInputs}
                      onNewVote={onNewVote}
                      cleanError={cleanError}
                    />
                  ))
                : null}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {showBanner && (
        <StyledHighlightMessage>
          {t(`${translationPath}.generateButton`)}
        </StyledHighlightMessage>
      )}

      {errorMessage && (
        <Text color="red.500" mb="spacing03">
          {t(errorMessage)}
        </Text>
      )}
      <HStack w="full" justify={isMobile ? 'center' : 'flex-end'} p="8px">
        <Button
          bg="none"
          disabled={!isLoggedIn}
          border="none"
          w={isMobile ? 'full' : '-moz-initial'}
          onClick={resetVoting}
        >
          {t(`${translationPath}.resetVoting`)}
        </Button>
        <Button
          variant="primary"
          w={isMobile ? 'full' : '-moz-initial'}
          isLoading={isLoading}
          onClick={() => handleVote(selectedFarm, newVotes)}
        >
          {t(
            `${translationPath}.${isLoggedIn ? 'confirmVote' : 'notconnected'}`,
          )}
        </Button>
      </HStack>
    </VStack>
  );
};

export default TokenTableV3;
