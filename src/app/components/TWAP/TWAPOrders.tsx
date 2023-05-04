import { Orders } from '@orbs-network/twap-ui-spiritswap';
import useWallets from 'app/hooks/useWallets';
import { useTokens } from 'app/hooks/useTokens';
import { getProvider } from 'app/connectors/EthersConnector/login';
import { LimitOrderContainer } from 'app/pages/Swap/components/LimitOrders/styles';
import { getTokenImageUrl } from '../ImageLogo';

function TWAPOrders() {
  const { account } = useWallets();
  const { tokens } = useTokens(undefined, undefined);

  return (
    <LimitOrderContainer>
      <Orders
        dappTokens={tokens || []}
        account={account}
        getProvider={getProvider}
        getTokenImageUrl={getTokenImageUrl}
      />
    </LimitOrderContainer>
  );
}

export default TWAPOrders;
