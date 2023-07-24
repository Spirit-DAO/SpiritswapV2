import { useEffect, useState } from 'react';
import type { Props } from './NewTokenAmountPanel.d';
import { PriceDiffIndicator } from '../PriceDiffIndicator';
import { Percentages } from '../Percentages';
import { useTranslation } from 'react-i18next';
import { TokenSelection } from '../TokenSelection';
import { ModalToken } from '../ModalToken';
import { useLocation } from 'react-router-dom';
import uniqBy from 'lodash/uniqBy';
import {
  checkAddress,
  getRoundedSFs,
  truncateTokenValue,
  validateInput,
} from 'app/utils';

import {
  NumberInput,
  NumberInputField,
  useDisclosure,
  Text,
  HStack,
  Skeleton,
  Flex,
} from '@chakra-ui/react';
import {
  FIRST_TOKEN_AMOUNT_PANEL,
  SECOND_TOKEN_AMOUNT_PANEL,
  LIQUIDITY_TOKENS,
  WFTM,
} from 'constants/tokens';
import { useTokenBalance } from 'app/hooks/useTokenBalance';
import { getTokensDetails } from 'utils/data/covalent';
import { useTokens } from 'app/hooks/useTokens';
import { TOKENS_BRIDGE } from 'constants/bridgeTokens';
import useLogin from 'app/connectors/EthersConnector/login';
import { selectIsLoggedIn } from 'store/user/selectors';
import { useAppSelector } from 'store/hooks';
import { LIQUIDITY, BRIDGE, resolveRoutePath } from 'app/router/routes';

