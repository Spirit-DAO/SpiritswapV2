import { Flex } from '@chakra-ui/react';
import { CheckmarkIcon } from 'app/assets/icons';
import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Requirement {
  id: number;
  text: string;
}

const Item = ({ id, text }: Requirement) => (
  <Flex py={'spacing01'} key={id} gap={'spacing03'}>
    <CheckmarkIcon />
    <Text color={'gray'}>{text}</Text>
  </Flex>
);

export const Requirements = () => {
  const translationRoot = `farms.ecosystem.requirements`;
  const { t } = useTranslation();

  const conditions: Requirement[] = [
    {
      id: 1,
      text: t(`${translationRoot}.liquidity`),
    },
    {
      id: 2,
      text: t(`${translationRoot}.emissionToken`),
    },
    {
      id: 3,
      text: t(`${translationRoot}.farmFee`),
    },
  ];

  return (
    <Flex direction="column">
      {conditions.map(item => (
        <Item key={item.id} {...item} />
      ))}
    </Flex>
  );
};
