import { FC, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Props } from './TradingApe.d';
import { Token } from 'app/interfaces/General';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';

const Trading: FC<Props> = ({ ...props }) => {
  const [inputValue, setinputValue] = useState('0');
  const onInputChange = ({ value }: { value: string }) => setinputValue(value);

  const defaultToken1: Token = {
    name: 'FTM',
    symbol: 'FTM',
    address: '',
    chainId: 137,
    decimals: 6,
  };
  const [inputToken, setInputToken] = useState<Token>(defaultToken1);
  const handleSelectInput = (item: Token, onClose: () => void) => {
    setInputToken(item);
    onClose();
  };
  return (
    <Box w="full">
      <NewTokenAmountPanel
        onSelect={handleSelectInput}
        inputValue={inputValue}
        onChange={onInputChange}
        showPercentage
        context="token"
        token={inputToken}
        inputWidth="170px"
        showTokenSelection
      />
    </Box>
  );
};

export default Trading;
