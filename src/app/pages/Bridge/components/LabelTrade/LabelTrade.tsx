import { Flex, Text } from '@chakra-ui/react';
import { Props } from './LabelTrade.d';

const LabelTrade = ({ label, network, color }: Props) => {
  return (
    <Flex justify="space-between" pt="5px" w="full">
      <Text fontSize="sm" color={color ?? '-moz-initial'}>
        {label}
      </Text>
      <Text
        fontSize="sm"
        color={color ?? '-moz-initial'}
      >{`${network} Wallet`}</Text>
    </Flex>
  );
};

export default LabelTrade;
