import {
  useCallback,
  FC,
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
} from 'react';
import type { Props } from './NumberInput.d';
import { Input } from '../Input';
import { formatNumber } from 'app/utils';

const NumberInput: FC<Props> = ({
  value,
  onChange,
  defaultValue = 0,
  ...inputProps
}) => {
  const [invalidationTime, setInvalidationTime] = useState(
    new Date().getTime(),
  );
  const [internalValue, setInternalValue] = useState<number>(
    value !== undefined ? value : defaultValue,
  );
  const [isTypingDecimal, setTypingDecimal] = useState<boolean>(false);

  useEffect(() => {
    if (value === undefined && defaultValue !== undefined) {
      setInternalValue(defaultValue);
    } else if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value, defaultValue, invalidationTime]);

  const formattedNumber = useMemo(
    () =>
      `${formatNumber({ value: internalValue })}${isTypingDecimal ? '.' : ''}`,
    [internalValue, isTypingDecimal],
  );

  const onChangeInternal = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const domValue = e.target.value;
      const plainNumber = domValue.replaceAll(/,/g, '');
      const parsedNumber = parseFloat(plainNumber);
      if (isNaN(parsedNumber)) {
        setInternalValue(defaultValue);
        onChange?.(defaultValue, e);
      } else {
        setInternalValue(parsedNumber);
        onChange?.(parsedNumber, e);
        setTypingDecimal(domValue.endsWith('.'));
      }
      setInvalidationTime(new Date().getTime());
    },
    [defaultValue, onChange],
  );

  return (
    <Input
      value={formattedNumber}
      onChange={onChangeInternal}
      {...inputProps}
    />
  );
};

export default NumberInput;
