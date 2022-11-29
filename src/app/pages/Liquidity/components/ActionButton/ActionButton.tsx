import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Props {
  isDisabled?: boolean;
  isLoggedIn: boolean;
  loading: boolean;
  handleOnClick: () => void;
  message?: string;
}

const ActionButton = ({
  isDisabled = false,
  isLoggedIn,
  loading,
  handleOnClick,
  message,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'liquidity.common';
  const getLabel = () => {
    if (message) return message;

    return !isLoggedIn
      ? t(`${translationPath}.connectWallet`)
      : t(`${translationPath}.addLiquidity`);
  };
  return (
    <Button
      disabled={isDisabled}
      onClick={handleOnClick}
      isLoading={loading}
      loadingText="Loading"
      mt="14px"
      w="full"
      p="8px"
      h={10}
      fontSize="lg"
      fontWeight="500"
    >
      {getLabel()}
    </Button>
  );
};

export default ActionButton;
