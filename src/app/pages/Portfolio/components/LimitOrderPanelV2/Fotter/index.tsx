import { Box, Button } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LimitFooter = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translationPath = 'portfolio.limitOrderPanel';
  return (
    <Box>
      <Button
        variant="secondary"
        onClick={() =>
          navigate('/swap/FTM/SPIRIT', {
            state: { limitOrderPanel: true } as {
              limitOrderPanel: boolean;
            },
          })
        }
      >
        {t(`${translationPath}.footer.manageOrders`)}
      </Button>
    </Box>
  );
};

export default LimitFooter;
