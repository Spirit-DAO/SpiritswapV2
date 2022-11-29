import { ReactComponent as DeleteIcon } from 'app/assets/images/backspace-delete-button.svg';
import { useCallback, useRef, MouseEvent, FC } from 'react';
import type { Props } from './Input.d';
import { InputWrapper, StyledIconWrapper } from './styles';

const Input: FC<Props> = ({
  iconPrefix,
  iconSuffix,
  disabled = false,
  fullWidth = false,
  onClickIconSuffix,
  className,
  ...inputProps
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDeleteCallback = useCallback(
    (event: MouseEvent) => {
      // clear the input and dispatch a change event
      if (inputRef.current) {
        const inputElement = inputRef.current;

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        )?.set;
        if (!nativeInputValueSetter) return;
        nativeInputValueSetter.call(inputElement, '');

        const inputEvent = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(inputEvent);
      }

      onClickIconSuffix?.(event);
    },
    [onClickIconSuffix],
  );

  const onClickPrefixIcon = useCallback(
    (e: MouseEvent) => {
      inputRef.current?.focus();
      e.preventDefault();
    },
    [inputRef],
  );

  const onFocus = e => {
    const target = e.target.value;
    if (target.trim() === '') onClickIconSuffix?.(e);
  };

  return (
    <InputWrapper
      className={className}
      hasIconPrefix={!!iconPrefix}
      hasIconSuffix={!!iconSuffix}
      disabled={disabled}
    >
      {iconPrefix && (
        <StyledIconWrapper disabled={disabled} onClick={onClickPrefixIcon}>
          {iconPrefix}
        </StyledIconWrapper>
      )}
      <input
        ref={inputRef}
        disabled={disabled}
        onBlur={onFocus}
        {...inputProps}
        autoFocus
      />
      {iconSuffix && (
        <StyledIconWrapper disabled={disabled} onClick={onDeleteCallback}>
          {iconSuffix === 'delete' ? <DeleteIcon /> : iconSuffix}
        </StyledIconWrapper>
      )}
    </InputWrapper>
  );
};

export default Input;
