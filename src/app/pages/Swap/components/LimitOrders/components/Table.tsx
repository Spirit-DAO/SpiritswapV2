import { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy } from 'react-table';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { Props } from './Table.d';
import { algebraLimitOrderManagerContract } from 'utils/web3';
import LimitOrderRow from './LimitOrderRow';

const TableLimitOrders = ({
  orders,
  columns,
  variantTable,
  limitOrderIndex,
  monitor,
}: Props) => {
  const [formattedOrders, setFormattedOrders] = useState<any[]>();

  useEffect(() => {
    if (!orders) return;

    async function fetchAmounts(id, ...rest) {
      const limitOrderManagerContract =
        await algebraLimitOrderManagerContract();

      const decrease = limitOrderManagerContract.interface.encodeFunctionData(
        'decreaseLimitOrder',
        [id, 0],
      );
      const limitPosition =
        limitOrderManagerContract.interface.encodeFunctionData(
          'limitPositions',
          [id],
        );

      const calls = await limitOrderManagerContract?.callStatic.multicall([
        decrease,
        limitPosition,
      ]);

      const amounts = limitOrderManagerContract.interface.decodeFunctionResult(
        'decreaseLimitOrder',
        calls[0],
      );
      const position = limitOrderManagerContract.interface.decodeFunctionResult(
        'limitPositions',
        calls[1],
      );

      if (!amounts || !position) return;

      const {
        liquidity: amount,
        depositedToken,
        depositedAmount,
        tokensOwed0,
        tokensOwed1,
      } = position.limitPosition;

      const isClosed = !+amount && !+tokensOwed0 && !+tokensOwed1;
      const isCompleted = !Boolean(+amount);

      const completedPercent = String(
        100 - (+amount * 100) / depositedAmount,
      ).slice(0, 4);

      const status = isClosed
        ? 'cancelled'
        : isCompleted
        ? 'completed'
        : 'open';

      return {
        ...rest[0],
        id,
        status,
        isCompleted,
        isClosed,
        amount,
        depositedToken,
        tokensOwed0,
        tokensOwed1,
        completedPercent,
      };
    }

    const ordersState = orders.map(({ tokenId, ...rest }: any) =>
      fetchAmounts(tokenId, rest),
    );

    Promise.all(ordersState).then(orders => setFormattedOrders(orders));
  }, [orders]);

  const data = useMemo(() => {
    // Here we filter based on the limitOrderIndex
    const statusMapping = {
      open: 0,
      completed: 1,
      cancelled: 2,
    };

    return formattedOrders?.filter(
      order => limitOrderIndex === statusMapping[order.status],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitOrderIndex, orders, monitor]);

  const statusMap = {
    0: 'open',
    1: 'completed',
    2: 'cancelled',
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: data || [],
        disableSortRemove: true,
        defaultCanSort: true,
        autoResetHiddenColumns: false,
        autoResetSortBy: false,
        initialState: {
          sortBy: [
            {
              id: 'createdAt',
              desc: true,
            },
          ],
        },
      },
      useSortBy,
    );

  const [isMobile] = useMediaQuery('(max-width: 640px)');
  return data?.length ? (
    <Table variant={variantTable} {...getTableProps()} w="100%">
      <Thead>
        {headerGroups.map(headerGroup => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              return column.Header === 'Actions' ? (
                <Th isNumeric={column.isNumeric}>{column.render('Header')}</Th>
              ) : (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  isNumeric={column.isNumeric}
                  marginBottom={isMobile && '3px'}
                >
                  {column.render('Header')}
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return <LimitOrderRow row={row} />;
        })}
      </Tbody>
    </Table>
  ) : (
    <Text
      color="gray"
      fontSize="sm"
      textAlign="center"
      marginInline="auto"
      mt="spacing05"
      mb="spacing05"
    >
      You currently don't have {statusMap[limitOrderIndex]} limit orders
    </Text>
  );
};
export default TableLimitOrders;
