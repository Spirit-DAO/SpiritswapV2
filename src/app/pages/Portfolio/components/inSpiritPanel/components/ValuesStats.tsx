import { Flex } from '@chakra-ui/react';
import { Heading } from 'app/components/Typography';
import { useTranslation } from 'react-i18next';
import { ValuesStatsProps } from '..';

const ValuesStats = ({ totalValue }: ValuesStatsProps) => {
  const { t } = useTranslation();
  const commonTranslationPath = 'portfolio.common';
  return (
    <>
      {totalValue ? (
        <Flex w="full" align="center" justifyContent="space-between">
          <Heading level={4}>
            {t(`${commonTranslationPath}.totalValue`)}
          </Heading>
          <Heading level={2}>${totalValue.toFixed(2)}</Heading>
        </Flex>
      ) : null}
    </>
  );
};

export default ValuesStats;
