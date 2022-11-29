import { HStack, Td, Text, Tr } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { VotingInput } from '../VotingInput';
import { convertAmount, formatNumber } from 'app/utils';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { selectSpiritInfo } from 'store/general/selectors';
import { useAppSelector } from 'store/hooks';
import { BoostedFarm } from 'app/interfaces/Inspirit';

const FarmsData = ({
  farm,
  onNewVote,
  resetVoting,
  cleanError,
}: {
  farm: BoostedFarm;
  onNewVote: (value: string, lpAddress: string) => void;
  resetVoting: boolean;
  cleanError: () => void;
}) => {
  const {
    bribes,
    name,
    value,
    liquidityPer10kInspirit,
    userVotes,
    totalVotesOnFarm,
    fulldata,
    feeEarns,
  } = farm;
  const lpAddress = fulldata?.farmAddress || '';
  const [tokenA, tokenB] = name.split(' ');
  const { price: spiritPrice } = useAppSelector(selectSpiritInfo);

  const calculateAPR = _value => {
    const value = new BigNumber(_value);
    const aprValue = new BigNumber(spiritPrice).multipliedBy(10000);
    return value
      .multipliedBy(52)
      .dividedBy(aprValue)
      .multipliedBy(100)
      .toNumber();
  };

  const { rewardAPR } = useMemo(() => {
    if (bribes && spiritPrice) {
      const rewardAPR = calculateAPR(bribes);
      return { rewardAPR };
    }
    return { rewardAPR: 0 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bribes]);

  return (
    <Tr>
      <Td>
        <HStack mt="8px">
          <ImageLogo margin="0" symbol={tokenA} size="24px" />
          <ImageLogo margin="0" symbol={tokenB} size="24px" />
        </HStack>
        <HStack spacing={0}>
          <Text>{tokenA}</Text>
          <Text color="grayDarker">+</Text>
          <Text>{tokenB}</Text>
        </HStack>
      </Td>
      <Td>
        <Text fontSize="sm">{`${rewardAPR.toFixed(2)}%`}</Text>
      </Td>
      <Td>
        <Text fontSize="sm">{`$${formatNumber({
          value: Number(bribes),
        })}`}</Text>
      </Td>
      <Td>
        <Text fontSize="sm">{`${convertAmount(liquidityPer10kInspirit)}`}</Text>
      </Td>

      <Td>
        <Text fontSize="sm">{`$${formatNumber({
          value: Number(feeEarns),
        })}`}</Text>
      </Td>
      <Td>
        <HStack justify="center">
          <Text fontSize="sm">{`${userVotes}%`}</Text>
          <Text color="grayDarker" fontSize="sm">
            {totalVotesOnFarm}
          </Text>
        </HStack>
      </Td>
      <Td>
        <VotingInput
          yourVote={value}
          onNewVote={onNewVote}
          lpAddress={lpAddress}
          cleanError={cleanError}
          resetVoting={resetVoting}
        />
      </Td>
    </Tr>
  );
};

export default FarmsData;