const NewTokenAmountPanel = ({
  token,
  tokens,
  inputValue,
  bridge,
  onChange,
  onSelect,
  showPercentage,
  isSelectable = true,
  percentageOnFocus = false,
  poolPercentage,
  showConfirm,
  isLoading,
  isOutput,
  isLimit,
  context,
  priceDiff,
  showInputInUSD,
  setShowInputInUSD,
  showTokenSelection = true,
  inputWidth = 'full',
  handleCheckBalance,
  errorMessage,
  setErrorMessage,
  tradeUSD,
  showNumberInputField = true,
  showBalance = true,
  children,
  chainID,
  setBalance,
  maxValue,
  canApproveFunds,
  notShowCommonBase,
  tradeUsdValue,
  notSearchToken,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { handleLogin } = useLogin();
  const [mustShowPercentage, setMustShowPercentage] = useState(showPercentage);
  const [tokenPrice, setTokenPrice] = useState(0.0);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const handleOpen = isSelectable ? onOpen : undefined;
  const handleSelect = isSelectable ? onSelect : undefined;
  const { tokens: allTokens } = useTokens(chainID, bridge);

  if (!tokens) {
    tokens = uniqBy(allTokens, 'address');
  }
  if (bridge && chainID) {
    const [USDC, USDT, DAI]: string[] = TOKENS_BRIDGE[chainID];
    const filteredBridgeTokens = tokens?.filter(token => {
      const tokenAddress = token.address;
      if (checkAddress(tokenAddress, USDC)) return true;
      if (checkAddress(tokenAddress, USDT)) return true;
      if (checkAddress(tokenAddress, DAI)) return true;
      return false;
    });
    if (filteredBridgeTokens?.length) {
      tokens = filteredBridgeTokens;
    }
  }
  const { token: fetchedTokenWithBalance, isLoading: isLoadingBalance } =
    useTokenBalance(token?.chainId ?? 1, token?.address ?? '', context, token);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      const tokensPrices = await getTokensDetails(
        token?.symbol !== 'FTM' ? [token?.address ?? ''] : [WFTM.address],
        token?.chainId ?? 1,
      );
      tokensPrices.forEach(price => {
        if (
          price.address.toLowerCase() === token?.address.toLowerCase() ||
          (token?.symbol === 'FTM' &&
            price.address.toLowerCase() === WFTM.address.toLowerCase())
        ) {
          setTokenPrice(price.rate);
        }
      });
    };

    fetchTokenPrice();
  }, [token]);

  const onFocus = () => {
    if (percentageOnFocus) {
      setMustShowPercentage(true);
    }

    if (setErrorMessage) {
      if (
        (typeof errorMessage === 'object' || errorMessage !== undefined) &&
        !bridge
      ) {
        setErrorMessage({ canApprove: false, msg: '', relevantTokens: [] });
      } else {
        setErrorMessage('');
      }
    }
  };

  const onBlur = () => {
    if (percentageOnFocus) {
      setTimeout(() => {
        setMustShowPercentage(false);
      }, 100);
    }
  };

  const getBalance = () => {
    if (fetchedTokenWithBalance) {
      let rate = 0;
      let userBalance = '0';
      let usdValue = '0';

      if (tokenPrice) {
        rate = tokenPrice;
      }

      if (fetchedTokenWithBalance.amount) {
        userBalance = fetchedTokenWithBalance.amount;
      }

      if (!tradeUSD && fetchedTokenWithBalance.rate) {
        usdValue = `${
          parseFloat(inputValue || '0') * fetchedTokenWithBalance.rate
        }`;
      }

      if (tradeUSD) {
        usdValue = tradeUSD;
      }

      return {
        balance: userBalance,
        usd: usdValue,
        trunBalance:
          parseFloat(userBalance) < 0.001 && context === 'liquidity'
            ? '<0.000001'
            : truncateTokenValue(+userBalance, +rate),
      };
    }
    return {
      balance: '0',
      usd: '0.00',
      trunBalance: truncateTokenValue(0, 0),
    };
  };

  const { balance, trunBalance, usd } = getBalance();

  const handleInput = (value: string) => {
    if (!isLoggedIn) {
      handleLogin();
    }
    if (bridge === 'to') return;
    if (showConfirm) return;

    const numberValue = parseFloat(value);

    if (maxValue && numberValue > maxValue) {
      return (
        onChange && onChange({ tokenSymbol: token?.symbol, value: maxValue })
      );
    }
    const validInput = validateInput(value, token?.decimals);

    onChange &&
      onChange({
        tokenSymbol: token?.symbol,
        value: validInput,
      });

    if (balance) {
      handleCheckBalance?.({
        hasBalance:
          validInput !== ''
            ? parseFloat(validInput) <= parseFloat(balance)
            : true,
        symbol: token?.symbol,
        isOutput: isOutput,
      });
    }
  };

  const showCursorPointer = () => {
    if (showConfirm || bridge === 'to') return 'default';
    return 'pointer';
  };

  useEffect(() => {
    if (setBalance) setBalance(balance);

    handleCheckBalance?.({
      hasBalance: balance > inputValue,
      symbol: token?.symbol,
      isOutput: isOutput,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance]);

  const showDiff =
    !isLimit && isOutput && priceDiff && !isLoading && inputValue;

  const commonTokens = () => {
    if (notShowCommonBase) return [];
    if (pathname === resolveRoutePath(BRIDGE.path)) {
      return [];
    }
    if (pathname === resolveRoutePath(LIQUIDITY.path)) return LIQUIDITY_TOKENS;
    return isOutput ? SECOND_TOKEN_AMOUNT_PANEL : FIRST_TOKEN_AMOUNT_PANEL;
  };

  const amount = isLoggedIn ? `Balance: ${trunBalance}` : 'Connect Wallet';

  const getSRC = () => {
    if (token?.chainId === 250 && token.symbol)
      return resolveRoutePath(
        `images/tokens/${token.symbol.toUpperCase()}.png`,
      );
    return token?.logoURI;
  };

  const formatInputUSD = () => `$` + usd;

  const getBalanceValue = () => {
    if (showInputInUSD) {
      return `≈ ${getRoundedSFs(inputValue)} ${token?.symbol}`;
    }
    if (usd && +usd > 0 && +usd < 0.01) return '<$0.01';
    return `≈ $${parseFloat(usd).toFixed(2)}`;
  };

  const isTokenSelectorOnly =
    !showBalance && !showInputInUSD && !showNumberInputField && !showPercentage;

  return (
    <Flex
      bg="bgBoxLighter"
      py="spacing05"
      px="spacing04"
      flexDirection="column"
      w="full"
      borderRadius="md"
      {...props}
    >
      <HStack align="center" justify="space-between" w="100%">
        {showNumberInputField && (
          <Skeleton
            startColor="grayBorderBox"
            endColor="bgBoxLighter"
            isLoaded={!isLoading}
            w="60%"
            flexGrow={1}
          >
            <NumberInput
              clampValueOnBlur={false}
              max={maxValue}
              border="none"
              value={
                inputValue === 'NaN'
                  ? 0
                  : showInputInUSD
                  ? formatInputUSD()
                  : inputValue
              }
              onChange={value => handleInput(value)}
              onFocus={onFocus}
              onKeyDown={e => {
                if (e.code === 'End' || e.code === 'Home') {
                  return handleInput(inputValue);
                }
              }}
              onBlur={onBlur}
              isDisabled={showConfirm}
              isInvalid={!!errorMessage}
            >
              <NumberInputField
                w={inputWidth}
                inputMode="numeric"
                paddingInline="8px"
                placeholder="0"
                fontSize="xl2"
                _placeholder={{ color: 'gray' }}
              />
            </NumberInput>
          </Skeleton>
        )}

        {showTokenSelection && token && (
          <TokenSelection
            handleOpen={handleOpen}
            symbol={token.symbol}
            src={getSRC()}
            isSelectable={isSelectable}
            isTokenSelectorOnly={isTokenSelectorOnly}
          />
        )}
        {poolPercentage && (
          <Text ml="4px" color="grayDarker" fontSize="h5">
            {poolPercentage}
          </Text>
        )}
        {isSelectable && token ? (
          isOpen ? (
            <ModalToken
              tokens={tokens}
              commonTokens={commonTokens()}
              tokenSelected={token}
              bridge={bridge}
              onSelect={handleSelect}
              isOpen={isOpen}
              onClose={onClose}
              chainID={chainID}
              notSearchToken={notSearchToken}
            />
          ) : (
            ''
          )
        ) : isSelectable && bridge ? (
          <Skeleton
            startColor="grayBorderBox"
            endColor="bgBoxLighter"
            h="36px"
            w="120px"
          >
            <span>Loading</span>
          </Skeleton>
        ) : null}
      </HStack>
      {showBalance ? (
        <Flex w="full" align="center" justify="space-between">
          <Flex>
            <Text as="div" fontSize="h5" color="grayDarker" mr="spacing02">
              <Flex align="center" justify="center" sx={{ gap: '0.2rem' }}>
                <Text
                  _hover={{ cursor: 'pointer' }}
                  onClick={() =>
                    setShowInputInUSD && setShowInputInUSD(!showInputInUSD)
                  }
                >
                  {getBalanceValue()}
                </Text>
              </Flex>
            </Text>
            {showDiff ? <PriceDiffIndicator amount={priceDiff || 0} /> : null}
          </Flex>
          <Skeleton isLoaded={!isLoadingBalance}>
            <Text
              as="div"
              fontSize="sm"
              color="gray"
              mr="spacing04"
              cursor={showCursorPointer()}
              onClick={() => handleInput(balance)}
            >
              {amount}
            </Text>
          </Skeleton>
        </Flex>
      ) : null}
      {isLoading
        ? null
        : errorMessage && (
            <Text color="red.500" padding="spacing03 0">
              {t(errorMessage)}
            </Text>
          )}
      {mustShowPercentage && !showConfirm && token && (
        <Percentages
          onChange={value => handleInput(value.value)}
          decimals={token.decimals}
          symbol={token.symbol}
          balance={balance}
        />
      )}
      {children}
    </Flex>
  );
};

export default NewTokenAmountPanel;
