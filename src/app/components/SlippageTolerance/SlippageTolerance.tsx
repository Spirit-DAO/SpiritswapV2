import React, { FC, ChangeEvent } from 'react';
import { Props } from './SlippageTolerance.d';
import { StyledSelect, StyledInput } from './styles';

const SlippageTolerance: FC<Props> = ({
  labels,
  onChange,
  customPlaceholder = 'Custom',
  customValue = '',
  ...props
}: Props) => {
  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.({
      index: labels.length,
      value: event.target.value,
      custom: true,
    });
  };
  const inputClickHandler = (): void => {
    onChange?.({ index: labels.length, value: customValue, custom: true });
  };

  const onChangeSelect = ({ index, value }) =>
    onChange?.({ index, value, custom: false });

  return (
    <StyledSelect labels={labels} onChange={onChangeSelect} {...props}>
      <StyledInput
        data-testid="slippage-tolerance-custom"
        placeholder={customPlaceholder}
        value={customValue}
        onChange={inputChangeHandler}
        onClick={inputClickHandler}
      />
    </StyledSelect>
  );
};

export default SlippageTolerance;
