import { Box, Button } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'app/hooks/Routing';
import { SWAP } from 'app/router/routes';

const LimitFooter = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translationPath = 'portfolio.limitOrderPanel';
  return (
    <Box>
      <Button
        variant="secondary"
        onClick={() =>
          navigate(`${SWAP.path}/FTM/SPIRIT`, {
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
