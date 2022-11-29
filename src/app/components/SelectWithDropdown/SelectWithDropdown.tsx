import { FC, useState, useCallback, useEffect } from 'react';
import { Icon } from '../Icon';
import { Props } from './SelectWithDropdown.d';
import { ReactComponent as CaretDown } from 'app/assets/images/caret-down.svg';
import { StyledWrapper, StyledLabel, StyledDropdown } from './styles';

const SelectWithDropdown: FC<Props> = ({
  items,
  selectedId,
  icon,
  onSelect,
  label,
  ...props
}: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [outsideClicked, setOutsideClicked] = useState(false);
  const selectedItem = items.find(item => item.id === selectedId);

  const onHideDropdownCallback = useCallback(() => {
    setShowDropdown(false);
    setOutsideClicked(true);
  }, [setShowDropdown]);

  useEffect(() => {
    outsideClicked &&
      setTimeout(() => {
        setOutsideClicked(false);
      }, 200);
  }, [outsideClicked]);

  const getLabel = () =>
    label ? `${label}: ${selectedItem?.value}` : `${selectedItem?.value}`;

  return (
    <StyledWrapper
      data-testid="icon-wrapper"
      onClick={() => {
        !outsideClicked && setShowDropdown(!showDropdown);
      }}
      {...props}
    >
      {icon && <Icon size="20px" icon={icon} />}
      <StyledLabel>{getLabel()}</StyledLabel>
      <Icon size="20px" icon={<CaretDown />} />
      {showDropdown && (
        <StyledDropdown
          data-testid="items-wrapper"
          id="items-wrapper"
          items={items}
          selectedId={selectedId}
          onClickOutside={onHideDropdownCallback}
          onSelect={id => onSelect(id)}
        />
      )}
    </StyledWrapper>
  );
};

export default SelectWithDropdown;
