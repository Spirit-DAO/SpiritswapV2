import { Box, Flex, Skeleton, Stack, Text } from '@chakra-ui/react';
import { TokenAmountPanel } from 'app/components/NewTokenAmountPanel';
import { Token } from 'app/interfaces/General';
import Heading from 'app/components/Typography/Heading';
import PlusLogoGreen from '../../PlusLogoGreen';
import {
  useV3DerivedMintInfo,
  useV3MintActionHandlers,
  useV3MintState,
} from 'store/v3/mint/hooks';
import { useEffect, useMemo } from 'react';
import { useCurrency } from 'app/hooks/v3/useCurrency';
import { useAppDispatch } from 'store/hooks';
import {
  Field,
  setInitialTokenPrice,
  setInitialUSDPrices,
  updateCurrentStep,
  updateSelectedPreset,
} from 'store/v3/mint/actions';
import { PoolState } from 'app/hooks/v3/usePools';
import useWallets from 'app/hooks/useWallets';
import { Percent } from '../../../../../../v3-sdk';
import { SelectRange } from '../../V3/SelectRange/SelectRange';
import { EnterAmounts } from '../../V3/EnterAmounts/EnterAmounts';
import { InitialPrice } from '../../V3/InitialPrice/InitiallPrice';
import { StyledWarningNotification } from '../../V3/SelectRange/styled';
import { openInNewTab } from 'app/utils/redirectTab';
import { AlgebraLogo } from 'app/assets/icons';

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000);
const ZERO_PERCENT = new Percent('0');

