import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flex,
  Box,
  Icon as ChakraIcon,
  IconButton,
  Text,
} from '@chakra-ui/react';
import TotalTrading from 'app/pages/Liquidity/components/Trading/TotalTrading';
import { SelectList } from 'app/components/SelectList';
import { weightedpools } from 'constants/weightedpools';
import { ListPoolDetailsItem } from 'app/components/ListPoolDetailsItem';
import { StyledIconButton } from './styles';
import { ReactComponent as CaretDownIcon } from 'app/assets/images/caret-down.svg';
import { ReactComponent as ArrowDown } from 'app/assets/images/arrow-down.svg';
import { StyledIconPoolButton } from './styles';
import PlusLogoGreen from 'app/pages/Liquidity/components/PlusLogoGreen';
import { TokenAmountPanel } from 'app/components/NewTokenAmountPanel';
import { Switch } from 'app/components/Switch';
import { getTokensDetails } from 'utils/data';
import { NON_ZERO } from 'constants/errors';
import useWallets from 'app/hooks/useWallets';

const WeightedPanel = ({
  weightedPoolSelected,
  setWeightedPoolSelected,
  weightedPoolInputValue,
  setWeightedPoolInputValue,
  weightedLpAmountToReceive,
  lpTokenValue,
  setInputError,
  children,
}) => {
  const translationPath = 'liquidity.common';
  const { t } = useTranslation();
  const [showSelectPool, setShowSelectPool] = useState(false);
  const [proportionalInput, setProportionalInput] = useState(true);
  const [rates, setRates] = useState({});
  const { tokens } = useWallets();

  const handleShowSelectPool = () => {
    setShowSelectPool(true);
  };

  const handleSelectPool = item => {
    setShowSelectPool(false);
    setWeightedPoolSelected(item);
  };

  const retrievedProportions = (
    tokenSymbol: string,
    inputValue?: number | string | undefined,
  ) => {
    const newInputValues = {
      [tokenSymbol]: inputValue || weightedPoolInputValue[tokenSymbol],
    };

    const usdValue =
      Number(newInputValues[tokenSymbol]) *
      rates[tokenSymbol.toLowerCase()].rate;

    weightedPoolSelected?.tokens.forEach(token => {
      if (token.symbol.toLowerCase() !== tokenSymbol.toLocaleLowerCase()) {
        const { rate, decimals } = rates[token.symbol.toLowerCase()];
        const inputValue = (usdValue / rate).toFixed(decimals);

        newInputValues[token.symbol] = inputValue;
      }
    });

    return newInputValues;
  };

  const onPoolInputChange = ({
    tokenSymbol,
    value,
  }: {
    tokenSymbol: string;
    value: string;
  }) => {
    if (proportionalInput && value) {
      const newInputValues = retrievedProportions(tokenSymbol, value);

      return setWeightedPoolInputValue(newInputValues);
    }

    if (proportionalInput && !value) {
      return setWeightedPoolInputValue({});
    }

    setWeightedPoolInputValue({
      ...weightedPoolInputValue,
      [tokenSymbol]: value,
    });
  };

  const calculateProportionalValue = () => {
    const currentChoice = !proportionalInput;
    if (currentChoice) {
      // We verify if any of the inputs have been given
      const symbols = Object.keys(weightedPoolInputValue); // Only inputs with values are present
      const [firstTokenWithValue] = symbols;

      if (firstTokenWithValue) {
        const newInputValues = retrievedProportions(firstTokenWithValue);

        setWeightedPoolInputValue(newInputValues);
      }
    }
    setProportionalInput(currentChoice);
  };

  const formatWeight = (weight: number) => {
    return `${(weight * 100).toFixed(0)}%`;
  };

  useEffect(() => {
    const loadProportionalData = async () => {
      const addresses = weightedPoolSelected.tokens.map(token => token.address);
      const decimals = weightedPoolSelected.tokens.map(token => token.decimals);
      const pricingData = await getTokensDetails(addresses);
      const rateData = {};

      pricingData.forEach((token, index) => {
        rateData[token.symbol.toLocaleLowerCase()] = {
          rate: token.rate,
          decimals: decimals[index],
          address: token.address.toLocaleLowerCase(),
        };
      });

      setRates(rateData);
    };

    if (weightedPoolSelected?.tokens) {
      loadProportionalData();
    }
  }, [weightedPoolSelected]);

  useEffect(() => {
    if (tokens?.tokenList && Object.keys(weightedPoolInputValue).length > 0) {
      let insufficientBalance = false;
      let needsInputs = false;

      tokens.tokenList.forEach(token => {
        const input = weightedPoolInputValue[token?.symbol];
        if (Number(input) > Number(token.amount)) {
          insufficientBalance = true;
        }
      });

      Object.keys(weightedPoolInputValue).forEach(symbol => {
        const input = Number(weightedPoolInputValue[symbol] || 0);
        if (!input) {
          needsInputs = true;
        }
      });

      if (insufficientBalance) {
        setInputError(t('common.errors.not_enough_funds_from_inputs'));
      } else if (needsInputs) {
        setInputError(t(NON_ZERO));
      } else {
        setInputError(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightedPoolInputValue, tokens]);

  return (
    <>
      {!weightedPoolSelected && (
        <StyledIconButton
          label={t(`${translationPath}.selectWeightedPool`)}
          icon={<ChakraIcon as={CaretDownIcon} color="ci" />}
          iconPos="left"
          onClick={handleShowSelectPool}
        />
      )}
      {showSelectPool && (
        <SelectList
          isAbsolute
          options={weightedpools}
          ListItem={ListPoolDetailsItem}
          selectCallback={handleSelectPool}
          isDropdown
          closeDropdown={() => setShowSelectPool(false)}
          dropdownTitle={t(`${translationPath}.selectWeightedPool`)}
          top={{ base: '150px', md: '200px' }}
        />
      )}
      {weightedPoolSelected && (
        <>
          <StyledIconPoolButton
            icon={<ChakraIcon as={CaretDownIcon} color="ci" />}
            iconPos="right"
            onClick={handleShowSelectPool}
            poolItem={weightedPoolSelected}
          />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="41px"
          >
            <IconButton
              border="none"
              background="transparent"
              aria-label="arrow down"
              fontSize="24px"
              icon={<ChakraIcon as={ArrowDown} color="ci" />}
            />
          </Box>
          <Flex justify="space-between" w="100%" mb="10px">
            <Text color="gray" fontSize="sm">
              {t(`${translationPath}.investProportionally`)}
            </Text>
            <Switch
              checked={proportionalInput}
              onChange={calculateProportionalValue}
            />
          </Flex>
        </>
      )}
      {weightedPoolSelected?.tokens.map((token, index) => (
        <React.Fragment key={`weightedPanelElement${token.address}-${index}`}>
          {index !== 0 && (
            <PlusLogoGreen key={`tokenPool${token.address}symbol-${index}`} />
          )}
          <TokenAmountPanel
            key={`tokenPool${weightedPoolSelected.address}-${token.address}-${index}`}
            token={token}
            context="token"
            inputValue={weightedPoolInputValue[token.symbol]}
            onChange={onPoolInputChange}
            isSelectable={false}
            percentageOnFocus
            poolPercentage={formatWeight(weightedPoolSelected.weights[index])}
          />
        </React.Fragment>
      ))}
      {+weightedLpAmountToReceive ? (
        <TotalTrading
          liquidityTradeEstimate={`${weightedLpAmountToReceive} ${weightedPoolSelected?.symbol}`}
          liquidityTradeEstimateUSD={`≈ $${lpTokenValue}`}
        />
      ) : null}
      {weightedPoolSelected && children}
    </>
  );
};

export default WeightedPanel;
