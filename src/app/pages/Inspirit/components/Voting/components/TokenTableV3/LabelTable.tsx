import { Flex, Text, Th } from '@chakra-ui/react';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { useState } from 'react';

const LabelTable = ({ label, sortType, onSort, isLast, isFirst, id }) => {
  const [direction, setDirection] = useState('des');

  const handleOnSort = by => {
    onSort(by, direction);
    setDirection(prevDir => (prevDir === 'des' ? 'asc' : 'des'));
  };
  const titles = label.split('/');

  const isRewards10kInSPIRIT = id === 3;

  const breakTitle = () => {
    if (titles.length > 1) {
      return (
        <Flex
          direction="column"
          cursor="pointer"
          fontSize="sm"
          align="center"
          justify="center"
          color="grayDarker"
          onClick={() => handleOnSort(sortType)}
        >
          <Text>{titles[0]}/</Text>
          <Flex alignItems="center">
            <Text align="center" justifyContent="center">
              {titles[1]}
            </Text>
            <QuestionHelper
              title={
                isRewards10kInSPIRIT
                  ? 'Rewards / 10k inSPIRIT'
                  : 'Liquidity / 10k inSPIRIT'
              }
              text={
                isRewards10kInSPIRIT
                  ? 'Amount of rewards earned per 10k inSPIRIT voted'
                  : ' Amount of liquidity equivalent held per 10k inSPIRIT voted'
              }
            />
          </Flex>
        </Flex>
      );
    }
  };

  return (
    <Th
      style={{ textAlign: `${isLast ? 'end' : isFirst ? 'start' : 'center'}` }}
    >
      {titles.length > 1 ? (
        breakTitle()
      ) : (
        <Text
          cursor="pointer"
          fontSize="sm"
          color="grayDarker"
          onClick={() => handleOnSort(sortType)}
        >
          {label}
        </Text>
      )}
    </Th>
  );
};

export default LabelTable;
