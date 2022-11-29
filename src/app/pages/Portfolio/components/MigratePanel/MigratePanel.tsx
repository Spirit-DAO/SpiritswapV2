import { Props } from './MigratePanel.d';
import { Flex, Button } from '@chakra-ui/react';
import { CircleWarningIcon, TFStart } from 'app/assets/icons';

const MigratePanel = ({ onClick }: Props) => {
  return (
    <Flex
      justifyContent="space-between"
      height="44px"
      alignItems="center"
      backgroundColor="ciTrans15"
      borderRadius="4px"
      p="0 8px"
      mt="4px"
      fontSize="sm"
    >
      <Flex alignItems="center">
        <CircleWarningIcon mr="8px" />
        Migrate your v1 LP tokens
      </Flex>
      <Button onClick={onClick} color="ci" backgroundColor="ciTrans15" h="28px">
        Start migration <TFStart w="20px" ml="4px" />
      </Button>
    </Flex>
  );
};

export default MigratePanel;
