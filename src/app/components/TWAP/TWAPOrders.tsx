import { Orders } from '@orbs-network/twap-ui-spiritswap';
import useWallets from 'app/hooks/useWallets';
import { useTokens } from 'app/hooks/useTokens';
import { LimitOrderContainer } from 'app/pages/Swap/components/LimitOrders/styles';
import { getTokenImageUrl } from '../ImageLogo';

function TWAPOrders({ showChart }: { showChart: boolean }) {
  const { account } = useWallets();
  const { tokens } = useTokens(undefined, undefined);

  return (
    <LimitOrderContainer showChart={showChart} isTWAP>
      <Orders
        dappTokens={tokens || []}
        account={account}
        getProvider={() => window.ethereum}
        getTokenImageUrl={getTokenImageUrl}
      />
    </LimitOrderContainer>
  );
}

export default TWAPOrders;
