import {
  HStack,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Flex,
} from '@chakra-ui/react';
import { Fragment, useEffect, useState } from 'react';
import useMobile from 'utils/isMobile';
import { OpenLimitOrder } from '../LimitOrdersPanelV2.d';
import LimitOrderRow from './LimitOrderRow';
import Col from './Col';
import Cell from './Cell';

const LimitTable = ({ isLoading, openOrders, searchValue }) => {
  const isMobile = useMobile();
  const [filterOrders, setFilterOrders] =
    useState<OpenLimitOrder[]>(openOrders);
  const TableHeadings = ['Pair', 'You sell', 'Price', 'You buy'];

  const getSorted = (type: string) => {
    try {
      if (type === 'Pair') {
        filterOrders.sort((a, b) => {
          const fToken = a.pair?.[0] ? a.pair?.[0] : 'FTM';
          const sToken = b.pair?.[0] ? b.pair?.[0] : 'FTM';

          if (fToken < sToken) {
            return -1;
          }
          if (fToken > sToken) {
            return 1;
          }
          return 0;
        });
      }
      if (type === 'You sell') {
        filterOrders.sort((a, b) => {
          const [fValue]: string[] = a.amount ? a.amount : ['0'];
          const [sValue]: string[] = b.amount ? b.amount : ['0'];
          return Number(fValue) - Number(sValue);
        });
      }
      if (type === 'Price') {
        filterOrders.sort((a, b) => {
          const [fValue]: string[] = a.price ? a.price.split(' ') : ['0'];
          const [sValue]: string[] = b.price ? b.price.split(' ') : ['0'];
          return Number(fValue) - Number(sValue);
        });
      }
      if (type === 'You buy') {
        filterOrders.sort((a, b) => {
          const [fValue]: string[] = a.receiving
            ? a.receiving.split(' ')
            : ['0'];
          const [sValue]: string[] = b.receiving
            ? b.receiving.split(' ')
            : ['0'];
          return Number(fValue) - Number(sValue);
        });
      }
    } catch (error) {
      throw '';
    }
  };

  useEffect(() => {
    const newOrders = openOrders.filter(
      limitOrder =>
        limitOrder.pair &&
        (limitOrder.pair[0].toLowerCase().includes(searchValue.toLowerCase()) ||
          limitOrder.pair[1].toLowerCase().includes(searchValue.toLowerCase())),
    );
    setFilterOrders(newOrders);
  }, [searchValue]);

  if (isLoading) {
    return (
      <Skeleton
        startColor="grayBorderBox"
        endColor="bgBoxLighter"
        w="full"
        h="214px"
        mb="spacing05"
      />
    );
  }

  if (isMobile)
    return (
      <Flex position="relative">
        <Col>
          {TableHeadings.map((heading, i) =>
            i === 0 ? (
              <Cell
                heading
                fontSize="xs"
                fontWeight="medium"
                key={`${heading}-${i}`}
                autoHeight={false}
              >
                {heading}
              </Cell>
            ) : (
              <Cell
                heading
                fontSize="xs"
                fontWeight="medium"
                key={`${heading}-${i}`}
              >
                {heading}
              </Cell>
            ),
          )}
        </Col>
        <Flex
          gap="spacing03"
          position="relative"
          overflowX="auto"
          overflowY="hidden"
          w="360px"
        >
          {filterOrders.map((limitOrder, i) => (
            <Fragment key={`${limitOrder.pair}-${i}`}>
              <LimitOrderRow limitOrder={limitOrder} isMobile={true} />
            </Fragment>
          ))}
        </Flex>
      </Flex>
    );

  return (
    <>
      <HStack w="full" justify="flex-start">
        <Text
          color="gray"
          fontSize="sm"
        >{`${filterOrders.length} open orders`}</Text>
      </HStack>

      <TableContainer overflowY="scroll" maxH="300px" w="full">
        <Table variant="default" w="full">
          <Thead>
            <Tr>
              {TableHeadings.map((heading, i) => (
                <Th
                  onClick={() => getSorted(heading)}
                  fontSize="sm"
                  cursor="pointer"
                  _hover={{ opacity: 0.4 }}
                  key={`${heading}-${i}`}
                >
                  {heading}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {filterOrders.map((limitOrder, i) => (
              <Fragment key={`${limitOrder.pair?.[0]}${i}`}>
                <LimitOrderRow limitOrder={limitOrder} isMobile={false} />
              </Fragment>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LimitTable;
