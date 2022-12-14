import { ModalToken } from 'app/components/ModalToken';
import { getProvider } from 'app/connectors/EthersConnector/login';
import { useTokens } from 'app/hooks/useTokens';
import useWallets from 'app/hooks/useWallets';
import { TWAP } from '@orbs-network/twap-ui-spiritswap';
import { useDisclosure } from '@chakra-ui/react';
import { ConnectWallet } from 'app/components/ConnectWallet';
import { useParams } from 'react-router-dom';
import { Token } from 'app/interfaces/General';
import { SwapProps } from 'app/pages/Swap/Swap.d';

const getTokenImage = (token: any) => {
  if (token.symbol) return `/images/tokens/${token.symbol.toUpperCase()}.png`;
  return token?.logoUrl;
};

interface TWAPPanelProps {
  gasPrice: string;
  panelProps: SwapProps;
}

function TWAPPanel({ gasPrice, panelProps }: TWAPPanelProps) {
  const { handleChangeToken } = panelProps;
  const { account } = useWallets();
  const { tokens } = useTokens(undefined, undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token1, token2 } = useParams();

  return (
    <>
      <TWAP
        connect={onOpen}
        TokenSelectModal={ModalToken}
        dappTokens={tokens}
        account={account}
        getProvider={getProvider}
        getTokenImage={getTokenImage}
        onSrcTokenSelected={(token: Token) =>
          handleChangeToken(token, () => {}, 0)
        }
        onDstTokenSelected={(token: Token) =>
          handleChangeToken(token, () => {}, 1)
        }
        priorityFeePerGas={gasPrice}
        maxFeePerGas={gasPrice}
        srcToken={token1}
        dstToken={token2}
      />
      <ConnectWallet isOpen={isOpen} dismiss={onClose} />
    </>
  );
}

export default TWAPPanel;
