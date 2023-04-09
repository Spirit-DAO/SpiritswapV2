import { useMemo, useState } from 'react';
import { Box, Stack, useMediaQuery } from '@chakra-ui/react';
import { LimitOrderContainer } from './styles';
import { CardHeader } from 'app/components/CardHeader';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import TableLimitOrders from './components/Table';
import { useTranslation } from 'react-i18next';
import { POSITIONS } from 'constants/icons';
import TabSelect from 'app/components/TabSelect';
import { GetLimitOrders } from 'app/utils';
import { LimitOrderProps } from './LimitOrders.d';
import useWallets from 'app/hooks/useWallets';

const LimitOrders = ({ showChart }: LimitOrderProps) => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const { t } = useTranslation();
  const { isLoggedIn } = useWallets();
  const [limitOrderIndex, setLimitOrderIndex] = useState(0);

  const existingOrders = GetLimitOrders();

  const orders = useMemo(() => existingOrders || [], [existingOrders]);

  const { addToQueue } = Web3Monitoring();

  const translationPath = 'swap.panels.limit';
  const translationPathHelper = 'swap.helperModal';
  const columns = useMemo(
    () => [
      {
        Header: t(`${translationPath}.youSell`, 'You Sell'),
        accessor: 'sell',
      },
      {
        Header: t(`${translationPath}.youBuy`, 'You Buy'),
        accessor: 'buy',
      },
      {
        Header: t(`${translationPath}.priceLabel`, 'Price'),
        accessor: 'price',
      },
      {
        Header: t(`${translationPath}.status`, 'Status'),
        accessor: 'total',
      },
      {
        Header: t(`${translationPath}.action`, 'Action'),
        accessor: 'action',
      },
    ],
    [t],
  );
  return isLoggedIn ? (
    <LimitOrderContainer showChart={showChart}>
      <Stack
        justifyContent="space-between"
        mb="15px"
        direction={isMobile ? 'column' : 'row'}
      >
        <CardHeader
          id={POSITIONS}
          title="Limit Orders"
          helperContent={{
            title: 'Limit Orders',
            text: t(
              `${translationPathHelper}.positionsExplanation`,
              'leveraged positions',
            ),
          }}
        />
        <TabSelect
          index={limitOrderIndex}
          setIndex={setLimitOrderIndex}
          names={['Open', 'Completed', 'Cancelled']}
          w="fit-content"
        />
      </Stack>
      <Box maxH="308px" overflowY="scroll">
        <TableLimitOrders
          orders={orders}
          columns={columns}
          limitOrderIndex={limitOrderIndex}
          variantTable={isMobile ? 'mobile' : 'default'}
          monitor={addToQueue}
        />
      </Box>
    </LimitOrderContainer>
  ) : null;
};
export default LimitOrders;
