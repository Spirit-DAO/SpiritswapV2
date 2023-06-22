import { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Button,
  IconButton,
  HStack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { CHAIN_ID } from 'constants/index';
import { NETWORK } from 'constants/networks';
import { Props } from './Table.d';
import { ArrowDownIcon } from 'app/assets/icons';
import { cancelLimitOrder } from 'utils/swap/gelato';
import { GelattoLimitOrder } from 'utils/swap/types';
import ImageLogo from 'app/components/ImageLogo';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { getRoundedSFs } from 'app/utils';
import { formatUnits } from 'ethers/lib/utils';
import { resolveRoutePath } from 'app/router/routes';

const explorerLink = NETWORK[CHAIN_ID].blockExp[0];

const TableLimitOrders = ({
  orders,
  columns,
  variantTable,
  limitOrderIndex,
  monitor,
}: Props) => {
  const { addToQueue } = Web3Monitoring();

  const onCancel = async order => {
    const response = await cancelLimitOrder(order);

    addToQueue(response);
  };

  const data = useMemo(() => {
    const openButtons = (txhash: string) => (
      <IconButton
        variant="secondary"
        aria-label="arrow"
        fontSize="12px"
        icon={
          <ArrowDownIcon color="white" transform="rotate(230deg)" w="20px" />
        }
        onClick={() => window.open(`${explorerLink}tx/${txhash}`, '_blank')}
      />
    );

    const closedButtons = (order: GelattoLimitOrder) => (
      <Button variant="secondary" onClick={() => onCancel(order)}>
        <Text ml="3px">Cancel</Text>
      </Button>
    );

    const actions = (order: GelattoLimitOrder, txhash: string) => {
      return limitOrderIndex === 0 ? (
        <HStack>
          {openButtons(txhash)}
          {closedButtons(order)}
        </HStack>
      ) : (
        <Button
          variant="secondary"
          onClick={() => window.open(`${explorerLink}tx/${txhash}`, '_blank')}
        >
          <ArrowDownIcon color="white" transform="rotate(230deg)" w="20px" />
          <Text ml="3px">FTM Scan</Text>
        </Button>
      );
    };
    const formattedLimitOrders = orders?.map(order => {
      const {
        createdAt,
        inputTokenData,
        outputTokenData,
        inputAmount,
        bought,
        adjustedMinReturn,
        status,
        executedTxHash,
        cancelledTxHash,
        createdTxHash,
      } = order;
      const inputDecimals = inputTokenData ? inputTokenData.decimals : 18;
      const outputDecimals = outputTokenData ? outputTokenData.decimals : 18;

      const payingAmount = parseFloat(
        formatUnits(inputAmount || '0', inputDecimals),
      );
      const receivingAmount = parseFloat(
        formatUnits(bought || adjustedMinReturn || '0', outputDecimals),
      );
      const price = payingAmount / receivingAmount;
      const inputSymbol = inputTokenData ? inputTokenData.symbol : 'Unknown';
      const outputSymbol = outputTokenData ? outputTokenData.symbol : 'Unknown';
      const txhash = executedTxHash || cancelledTxHash || createdTxHash;

      return {
        tokens: outputSymbol,
        createdAt,
        created: new Date(parseInt(createdAt) * 1000).toLocaleDateString(),
        input: `${getRoundedSFs(`${payingAmount}`)} ${inputSymbol}`,
        price: `${getRoundedSFs(`${price}`)} ${outputSymbol}`,
        total: `${getRoundedSFs(`${receivingAmount}`)} ${outputSymbol}`,
        txhash,
        status,
        actions: actions(order, txhash),
      };
    });

    // Here we filter based on the limitOrderIndex
    const statusMapping = {
      open: 0,
      executed: 1,
      cancelled: 2,
    };

    return formattedLimitOrders?.filter(
      order => limitOrderIndex === statusMapping[order.status],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitOrderIndex, orders, monitor]);

  const statusMap = {
    0: 'open',
    1: 'closed',
    2: 'cancelled',
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: data || [],
        disableSortRemove: true,
        defaultCanSort: true,
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
  return data?.length > 0 ? (
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
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell, i) => (
                <Td
                  fontSize="sm"
                  w="100px"
                  textAlign="start"
                  alignItems="center"
                  height={isMobile ? '55px' : '75px'}
                  opacity="0.8"
                  {...cell.getCellProps()}
                >
                  {i === 0 ? (
                    <ImageLogo
                      margin="0 8px 0 0"
                      symbol={row.original.tokens}
                      src={resolveRoutePath(
                        `images/tokens/${row.original.tokens}.png`,
                      )}
                      size="32px"
                      cw="32px"
                      display="inline-flex"
                      va="bottom"
                      m={'0 10px 0 0'}
                    />
                  ) : (
                    ''
                  )}
                  <Text display={'inline-flex'} verticalAlign={'super'}>
                    {cell.render('Cell')}
                  </Text>
                </Td>
              ))}
            </Tr>
          );
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
