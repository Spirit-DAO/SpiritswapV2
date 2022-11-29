import { useCallback, useEffect, useState } from 'react';
import {
  Flex,
  Button,
  Text,
  Box,
  VStack,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { parseUnits } from 'ethers/lib/utils';
import ImageLogo from 'app/components/ImageLogo';
import { CardHeader } from 'app/components/CardHeader';
import PlusLogoGreen from '../PlusLogoGreen';
import { useTranslation } from 'react-i18next';
import { RemoveLiquidityProps } from '.';
import { ARROWBACK } from 'constants/icons';
import { stableSobPools } from 'constants/sobpools';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { Token } from 'app/interfaces/General';
import { CHAIN_ID } from 'constants/index';
import contracts from 'constants/contracts';
import { checkAllowance } from 'utils/web3/actions';
import {
  buildCheckAndApprove,
  buildRemoveLiquidityV2,
} from 'app/components/TransactionFlow/utils/helper';
import { TransactionFlow } from 'app/components/TransactionFlow';
import {
  estimateRemoveLiquidity,
  queryExitPool,
} from 'utils/web3/actions/liquidity';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { weightedpools } from 'constants/weightedpools';
import { useAppSelector } from 'store/hooks';
import { selectUserSettings } from 'store/settings/selectors';
import useWallets from 'app/hooks/useWallets';
import { getMappedTokens } from 'utils/data';

const RemoveLiquidity = ({ onCancel, LpPair }: RemoveLiquidityProps) => {
  const { t } = useTranslation();
  const { addToQueue } = Web3Monitoring();
  const { account } = useWallets();
  const translationPath = 'liquidity.removeLiquidity';
  const translationPathCommon = 'liquidity.common';
  const [tokensList, settokensList] = useState<Token[]>();
  const ROUTER_ADDRESS =
    LpPair.title &&
    (LpPair.title.includes('vLP') || LpPair.title.includes('sLP'))
      ? contracts.routerV2[CHAIN_ID]
      : contracts.router[CHAIN_ID];
  const [haveToApprove, sethaveToApprove] = useState(false);
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const [inputValue, setInputValue] = useState('0');
  const [estimates, setEstimates] = useState(new Map());
  const [steps, setSteps] = useState<any>([]);
  const { isOpen, onOpen: onOpenTransactionFlow, onClose } = useDisclosure();
  const { notifications } = useAppSelector(selectUserSettings);
  const getSobPool = address => {
    const [sobPool] = stableSobPools.filter(sobPool => {
      return address === sobPool.address;
    });
    return sobPool ?? false;
  };

  const getWeightedPool = (address: string) => {
    const [wPool] = weightedpools.filter(wpool => {
      return `${address}`.toLowerCase() === `${wpool.address}`.toLowerCase();
    });
    return wPool ?? false;
  };

  const isSobPool = getSobPool(LpPair.address) ? true : false;

  const newLPToken = {
    ...LpPair,
    decimals: 18,
    chainId: CHAIN_ID,
  };

  useEffect(() => {
    const init = async () => {
      const transactionSteps: any[] = [];
      let requiresApproval = true;
      const formattedValue = parseUnits(inputValue, 18);

      if (!isSobPool && inputValue) {
        const approvedForRemoval = await checkAllowance(
          account,
          LpPair.address,
          ROUTER_ADDRESS,
        );

        const isNotApproved =
          formattedValue.gt(approvedForRemoval) || approvedForRemoval.eq(0);

        if (isNotApproved) {
          sethaveToApprove(true);
          transactionSteps.push(
            buildCheckAndApprove(
              0,
              account,
              {
                token: LpPair as Token,
                amount: inputValue,
              },
              ROUTER_ADDRESS,
              false,
              true,
            ),
          );
        } else {
          requiresApproval = false;
          sethaveToApprove(false);
        }
      }

      const step = requiresApproval ? 1 : 0;

      if (LpPair.lpType === 'weighted') {
        const selectedPool = getWeightedPool(LpPair.address);
        transactionSteps.push(
          buildRemoveLiquidityV2(
            step,
            account,
            {
              token: selectedPool,
              amount: inputValue,
            },
            tokensList ? tokensList[0] : ({} as Token),
            tokensList ? tokensList[1] : ({} as Token),
            estimates,
            LpPair.lpType,
          ),
        );
      } else {
        transactionSteps.push(
          buildRemoveLiquidityV2(
            step,
            account,
            {
              token: LpPair as Token,
              amount: inputValue,
            },
            tokensList ? tokensList[0] : ({} as Token),
            tokensList ? tokensList[1] : ({} as Token),
            undefined,
            undefined,
            !LpPair.name.includes(' LP'),
            LpPair.name.includes('sLP'),
          ),
        );
      }

      setSteps(transactionSteps);
    };
    if (inputValue && account) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    account,
    inputValue,
    LpPair,
    isSobPool,
    ROUTER_ADDRESS,
    setSteps,
    estimates,
  ]);

  const verifyAllowance = useCallback(async () => {
    sethaveToApprove(false);

    if (!isSobPool && inputValue) {
      const formattedValue = parseUnits(inputValue, 18);

      const approvedForRemoval = await checkAllowance(
        account,
        LpPair.address,
        ROUTER_ADDRESS,
      );
      const isNotApproved =
        formattedValue.gt(approvedForRemoval) || approvedForRemoval.eq(0);

      if (isNotApproved) {
        sethaveToApprove(true);
      } else {
        sethaveToApprove(false);
      }
    }
  }, [LpPair, ROUTER_ADDRESS, account, isSobPool, inputValue]);

  const handleRemoveLiquidity = async () => {
    try {
      if (steps.length > 1) {
        onOpenTransactionFlow();
      } else {
        const [finalStep] = steps;
        loadingOn();

        if (finalStep.action) {
          await finalStep.fn({
            params: finalStep.params,
            action: finalStep.action,
            indes: steps.length - 1,
            steps,
            setSteps,
            notifications,
            addToQueue,
            force: true,
          });
        } else {
          await finalStep.fn({
            ...finalStep.params,
            index: steps.length - 1,
            steps,
            setSteps,
            notifications,
            addToQueue,
            force: true,
          });
        }
        loadingOff();
        onCancel();
      }
    } catch (e) {
      loadingOff();
    }
  };

  useEffect(() => {
    const getTokens = async () => {
      const mappedtokens = await getMappedTokens('symbol');
      const tokenA = mappedtokens[LpPair.tokens[0].toLowerCase()];
      const tokenB = mappedtokens[LpPair.tokens[1].toLowerCase()];
      settokensList([tokenA, tokenB]);
    };
    getTokens();
  }, [LpPair.tokens]);

  const onChange = ({ value }: { value: string }) => {
    setInputValue(value);
  };

  useEffect(() => {
    const getEstimates = async () => {
      loadingOn();
      const response = await estimateRemoveLiquidity(
        account,
        LpPair.address,
        tokensList ? tokensList[0] : ({} as Token),
        tokensList ? tokensList[1] : ({} as Token),
        inputValue,
      );

      setEstimates(response);
      loadingOff();
    };

    const getWeightedPoolExitEstimates = async () => {
      // TODO: Add slippage
      const pool = getWeightedPool(LpPair.address);
      const tokensWithZeroMin = LpPair?.tokensAmounts?.map(data => ({
        token: data.token,
        amount: 0,
      }));

      const response = await queryExitPool(
        pool,
        inputValue,
        tokensWithZeroMin,
        account,
      );

      const result = new Map();

      response.forEach(data => {
        if (data.amount) {
          result.set(data?.token?.address, data);
        }
      });
      setEstimates(result);
    };

    if (LpPair.lpType === 'weighted') {
      getWeightedPoolExitEstimates();
    } else if (inputValue) {
      getEstimates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, LpPair, account, tokensList]);

  useEffect(() => {
    if (!haveToApprove && account) {
      verifyAllowance();
    }
  }, [verifyAllowance, haveToApprove, account]);

  return (
    <Box
      bgColor="bgBox"
      borderRadius="md"
      borderWidth="1px"
      maxW="504px"
      p="spacing06"
      w={{ base: '95%', lg: '100%' }}
      mb="spacing06"
    >
      <TransactionFlow
        heading={t('liquidity.common.removeLiquidity')}
        generalText={t('liquidity.common.confirmAllTransactionsDelete')}
        arrayOfSteps={steps}
        handleFinish={() => {
          onClose();
          loadingOff();
          onCancel();
        }}
        onClose={onClose}
        isOpen={isOpen}
        disabled={!inputValue}
        nextStep={() => void 0}
        notifications={notifications}
      />
      <CardHeader
        hidebackground
        title={t(`${translationPath}.title`)}
        id={ARROWBACK}
        onIconClick={onCancel}
        hideQuestionIcon
      />

      <VStack w="full" spacing="16px" mt="spacing06" mb="spacing06">
        <VStack spacing="spacing03" align="start" w="full">
          <Text>{t(`${translationPath}.redeem`)}</Text>
          <Text fontSize="xl">{LpPair?.title}</Text>
          <Flex>
            {LpPair?.tokens?.map(token => (
              <ImageLogo
                symbol={token}
                size="32px"
                key={`${token}-tokens-list`}
              />
            ))}
          </Flex>
        </VStack>

        <Box w="full">
          <NewTokenAmountPanel
            showPercentage
            context="liquidity"
            onChange={onChange}
            token={newLPToken}
            inputValue={inputValue}
            showTokenSelection={false}
          />
        </Box>

        <Box w="full">
          <Text mb="spacing02" color="ci" fontSize="sm">
            {t(`${translationPathCommon}.youWillReceive`)}
          </Text>
          {tokensList?.map((token, index) => {
            const isTheLast = index === tokensList.length - 1;
            if (isTheLast)
              return (
                <NewTokenAmountPanel
                  key={token.address}
                  context="token"
                  inputValue={estimates.get(token.address)?.amount ?? ''}
                  token={token}
                  isSelectable={false}
                  showConfirm={true}
                />
              );
            return (
              <div key={token.symbol}>
                <NewTokenAmountPanel
                  key={token.address}
                  context="token"
                  inputValue={estimates.get(token.address)?.amount ?? ''}
                  token={token}
                  isSelectable={false}
                  showConfirm={true}
                />
                <PlusLogoGreen key={token.symbol} />
              </div>
            );
          })}
        </Box>
      </VStack>

      <HStack spacing={1}>
        <Button variant="secondary" w="full" onClick={onCancel}>
          {t(`${translationPathCommon}.cancel`)}
        </Button>
        <Button w="full" isLoading={isLoading} onClick={handleRemoveLiquidity}>
          {t(`${translationPathCommon}.confirm`)}
        </Button>
      </HStack>
    </Box>
  );
};

export default RemoveLiquidity;
