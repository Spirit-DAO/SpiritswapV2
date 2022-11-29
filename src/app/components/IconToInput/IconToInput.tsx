import { useState, useEffect, useCallback } from 'react';
import { ReactComponent as CloseIcon } from 'app/assets/images/times.svg';
import { ReactComponent as SearchIcon } from 'app/assets/images/search-loupe.svg';
import Input from '../Input/Input';
import IconButton from '../IconButton/IconButton';
import type { Props } from './IconToInput.d';
import { StyledWrapper } from './styles';

const IconToInput = ({
  icon = <SearchIcon />,
  disabled = false,
  iconPos,
  open = false,
  className,
  ...props
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(open);

  const onIconClick = useCallback(() => {
    if (!isOpen && !disabled) {
      setIsOpen(true);
    }
    // TODO Implmement React.forwardRef() in Input
    // inputRef.current?.focus(), 0);
  }, [isOpen, disabled]);

  const onCloseButtonClick = useCallback(() => {
    if (!disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <StyledWrapper
      className={className}
      iconPos={iconPos}
      open={isOpen}
      disabled={disabled}
    >
      {!isOpen ? (
        <IconButton
          flat={true}
          icon={icon}
          onClick={onIconClick}
          variant={'secondary'}
          size={'big'}
        />
      ) : (
        <Input
          disabled={disabled}
          iconPrefix={icon}
          iconSuffix={<CloseIcon />}
          onClickIconSuffix={onCloseButtonClick}
          {...props}
        />
      )}
    </StyledWrapper>
  );
};

export default IconToInput;
