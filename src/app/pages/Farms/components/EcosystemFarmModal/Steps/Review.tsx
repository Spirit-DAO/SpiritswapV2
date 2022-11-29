import { Flex, Text } from '@chakra-ui/react';
import { EmissionSettings } from './EmissionSettings';
import { TokensInLP } from './TokensInLP';
import { useTranslation } from 'react-i18next';

export const Review = () => {
  const translationRoot = `farms.ecosystem.review`;
  const { t } = useTranslation();

  return (
    <Flex direction={'column'} gap="spacing05">
      <Text>{t(`${translationRoot}.legend`)}</Text>
      <TokensInLP showLabel={false} isReview={true} />
      <EmissionSettings showLabel={false} isReview={true} />
    </Flex>
  );
};
