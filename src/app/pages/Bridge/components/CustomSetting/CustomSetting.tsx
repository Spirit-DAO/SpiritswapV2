import { HStack, Input, Text, VStack } from '@chakra-ui/react';
import { Switch } from 'app/components/Switch';
import { isAddress } from 'ethers/lib/utils';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { useEffect, useState } from 'react';
import { Props } from './CustomSetting.d';
import { useTranslation } from 'react-i18next';

const CustomSetting = ({ handleCustomAddress }: Props) => {
  const [showInput, setShowInput] = useState<boolean>(false);
  const { t } = useTranslation();

  const translationPath = 'bridge';

  const [customAddress, setCustomAddress] = useState('');
  const [warning, setWarning] = useState(false);
  const handleInput = e => {
    const checkAddress = isAddress(e.target.value);
    if (!checkAddress) setWarning(true);
    if (checkAddress) setWarning(false);
    setCustomAddress(e.target.value);
  };

  useEffect(() => {
    handleCustomAddress(customAddress);
  }, [customAddress, handleCustomAddress]);

  const handleToggle = () => {
    if (showInput) {
      setWarning(false);
      setCustomAddress('');
    }
    setShowInput(prevState => !prevState);
  };

  return (
    <VStack w="full" spacing={2} py="16px">
      <HStack w="full" justify="space-between">
        <HStack>
          <Text color="gray" fontSize="sm">
            {t(`${translationPath}.common.custom`)}
          </Text>
          <QuestionHelper
            title={t(`${translationPath}.help.title`)}
            text={t(`${translationPath}.help.description`)}
            iconWidth="16px"
          />
        </HStack>
        <Switch checked={showInput} onChange={handleToggle} />
      </HStack>
      {showInput && (
        <>
          <Input
            w="full"
            fontSize="base"
            value={customAddress}
            onChange={handleInput}
            placeholder="Enter destination address"
            _placeholder={{ color: 'grayDarker' }}
          />
          {warning && (
            <Text w="full" color="danger" fontSize="sm">
              {t(`${translationPath}.help.warning`)}
            </Text>
          )}
        </>
      )}
    </VStack>
  );
};

export default CustomSetting;
