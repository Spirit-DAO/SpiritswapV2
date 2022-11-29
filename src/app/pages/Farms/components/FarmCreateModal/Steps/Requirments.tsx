import { HStack, Text, VStack } from '@chakra-ui/react';
import { CheckmarkIcon } from 'app/assets/icons';

interface Requirement {
  id: number;
  text: string;
}

const Requirments = () => {
  const conditions: Requirement[] = [
    {
      id: 1,
      text: 'Exisiting LP pair for tokens',
    },
    {
      id: 2,
      text: `Doesn't have an existing farm for the same LP`,
    },
    {
      id: 3,
      text: 'Need 1% of total inSPIRIT supply to create a farm',
    },
  ];

  const Item = ({ text }: Requirement) => (
    <HStack w="full" justify="flex-start" spacing={'spacing03'}>
      <CheckmarkIcon />
      <Text color="gray">{text}</Text>
    </HStack>
  );
  return (
    <VStack w="full" pt="12px" spacing="spacing02">
      {conditions.map(item => (
        <Item key={item.id} {...item} />
      ))}
    </VStack>
  );
};

export default Requirments;
