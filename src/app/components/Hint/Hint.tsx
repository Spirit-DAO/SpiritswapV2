import { Box, Text, HStack } from '@chakra-ui/react';
import { WarningIcon, CircleWarningIcon } from '../../assets/icons';
import { HintProps } from './Hint.d';

const Hint = ({ message, type }: HintProps) => {
  const getStyles = () => {
    switch (type) {
      case 'WARNING':
        return {
          bg: 'pendingBg',
          color: 'warning',
        };
      case 'ALERT':
        return {
          bg: 'errorBg',
          color: 'error',
        };
      case 'INFO':
        return {
          bg: 'successBg',
          color: 'ci',
        };
    }
  };

  const styles = getStyles();
  return (
    <Box p="spacing03" borderRadius="4px" bg={styles.bg} color={styles.color}>
      <HStack spacing="10px">
        {type === 'INFO' ? (
          <CircleWarningIcon color={styles.color} />
        ) : (
          <WarningIcon color={styles.color} />
        )}
        <Text fontSize="sm">{message}</Text>
      </HStack>
    </Box>
  );
};

export default Hint;
