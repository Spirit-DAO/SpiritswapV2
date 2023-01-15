import { HStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'app/hooks/Routing';
import { SparklesIcon } from 'app/assets/icons';
import { useTranslation } from 'react-i18next';
import { claimSpirit } from 'utils/web3';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { truncateTokenValue } from 'app/utils';
import { useAppSelector } from 'store/hooks';
import { selectSpiritInfo } from 'store/general/selectors';
import useWallets from 'app/hooks/useWallets';
import { INSPIRIT } from 'app/router/routes';

const Footer = ({ userClaimableAmount }) => {
  const { t } = useTranslation();
  const farmsTranslationPath = 'farms.common';
  const { loadingOn, loadingOff, isLoading } = UseIsLoading();
  const { price: spiritPrice } = useAppSelector(selectSpiritInfo);
  const navigate = useNavigate();
  const { addToQueue } = Web3Monitoring();
  const { isLoggedIn } = useWallets();

  const claimRewards = async () => {
    try {
      loadingOn();
      const response = await claimSpirit(
        `${truncateTokenValue(userClaimableAmount, spiritPrice)}`,
      );
      addToQueue(response);
      loadingOff();
    } catch (error) {
      loadingOff();
    }
  };

  return (
    <HStack>
      <Button
        isLoading={isLoading}
        isDisabled={!isLoggedIn || !userClaimableAmount}
        px="spacing03"
        py="6px"
        variant="inverted"
        onClick={claimRewards}
      >
        <SparklesIcon w="20px" h="20px" mr="6px" />
        {t(`${farmsTranslationPath}.claimRewards`)}
      </Button>
      <Button onClick={() => navigate(INSPIRIT.path)} variant="secondary">
        Dashboard
      </Button>
    </HStack>
  );
};

export default Footer;
