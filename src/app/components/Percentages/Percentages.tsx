import { mathBalance } from 'app/utils';
import { FC } from 'react';
import { Props } from './Percentages.d';
import { HStack } from '@chakra-ui/react';
import { Button } from './styles';

const Percentages: FC<Props> = ({
  onChange,
  symbol,
  balance,
  decimals,
}: Props) => {
  const buttonValues = ['25%', '50%', '75%', 'Max'];
  let newValue: string;

  const handleChange = (value: string) => {
    switch (value) {
      case '25%':
        newValue =
          parseFloat(balance) > 0
            ? mathBalance(balance, '0.25', decimals)
            : '0';
        onChange && onChange({ tokenSymbol: symbol, value: newValue });

        break;
      case '50%':
        newValue =
          parseFloat(balance) > 0
            ? mathBalance(balance, '0.50', decimals)
            : '0';
        onChange && onChange({ tokenSymbol: symbol, value: newValue });

        break;
      case '75%':
        newValue =
          parseFloat(balance) > 0
            ? mathBalance(balance, '0.75', decimals)
            : '0';
        onChange && onChange({ tokenSymbol: symbol, value: newValue });

        break;
      case 'Max':
        onChange &&
          onChange({
            tokenSymbol: symbol,
            value: mathBalance(balance, '1', decimals),
          });

        break;
    }
  };

  return (
    <HStack w="full" spacing="spacing02" mt="spacing03">
      {buttonValues.map(value => (
        <Button key={value} onClick={() => handleChange(value)}>
          {value}
        </Button>
      ))}
    </HStack>
  );
};
export default Percentages;
