import { HStack, VStack, Link, Text } from '@chakra-ui/react';
import { LinkIcon } from 'app/assets/icons';
import { useTranslation } from 'react-i18next';
import { SlippageIcon } from 'app/assets/icons';
import { QuestionHelper } from 'app/components/QuestionHelper';

const SettingsInfo = ({ helperContent }) => {
  const { t } = useTranslation();
  const translationPath = 'apeMode.common';

  return (
    <HStack
      border="1px solid"
      borderColor="grayBorderBox"
      borderRadius="md"
      bg="bgBox"
      w="full"
      spacing="spacing02"
      py="spacing06"
      px="spacing06"
    >
      <VStack spacing="0px" alignItems="flex-start" w="full">
        <HStack
          justifyContent="space-between"
          color="grayDarker"
          spacing="spacing01"
          w="full"
        >
          <Text fontSize="xs" color="gray">
            {t(`${translationPath}.price`, 'Price')}
          </Text>
          <Text fontWeight="bold" color="white" fontSize="xs">
            {`2.44052 MIM  ${t(`${translationPath}.per`, 'per')} wFTM`}
          </Text>
        </HStack>
        <HStack
          justifyContent="space-between"
          color="grayDarker"
          spacing="spacing01"
          w="full"
        >
          <Text fontSize="xs" color="gray">
            {t(
              `${translationPath}.slippageToleranceLabel`,
              'Slippage Tolerance',
            )}{' '}
            <QuestionHelper
              title={helperContent?.title || ''}
              text={helperContent?.text || ''}
              importantText={helperContent?.importantText}
              showDocs={helperContent?.showDocs}
              iconWidth="16px"
            />
          </Text>
          <HStack justifyContent="flex-end" color="grayDarker" spacing="8px">
            <Text fontWeight="bold" color="white" fontSize="xs">
              0.1%
            </Text>
            <SlippageIcon w="15px" />
          </HStack>
        </HStack>
        <HStack
          justifyContent="space-between"
          color="grayDarker"
          spacing="spacing01"
          w="full"
        >
          <Text fontSize="xs" color="gray">
            {t(`${translationPath}.borrow`, 'Borrow APY')}
          </Text>
          <Text fontWeight="bold" color="white" fontSize="xs">
            0.25%
          </Text>
        </HStack>
        <HStack
          justifyContent="space-between"
          color="grayDarker"
          spacing="spacing01"
          w="full"
        >
          <Text fontSize="xs" color="gray">
            MIM {t(`${translationPath}.left`, 'left to borrow')}
          </Text>
          <Text fontWeight="bold" color="white" fontSize="xs">
            500,941
          </Text>
        </HStack>
        <HStack justifyContent="center" alignItems="center" w="full">
          <Link fontSize="xs" fontWeight="bold" isExternal color="ci">
            {t(`${translationPath}.deposit`, 'Deposit to MIM vault')}
            <LinkIcon mx="2px" size={22} />
          </Link>
        </HStack>
      </VStack>
    </HStack>
  );
};
export default SettingsInfo;
