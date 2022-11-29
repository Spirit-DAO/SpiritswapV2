import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotLimitOrders = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translationPath = 'portfolio.limitOrderPanel';
  return (
    <Flex>
      <Box textAlign="center" marginInline="auto" mt="spacing05">
        <Text fontSize="sm" color="gray" mb="spacing03">
          {t(`${translationPath}.NoOpenLimitOrderText`)}
        </Text>
        <Button
          variant="primary"
          onClick={() =>
            navigate('/swap/FTM/SPIRIT', {
              state: { limitOrderPanel: true } as {
                limitOrderPanel: boolean;
              },
            })
          }
        >
          Create limit order
        </Button>
      </Box>
    </Flex>
  );
};

export default NotLimitOrders;
