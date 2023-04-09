import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { updateSelectedPreset } from 'store/v3/mint/actions';
import { useInitialTokenPrice } from 'store/v3/mint/hooks';
import {
  Button,
  Flex,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import type { Props } from './RangeSelectorPart.d';

function RangeSelectorPart({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  tokenA,
  tokenB,
  incrementDisabled = false,
  locked,
  onUserInput,
  disabled,
  title,
}: Props) {
  const [localUSDValue, setLocalUSDValue] = useState('');
  const [localTokenValue, setLocalTokenValue] = useState('');

  const dispatch = useAppDispatch();

  const initialTokenPrice = useInitialTokenPrice();

  const handleOnBlur = useCallback(() => {
    onUserInput(localTokenValue);
  }, [localTokenValue, localUSDValue, onUserInput]);

  // for button clicks
  const handleDecrement = useCallback(() => {
    onUserInput(decrement());
  }, [decrement, onUserInput]);

  const handleIncrement = useCallback(() => {
    onUserInput(increment());
  }, [increment, onUserInput]);

  useEffect(() => {
    if (value) {
      setLocalTokenValue(value);
      if (value === '∞') {
        setLocalUSDValue(value);
        return;
      }
    } else if (value === '') {
      setLocalTokenValue('');
      setLocalUSDValue('');
    }
  }, [initialTokenPrice, value]);

  return (
    <div>
      <Flex mb={2}>
        <Text>{title}</Text>
        <Flex ml={'auto'}>
          <Button
            onClick={handleDecrement}
            disabled={decrementDisabled || disabled}
            variant="ghost"
            size={'sm'}
            mr={2}
          >
            -
          </Button>
          <Button
            onClick={handleIncrement}
            disabled={incrementDisabled || disabled}
            variant="ghost"
            size={'sm'}
          >
            +
          </Button>
        </Flex>
      </Flex>
      <Flex pos={'relative'}>
        <NumberInput
          value={localTokenValue}
          id={title}
          clampValueOnBlur={false}
          onBlur={handleOnBlur}
          border="none"
          isDisabled={disabled || locked}
          onChange={val => {
            setLocalTokenValue(val.trim());
            dispatch(updateSelectedPreset({ preset: null }));
          }}
          placeholder="0.00"
          w={'full'}
        >
          <NumberInputField
            inputMode="numeric"
            paddingInline="8px"
            fontSize="sm"
            placeholder="0.00"
            _placeholder={{ color: 'gray' }}
            w={'full'}
          />
        </NumberInput>
      </Flex>
    </div>
  );
}

export default RangeSelectorPart;
