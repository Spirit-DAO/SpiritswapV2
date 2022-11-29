import { FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Props } from './Switch.d';
import {
  StyledHeading,
  StyledChekbox,
  StyledInput,
  StyledSlider,
} from './styles';

const Switch: FC<Props> = ({
  id = 'switch-checkbox',
  label,
  checked,
  onChange,
  ...props
}: Props) => {
  return (
    <Flex align="center" {...props}>
      <StyledHeading level={5}>
        <Text color="gray" fontWeight="medium" mr="4px">
          {label}
        </Text>
      </StyledHeading>
      <StyledChekbox>
        <StyledInput
          id={id}
          name={id}
          checked={checked}
          onChange={() => onChange && onChange(!checked)}
        />
        <StyledSlider />
      </StyledChekbox>
    </Flex>
  );
};

export default Switch;
