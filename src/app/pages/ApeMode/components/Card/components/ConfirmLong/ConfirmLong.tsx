import { FC, useState } from 'react';
import { VStack, HStack, Text, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Props } from './ConfirmLong.d';
import { useProgressToast } from 'app/hooks/Toasts/useProgressToast';
import { InfoCard } from '../InfoCard';
import SettingsInfoConfirm from './SettingsInfoConfirm';
import { CardHeader } from 'app/components/CardHeader';
import tokens from 'constants/tokens';
import { Token } from 'app/interfaces/General';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
const ConfirmLong: FC<Props> = ({ token, value, hideConfirmation }: Props) => {
  const { t } = useTranslation();
  const [inputToken, setInputToken] = useState(tokens[0]);
  const translationPath = 'apeMode.common';
  const { showToast } = useProgressToast();

  const handleSelectInput = (item: Token, onClose: () => void) => {
    setInputToken(item);
    onClose();
  };
  return (
    <VStack
      borderRadius="md"
      p="spacing055"
      border="1px"
      borderColor="grayBorderBox"
      alignItems="flex-start"
      bgColor="bgBox"
    >
      <CardHeader
        id="arrowBack"
        title="Confirm Long"
        onIconClick={hideConfirmation}
        hidebackground
        hideQuestionIcon
      />

      <VStack w="full" p="spacing02" alignItems="flex-start">
        <NewTokenAmountPanel
          inputValue="1.0"
          context="token"
          token={inputToken}
          onSelect={handleSelectInput}
          isSelectable={false}
        />

        <Text fontSize="md" color="white">
          {t(`${translationPath}.youPay`, 'You Pay')}
        </Text>

        <HStack w="full" spacing="spacing02">
          <InfoCard isLiquidation title="Position size" value="836.16" />
          <InfoCard isLiquidation title="Liquidation Price" value="1.056" />
        </HStack>
        <SettingsInfoConfirm />
        <HStack w="full" spacing="spacing02">
          <Button onClick={hideConfirmation} w="full" bg="grayBorderBox">
            Cancel
          </Button>
          <Button
            onClick={() =>
              showToast({
                title: 'Ape Pending',
                id: 'pending',
                type: 'pending',
                inputSymbol: 'FTM',
                outputSymbol: 'SPIRIT',
                inputValue: '45434',
                outputValue: '55666',
              })
            }
            w="full"
          >
            Confirm
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};
export default ConfirmLong;
