import { useState } from 'react';
import {
  Flex,
  InputGroup,
  Text,
  NumberInput,
  NumberInputField,
  InputRightElement,
  Skeleton,
} from '@chakra-ui/react';
import { Props } from './LimitOrders.d';
import { LimitOrderPanelFooterWrapper, InputIcon } from './styles';
import { ReactComponent as Refresh } from 'app/assets/images/refresh.svg';
import { useTranslation } from 'react-i18next';
import { checkInvalidValue, validateInput } from 'app/utils';

const LimitOrders = ({
  onChange,
  typeLimit,
  priceImpact,
  token,
  isLoading,
  getLimitTokenSymbol,
  baseLimit,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'common.tokenAmountPanel';

  const getPriceValue = () => {
    const ZERO = '0.0';
    if (Number(token.value) === 0 || !token.value) {
      return ZERO;
    }
    if (typeLimit === 'buy') return token.limitbuy ? token.limitbuy : ZERO;
    return token.limitsell ? token.limitsell : ZERO;
  };

  const priceValue = getPriceValue();
  const isBuy = typeLimit === 'buy';
  const getNumberLimit = (): number => {
    const ZERO = 0;
    if (baseLimit && baseLimit !== '0') {
      return isBuy ? 1 / parseFloat(baseLimit) : parseFloat(baseLimit);
    }
    return ZERO;
  };
  const numberLimit = getNumberLimit();

  const [inputLimit, setInputLimit] = useState(priceValue || undefined);

  if (!inputLimit && baseLimit) {
    setInputLimit(numberLimit.toFixed(6));
  }

  const handleInputChange = value => {
    const pruneValue = validateInput(value);
    setInputLimit(pruneValue);
    onChange(pruneValue);
  };

  if (!inputLimit && baseLimit) {
    handleInputChange(numberLimit.toFixed(6));
  }

  const getPriceImpact = priceImpact => {
    if (priceImpact === 1) return null;

    const priceImpactAbs = Math.abs(priceImpact);
    const aboveMarket = priceImpact > 0;

    return aboveMarket
      ? `${checkInvalidValue(`${priceImpactAbs}`)}% ${t(
          `swap.panels.limit.above`,
        )}`
      : `${checkInvalidValue(`${priceImpactAbs}`)}% ${t(
          `swap.panels.limit.below`,
        )}`;
  };

  const getPriceColor = priceImpact => {
    const aboveMarket = isBuy ? priceImpact < 0 : priceImpact > 0;

    return aboveMarket ? 'ci' : 'danger';
  };

  const limitTokenSymbol = getLimitTokenSymbol();
  const remLength = 2.25 + limitTokenSymbol.length * 0.4;

  return (
    <LimitOrderPanelFooterWrapper>
      <Flex direction="column">
        <Text fontSize="base">
          {t(`${translationPath}.setLimit.${typeLimit}`)}
        </Text>

        <Skeleton
          isLoaded={!isLoading}
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
        >
          <Text fontSize="sm" color={getPriceColor(priceImpact)}>
            {getPriceImpact(priceImpact)}
          </Text>
        </Skeleton>
      </Flex>
      <InputGroup w="60%" p="4px">
        <InputIcon
          ml={3}
          w="16px"
          color="ci"
          children={<Refresh />}
          onClick={() => {
            handleInputChange(numberLimit.toFixed(6));
          }}
        />
        <NumberInput
          border="none"
          size="sm"
          value={inputLimit}
          onChange={handleInputChange}
          isInvalid={!(Math.abs(Number(priceImpact)) > 0)}
          mr="20px"
        >
          <NumberInputField
            fontSize="base"
            w="100%"
            textAlign="right"
            paddingInlineEnd={`${remLength.toString()}rem`}
            _invalid={{ borderColor: 'danger' }}
            _placeholder={{ color: 'gray' }}
          />
          <InputRightElement fontSize="base" h="2.05rem" mr={4}>
            {limitTokenSymbol}
          </InputRightElement>
        </NumberInput>
      </InputGroup>
    </LimitOrderPanelFooterWrapper>
  );
};
export default LimitOrders;
