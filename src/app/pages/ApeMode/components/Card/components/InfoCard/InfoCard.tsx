import React, { FC } from 'react';
import { Props } from './InfoCard.d';
import { useTranslation } from 'react-i18next';
import { Text, HStack, VStack, Center } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { DolarIcon } from 'app/assets/icons';

const InfoCard: FC<Props> = ({
  title,
  value,
  currency,
  isLiquidation,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'apeMode.common';
  return (
    <HStack
      bg="bgBoxLighter"
      borderRadius="md"
      w="full"
      spacing="spacing02"
      p="spacing02"
    >
      <Center>
        {isLiquidation ? (
          <DolarIcon w="24px" h="24px" />
        ) : (
          <ImageLogo symbol="FTM" size="24px" />
        )}
      </Center>
      <VStack spacing="0px" alignItems="flex-start">
        <Text fontSize="xs" color="gray">
          {title}
        </Text>
        <Text fontWeight="bold" color="white" fontSize="sm">
          {isLiquidation ? `$${value}` : `${value} ${currency}`}
        </Text>

        {isLiquidation ? (
          <HStack color="grayDarker" spacing="spacing02">
            <Text fontSize="xs" fontWeight="medium" color="ci">
              {t(`${translationPath}.risk.low`, 'Low Risk')}
            </Text>
            <Text fontSize="xxs">
              45.5% {t(`${translationPath}.risk.entry`, 'from entry')}
            </Text>
          </HStack>
        ) : (
          <Text fontSize="xs" color="grayDarker">
            ≈ $3,540.32
          </Text>
        )}
      </VStack>
    </HStack>
  );
};
export default InfoCard;
