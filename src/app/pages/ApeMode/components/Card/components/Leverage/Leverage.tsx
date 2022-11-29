import { FC, useState } from 'react';
import { Props } from './Leverage.d';
import { LeverageSlider } from 'app/components/LeverageSlider';
import { Flex, Center, VStack, Text, Input, HStack } from '@chakra-ui/react';
import { AdjustLeverageIcon } from 'app/assets/icons';

const Leverage: FC<Props> = ({ title }) => {
  const [realValue, setRealValue] = useState<number>(1.1);
  const handleInputChange = event => {
    setRealValue(event.target.value);
  };
  const handleSliderValue = value => {
    setRealValue(value);
  };

  return (
    <Flex
      bg="bgBoxLighter"
      borderRadius="md"
      w="full"
      px="spacing03"
      py="spacing04"
      mb="spacing03"
    >
      <Center padding="10px">
        <AdjustLeverageIcon mt="10px" color="ci" w="24px" h="24px" />
      </Center>
      <VStack w="full" alignItems="flex-start">
        <Text fontSize="xs" color="gray">
          {title}
        </Text>
        <HStack justifyContent="space-around" alignItems="flex-start" w="full">
          <Input
            type="number"
            step="0.1"
            value={realValue}
            onChange={handleInputChange}
            size="xs"
            w="48px"
            h="36px"
            bg="bgInput"
            textAlign="center"
            borderColor="grayBorderBox"
            borderRadius="md"
            fontSize="xs"
            color="grayDarker"
            min="1.1"
            max="3"
          />
          <HStack w="full" p=" 0 15px 0 10px" alignItems="center">
            <LeverageSlider
              realValue={realValue}
              onStepSliderHandler={handleSliderValue}
            />
          </HStack>
        </HStack>
      </VStack>
    </Flex>
  );
};
export default Leverage;
