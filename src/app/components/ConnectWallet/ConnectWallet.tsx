import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from './ConnectWallet.d';
import useMobile from 'utils/isMobile';

import {
  StyledHeader,
  StyledLink,
  StyledButton,
  StyledModalCloseButton,
  StyledText,
} from './styles';

import {
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Icon,
  Image,
} from '@chakra-ui/react';

import { ReactComponent as QuestionIcon } from 'app/assets/images/question-3-circle.svg';
import { ReactComponent as WalletInput } from 'app/assets/images/wallet-input.svg';

import Metamask from 'app/assets/wallets/metamask.png';
import WalletConnect from 'app/assets/wallets/wallet-connect.png';
import { onClickUrl } from 'app/utils/redirectTab';
import useLogin from 'app/connectors/EthersConnector/login';
import { ConnectorNames, SPIRIT_DOCS_URL } from 'constants/index';
import { useDispatch } from 'react-redux';
import { setShowPortfolio } from 'store/user';

const wallets = [
  { name: 'MetaMask', image: Metamask },
  { name: 'WalletConnect', image: WalletConnect },
];

const ConnectWallet = ({ isOpen, dismiss }: Props) => {
  const { t } = useTranslation();
  const title = 'common.connectWalletModal.title';
  const footer = 'common.connectWalletModal.footer';
  const { handleLogin } = useLogin();
  const dispatch = useDispatch();
  const isMobile = useMobile();

  const Login = (connector: ConnectorNames) => {
    handleLogin(connector);
    dispatch(setShowPortfolio(true));
    dismiss();
  };

  const renderHeader = (): ReactNode => {
    return (
      <Flex>
        <Flex
          bgColor="ciTrans15"
          borderRadius="10px"
          width="36px"
          height="36px"
        >
          <Icon as={WalletInput} h="8" w="8" alignSelf="center" margin="auto" />
        </Flex>
        <StyledHeader>{t(title)}</StyledHeader>
        <StyledModalCloseButton _focus={{ border: 'none' }} />
      </Flex>
    );
  };

  const renderWalletsList = (): ReactNode => {
    return (
      <Flex direction="column">
        {wallets.map(wallet => (
          <StyledButton
            key={wallet.name}
            onClick={() => Login(ConnectorNames[wallet.name])}
          >
            <Flex>
              <Image src={wallet.image} height="40px" />
              <StyledText>{wallet.name}</StyledText>
            </Flex>
          </StyledButton>
        ))}
      </Flex>
    );
  };

  const renderFooter = (): ReactNode => {
    return (
      <StyledButton>
        <StyledLink
          onClick={onClickUrl(`${SPIRIT_DOCS_URL}/howto/connect-metamask`)}
        >
          <Flex>
            <Text color="ci">{t(footer)}</Text>
            <Icon
              as={QuestionIcon}
              w="5"
              h="5"
              color="grayDarker"
              sx={{ marginLeft: '6px' }}
            />
          </Flex>
        </StyledLink>
      </StyledButton>
    );
  };

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={dismiss}
      isCentered={isMobile}
      size={isMobile ? 'xs' : 'lg'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{renderHeader()}</ModalHeader>
        <ModalBody>
          {renderWalletsList()}
          {renderFooter()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConnectWallet;
