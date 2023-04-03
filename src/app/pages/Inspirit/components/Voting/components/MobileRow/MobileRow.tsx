import { Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { BoostedFarm } from 'app/interfaces/Inspirit';
import { convertAmount, formatNumber } from 'app/utils';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { selectSpiritInfo } from 'store/general/selectors';
import { useAppSelector } from 'store/hooks';
import { VotingInput } from '../VotingInput';

const MobileRow = ({
  farm,
  resetInputs,
  onNewVote,
  cleanError,
  showAll,
}: {
  farm: BoostedFarm;
  onNewVote: (value: string, lpAddress: string) => void;
  resetInputs: boolean;
  cleanError: () => void;
  showAll: boolean;
}) => {
  const {
    bribes,
    name,
    value,
    userVotes,
    totalVotesOnFarm,
    fulldata,
    liquidityPer10kInspirit,
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
  const height = '50px';
  const heightBG = '60px';
  const justify = showAll ? 'flex-start' : 'center';
  return (
    <Grid templateColumns={`repeat(1, ${showAll ? '1fr' : '300px'})`} gap={2}>
      <GridItem
        w={showAll ? '184px' : '300px'}
        h={heightBG}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems="center"
        p="8px"
      >
        <VStack w="full" spacing={0}>
          <HStack spacing={0} justify={justify} w="full">
            <ImageLogo margin="0" symbol={tokenA} size="24px" />
            <ImageLogo symbol={tokenB} size="24px" />
          </HStack>
          <HStack spacing={0} w="full" justify={justify}>
            <Text fontWeight="medium" fontSize="sm">
              {tokenA}
            </Text>
            <Text color="grayDarker" fontSize="sm">
              +
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              {tokenB}
            </Text>
          </HStack>
        </VStack>
      </GridItem>
      <GridItem
        w={showAll ? '184px' : '300px'}
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems={justify}
        justifyContent="center"
        flexDirection="column"
        p="8px"
      >
        <Text fontSize="sm">{`${rewardAPR.toFixed(2)}%`}</Text>
      </GridItem>
      <GridItem
        w={showAll ? '184px' : '300px'}
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems={justify}
        justifyContent="center"
        flexDirection="column"
        p="8px"
      >
        <Text fontSize="sm">{`$${formatNumber({
          value: Number(bribes),
        })}`}</Text>
      </GridItem>
      <GridItem
        w={showAll ? '184px' : '300px'}
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems={justify}
        justifyContent="center"
        flexDirection="column"
        p="8px"
      >
        <Text fontSize="sm">{`${convertAmount(liquidityPer10kInspirit)}`}</Text>
      </GridItem>
      <GridItem
        w={showAll ? '184px' : '300px'}
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent={justify}
        p="8px"
      >
        <Text fontSize="sm">{`$${formatNumber({
          value: Number(feeEarns),
        })}`}</Text>
      </GridItem>
      <GridItem
        w={showAll ? '184px' : '300px'}
        h={height}
        bg="bgBoxLighter"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent={justify}
        p="8px"
      >
        <HStack>
          <Text fontSize="sm">{`${userVotes}%`}</Text>
          <Text color="grayDarker" fontSize="sm">
            {totalVotesOnFarm}
          </Text>
        </HStack>
      </GridItem>
      <GridItem w={showAll ? '184px' : '300px'} h={heightBG}>
        <VotingInput
          yourVote={value}
          onNewVote={onNewVote}
          lpAddress={lpAddress}
          cleanError={cleanError}
          resetVoting={resetInputs}
        />
      </GridItem>
    </Grid>
  );
};

export default MobileRow;
