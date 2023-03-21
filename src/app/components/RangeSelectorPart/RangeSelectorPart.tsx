import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { updateSelectedPreset } from 'store/v3/mint/actions';
import { useInitialTokenPrice } from 'store/v3/mint/hooks';
import { Button, Flex, HStack, Input, Text } from '@chakra-ui/react';
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
        <Input
          value={localTokenValue}
          id={title}
          size={'sm'}
          onBlur={handleOnBlur}
          disabled={disabled || locked}
          onChange={val => {
            setLocalTokenValue(val.target.value.trim());
            dispatch(updateSelectedPreset({ preset: null }));
          }}
          placeholder="0.00"
        />
      </Flex>
    </div>
  );
}

export default RangeSelectorPart;
