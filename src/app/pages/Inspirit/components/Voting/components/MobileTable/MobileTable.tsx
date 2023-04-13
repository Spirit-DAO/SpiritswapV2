import { HStack, Text, VStack } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { MobileTableProps } from './MobileTable.d';
import { MobileRow } from '../MobileRow';
import { QuestionHelper } from 'app/components/QuestionHelper';

const MobileTable: FC<MobileTableProps> = ({
  labelData,
  filteredBribes,
  resetInputs,
  onNewVote,
  cleanError,
  showAll,
  uniqueFarm,
}) => {
  const [direction, setDirection] = useState('des');
  const height = '50px';
  const heightBG = '60px';
  const handleOnSort = (by, onSort) => {
    onSort(by, direction);
    setDirection(prevDir => (prevDir === 'des' ? 'asc' : 'des'));
  };

  return (
    <HStack w="full" p="8px" alignItems="start">
      <VStack minW="80px" justifyContent="center">
        {labelData.map(labelItem => {
          const isLiquidityPer10kInspirit = labelItem.id === 4;
          const isRewardsPer10kInspirit = labelItem.id === 3;
          return (
            <HStack
              display="flex"
              key={`${labelItem.label}-label`}
              w="full"
              h={[1, 2, 3, 4].includes(labelItem.id) ? heightBG : height}
            >
              <Text
                display="flex"
                alignItems="center"
                fontWeight="medium"
                h="full"
                fontSize="xs"
                onClick={() =>
                  handleOnSort(labelItem.sortYpe, labelItem.onSort)
                }
              >
                {labelItem.label}
              </Text>
              {isLiquidityPer10kInspirit || isRewardsPer10kInspirit ? (
                <QuestionHelper
                  title={
                    isRewardsPer10kInspirit
                      ? 'Rewards / 10k inSPIRIT'
                      : 'Liquidity / 10k inSPIRIT'
                  }
                  text={
                    isRewardsPer10kInspirit
                      ? 'Amount of rewards earned per 10k inSPIRIT voted'
                      : ' Amount of liquidity equivalent held per 10k inSPIRIT voted'
                  }
                />
              ) : null}
            </HStack>
          );
        })}
      </VStack>

      {showAll ? (
        <HStack overflow="scroll">
          {filteredBribes.length
            ? filteredBribes.map((farm, i) => (
                <MobileRow
                  farm={farm}
                  key={`farm-${farm.name}-${i}`}
                  resetInputs={resetInputs}
                  onNewVote={onNewVote}
                  cleanError={cleanError}
                  showAll={showAll}
                />
              ))
            : null}
        </HStack>
      ) : uniqueFarm ? (
        <HStack w="full">
          <MobileRow
            farm={uniqueFarm}
            key={`farm-${uniqueFarm?.name}`}
            resetInputs={resetInputs}
            onNewVote={onNewVote}
            cleanError={cleanError}
            showAll={showAll}
          />
        </HStack>
      ) : null}
    </HStack>
  );
};

export default MobileTable;
