import { Select } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledOption = styled.option`
  background: ${({ theme }) => theme.colors.bgBox};
`;

export const FarmsDropdown = ({ farms, value, onChange, ...props }) => {
  const onChangeHandler = (e: { target: { value: string } }) => {
    onChange(e.target.value);
  };

  return (
    <Select
      width="100%"
      onChange={onChangeHandler}
      {...props}
      value={value}
      disabled={!farms || farms.length === 0}
      outline={'none'}
      _focus={{
        boxShadow: 'none',
        borderColor: 'inherit',
      }}
    >
      {(!farms || farms.length === 0) && (
        <StyledOption>Loading...</StyledOption>
      )}

      {farms.map(farm => {
        const { name, fulldata } = farm;
        const [tokenA, tokenB] = name.split(' ');
        return (
          <StyledOption
            key={`${fulldata.farmAddress}-${name}`}
            value={fulldata.farmAddress}
          >
            {`${tokenA} + ${tokenB}`}
          </StyledOption>
        );
      })}
    </Select>
  );
};
