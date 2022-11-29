import { FC } from 'react';

import { Icon, VStack, Text, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AdjustSlippageIcon } from 'app/assets/images/slippageSettings.svg';

const SettingsInfoConfirm: FC = ({ ...props }) => {
  const { t } = useTranslation();
  const translationPath = 'apeMode.common';
  return (
    <VStack
      justifyContent="space-around"
      w="full"
      fontSize="xs"
      spacing="spacing02"
    >
      <HStack justifyContent="space-between" w="full">
        <Text color="gray"> {t(`${translationPath}.rate`, 'Rate')}</Text>
        <Text fontWeight="bold" color="white">
          2.44052 MIM {t(`${translationPath}.per`, 'per')} wFTM
        </Text>
      </HStack>
      <HStack justifyContent="space-between" w="full">
        <Text color="gray">{t(`${translationPath}.borrow`, 'Borrow APY')}</Text>
        <Text color="white" fontWeight="bold">
          0.25%
        </Text>
      </HStack>
      <HStack justifyContent="space-between" w="full">
        <Text color="gray">
          {t(`${translationPath}.slippageToleranceLabel`, 'Slippage Tolerance')}
        </Text>
        <Text color="white" fontWeight="bold">
          0.1% <Icon as={AdjustSlippageIcon} w="16px" h="16px" />
        </Text>
      </HStack>
    </VStack>
  );
};
export default SettingsInfoConfirm;
