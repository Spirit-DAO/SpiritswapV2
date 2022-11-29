import { HStack, Text, VStack } from '@chakra-ui/react';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { Props } from './ToggleBridge.d';
import { SettingIcon } from 'app/assets/icons';

const ToggleBridge = ({ openSettings, bridgeMode }: Props) => {
  return (
    <VStack w="full" spacing={2}>
      <HStack w="full" justify="space-between">
        <HStack>
          <Text color="gray" fontSize="sm">
            Bridge Mode
          </Text>
          <QuestionHelper
            title="Bridge Mode"
            text="You can decide if you want to have the cheapest or fastest bridge. Selecting 'Cheapest', it will take around 20-30 seconds to find a bridge. Selecting 'Fastest', it will be fast but need to be more than 10 USD to find a bridge."
            iconWidth="16px"
          />
        </HStack>
        <HStack>
          <Text>{bridgeMode}</Text>
          <SettingIcon onClick={openSettings} cursor="pointer" />
        </HStack>
      </HStack>
    </VStack>
  );
};

export default ToggleBridge;
