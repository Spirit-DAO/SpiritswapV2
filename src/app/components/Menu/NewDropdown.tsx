import { useMemo } from 'react';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { DotOutlineIcon } from 'app/assets/icons';
import { Props } from './NewDropdown.d';
import { useNavigate } from 'app/hooks/Routing';

const NewDropdown = ({ items, address, migrateItem }: Props) => {
  const navigate = useNavigate();
  const itemMemo = useMemo(() => items, [items]);
  const handleClick = (item, index) => {
    if (migrateItem && item.isV1 && index === 0) {
      return migrateItem();
    }
    return item.onSelect(address, navigate);
  };
  return (
    <Menu direction="ltr">
      <MenuButton
        transition="all 0.3s"
        as={IconButton}
        aria-label="Options"
        icon={<DotOutlineIcon w="20px" h="20px" />}
        bg="none"
        border="none"
        borderRadius="26px"
        height={10}
        marginLeft={1}
        marginTop="9px"
        marginBottom="9px"
        _active={{ bg: 'ciTrans15', borderRadius: '26px' }}
      />
      <MenuList bg="bgInput">
        {itemMemo.map((item, index) => (
          <MenuItem
            color={
              item.value === 'Unstake' || item.value === 'Remove'
                ? 'danger'
                : ''
            }
            key={`${item.type}-${item.id}`}
            onClick={() => handleClick(item, index)}
          >
            {item.value}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default NewDropdown;
