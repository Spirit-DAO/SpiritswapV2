import { PriceDiffIndicatorProps } from '.';
import { Text, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const PriceDiffIndicator = ({ amount }: PriceDiffIndicatorProps) => {
  const getColor = () => {
    if (amount >= -1.99) return 'ci';
    if (amount <= -2 && amount >= -4.99) return 'warning';
    if (amount <= -5) return 'danger';
  };
  const { t } = useTranslation();

  const parsedPriceDiff =
    Math.abs(amount) > 0 && Math.abs(amount) < 0.01
      ? '<0.01'
      : amount.toFixed(2);

  return (
    <Tooltip bg="bgBoxLighter" label={t('common.tokenAmountPanel.priceDiff')}>
      <Text fontSize="h5" color={getColor()}>
        ({parsedPriceDiff}%)
      </Text>
    </Tooltip>
  );
};

export default PriceDiffIndicator;
