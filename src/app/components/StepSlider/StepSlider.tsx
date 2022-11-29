import { HStack, VStack } from '@chakra-ui/react';
import { StyledItem, StyledItemWrapper, StyledLabel, StyledHr } from './styles';

const StepSlider = ({ currentValue, onChange, steps }) => {
  const onlyOne = steps.length === 1;
  return (
    <VStack w="full">
      <HStack
        w="full"
        justify={`${onlyOne ? 'center' : 'space-between'}`}
        top="23px"
        zIndex={1}
        position="relative"
      >
        {steps.map((item, i) => (
          <StyledItemWrapper
            key={`${item.unit}-${i}`}
            onClick={_item => onChange(item.unit)}
            isSelected={item.unit === currentValue}
          >
            <StyledItem />
            <StyledLabel>{item.unit}</StyledLabel>
          </StyledItemWrapper>
        ))}
      </HStack>
      <StyledHr />
    </VStack>
  );
};
export default StepSlider;