const ConcentratedPanel = ({
  firstToken,
  secondToken,
  handleChangeInput,
  handleChangeToken,
  lpTokenValue,
  liquidityTrade,
  ipLoading,
  opLoading,
  errorMessage,
  setCanApproveFunds,
  canApproveFunds,
  children,
}) => {
  const { account } = useWallets();

  const dispatch = useAppDispatch();

  const baseCurrency = useCurrency(firstToken?.tokenSelected?.address);
  const currencyB = useCurrency(secondToken?.tokenSelected?.address);

  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.equals(currencyB)
      ? undefined
      : currencyB;

  const mintInfo = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    100,
    baseCurrency ?? undefined,
    undefined,
  );

  const {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  } = useV3MintActionHandlers(mintInfo.noLiquidity);

  const { startPriceTypedValue } = useV3MintState();

  const { independentField, typedValue } = useV3MintState();

  const formattedAmounts = {
    [independentField]: typedValue,
    [mintInfo.dependentField]:
      mintInfo.parsedAmounts[mintInfo.dependentField]?.toSignificant(6) ?? '',
  };

  function resetState() {
    dispatch(updateSelectedPreset({ preset: null }));
    dispatch(setInitialTokenPrice({ typedValue: '' }));
    dispatch(setInitialUSDPrices({ field: Field.CURRENCY_A, typedValue: '' }));
    dispatch(setInitialUSDPrices({ field: Field.CURRENCY_B, typedValue: '' }));
    onFieldAInput('');
    onFieldBInput('');
    onLeftRangeInput('');
    onRightRangeInput('');
    onStartPriceInput('');
  }

  const stepPair = useMemo(() => {
    return Boolean(
      baseCurrency &&
        quoteCurrency &&
        mintInfo.poolState !== PoolState.INVALID &&
        mintInfo.poolState !== PoolState.LOADING,
    );
  }, [baseCurrency, quoteCurrency, mintInfo]);

  const stepRange = useMemo(() => {
    return Boolean(
      mintInfo.lowerPrice &&
        mintInfo.upperPrice &&
        !mintInfo.invalidRange &&
        account,
    );
  }, [mintInfo]);

  const stepAmounts = useMemo(() => {
    if (mintInfo.outOfRange) {
      return Boolean(
        mintInfo.parsedAmounts[Field.CURRENCY_A] ||
          (mintInfo.parsedAmounts[Field.CURRENCY_B] && account),
      );
    }
    return Boolean(
      mintInfo.parsedAmounts[Field.CURRENCY_A] &&
        mintInfo.parsedAmounts[Field.CURRENCY_B] &&
        account,
    );
  }, [mintInfo]);

  const stepInitialPrice = useMemo(() => {
    return mintInfo.noLiquidity
      ? Boolean(+startPriceTypedValue && account)
      : false;
  }, [mintInfo, startPriceTypedValue]);

  useEffect(() => {
    resetState();
    dispatch(updateCurrentStep({ currentStep: 0 }));
  }, [firstToken, secondToken]);

  useEffect(() => {
    return () => {
      dispatch(updateCurrentStep({ currentStep: 0 }));
    };
  }, []);

  const isLoading =
    mintInfo.poolState === PoolState.LOADING ||
    mintInfo.poolState === PoolState.INVALID;

  return (
    <>
      <Box mb={4}>
        <Heading level={2}>1. Select pair</Heading>
      </Box>
      <Flex align={'center'}>
        <TokenAmountPanel
          key="tokenA"
          onSelect={(item: Token, onClose) =>
            handleChangeToken(item, 0, onClose)
          }
          token={firstToken?.tokenSelected}
          inputValue={formattedAmounts[Field.CURRENCY_A] || ''}
          showPercentage={false}
          showBalance={false}
          showInputInUSD={false}
          context="token"
          onChange={({ value }) => handleChangeInput(value, 0)}
          isLoading={ipLoading}
          setErrorMessage={setCanApproveFunds}
          canApproveFunds={canApproveFunds.canApprove}
          showNumberInputField={false}
        />
        <Box mx={4}>
          <PlusLogoGreen />
        </Box>
        <TokenAmountPanel
          key="tokenB"
          onSelect={(item: Token, onClose) =>
            handleChangeToken(item, 1, onClose)
          }
          token={secondToken?.tokenSelected}
          inputValue={formattedAmounts[Field.CURRENCY_B] || ''}
          context="token"
          onChange={({ value }) => handleChangeInput(value, 1)}
          isLoading={opLoading}
          setErrorMessage={setCanApproveFunds}
          canApproveFunds={canApproveFunds.canApprove}
          showNumberInputField={false}
          showPercentage={false}
          showBalance={false}
          showInputInUSD={false}
        />
      </Flex>

      {isLoading ? (
        <>
          <Skeleton
            w={'full'}
            h={'80px'}
            startColor="grayBorderBox"
            endColor="bgBoxLighter"
            my={4}
          />
          <Skeleton
            w={'full'}
            h={'40px'}
            startColor="grayBorderBox"
            endColor="bgBoxLighter"
            my={4}
          />
          <Skeleton
            w={'full'}
            h={'50px'}
            startColor="grayBorderBox"
            endColor="bgBoxLighter"
            my={4}
          />
        </>
      ) : (
        <Stack mt={4}>
          {mintInfo.noLiquidity &&
            mintInfo.poolState === PoolState.NOT_EXISTS && (
              <StyledWarningNotification>
                You are the first one, who creates this pool. To continue, you
                need to set the initial price
              </StyledWarningNotification>
            )}

          <Box>
            {mintInfo.noLiquidity &&
            mintInfo.poolState === PoolState.NOT_EXISTS ? (
              <Heading level={2}>2. Set initial price</Heading>
            ) : (
              <Heading level={2}>2. Select range</Heading>
            )}
          </Box>

          {mintInfo.noLiquidity &&
            mintInfo.poolState === PoolState.NOT_EXISTS && (
              <InitialPrice
                currencyA={baseCurrency ?? undefined}
                currencyB={currencyB ?? undefined}
                mintInfo={mintInfo}
                isCompleted={stepInitialPrice}
                backStep={0}
              />
            )}

          {mintInfo.noLiquidity &&
            mintInfo.poolState === PoolState.NOT_EXISTS && (
              <Heading level={2}>3. Select range</Heading>
            )}

          {mintInfo.price ? (
            <SelectRange
              currencyA={baseCurrency}
              currencyB={quoteCurrency}
              mintInfo={mintInfo}
              disabled={!stepPair}
              isCompleted={stepRange}
              additionalStep={stepInitialPrice}
              backStep={stepInitialPrice ? 1 : 0}
            />
          ) : (
            <Flex
              alignItems="center"
              justifyContent="center"
              w={'full'}
              h={'100px'}
              bg="bgBoxLighter"
            >
              Set Initial Price
            </Flex>
          )}

          {mintInfo.noLiquidity ? (
            <Heading level={2}>4. Enter amounts</Heading>
          ) : (
            <Heading level={2}>3. Enter amounts</Heading>
          )}

          {mintInfo.price && mintInfo.lowerPrice && mintInfo.upperPrice ? (
            <EnterAmounts
              currencyA={baseCurrency ?? undefined}
              currencyB={currencyB ?? undefined}
              mintInfo={mintInfo}
              isCompleted={stepAmounts}
              additionalStep={stepInitialPrice}
              backStep={stepInitialPrice ? 2 : 1}
              firstToken={firstToken}
              secondToken={secondToken}
              handleChangeInput={handleChangeInput}
            />
          ) : (
            <Flex
              alignItems="center"
              justifyContent="center"
              w={'full'}
              h={'100px'}
              bg="bgBoxLighter"
            >
              Select Range
            </Flex>
          )}
        </Stack>
      )}

      {children}

      <Box textAlign="right" mt="16px">
        <Text
          fontSize="12px"
          _hover={{
            cursor: 'pointer',
          }}
          onClick={() => openInNewTab('https://www.algebra.finance/')}
        >
          Powered by {''}
          <AlgebraLogo h="auto" w="90px" />
        </Text>
      </Box>
    </>
  );
};

export default ConcentratedPanel;
