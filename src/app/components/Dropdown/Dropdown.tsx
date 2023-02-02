import { useOnClickOutside } from 'app/hooks/useOnClickOutSide';
import React, { FC } from 'react';
import { Props } from './Dropdown.d';
import { Wrapper, Button } from './styles';
import ImageLogo from '../ImageLogo';
import { useNavigate } from 'app/hooks/Routing';

const Dropdown: FC<Props> = ({
  items,
  selectedId,
  unselectableId,
  tokenAddress,
  onClickOutside,
  onSelect,
  swapNetworks,
  ...props
}: Props) => {
  const ref = useOnClickOutside<HTMLInputElement>(onClickOutside);
  const navigate = useNavigate();

  return (
    <Wrapper ref={ref} {...props}>
      {items.map((item, index) => (
        <Button
          key={`dropdown-${index}`}
          data-testid={`dropdown-${index}`}
          isSelected={item.id === selectedId}
          onClick={() => {
            if (item?.onSelect) {
              item.onSelect(tokenAddress, navigate);
            } else {
              swapNetworks && unselectableId === item.id && swapNetworks();
              unselectableId !== item.id && onSelect?.(item.id);
            }
            onClickOutside();
          }}
        >
          {item.type !== 'option' && (
            <ImageLogo
              symbol={item.value}
              type={item.type}
              size={item.type === 'languages' ? '20px' : '25px'}
            />
          )}
          {item.value}
        </Button>
      ))}
    </Wrapper>
  );
};

export default Dropdown;
