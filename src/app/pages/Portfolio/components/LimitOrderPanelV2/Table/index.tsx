import {
  HStack,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Flex,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useMobile from 'utils/isMobile';
import { OpenLimitOrder } from '../LimitOrdersPanelV2.d';

const LimitTable = ({ isLoading, openOrders, searchValue }) => {
  const isMobile = useMobile();
  const [filterOrders, setFilterOrders] =
    useState<OpenLimitOrder[]>(openOrders);
  const TableHeadings = ['Pair', 'Paying', 'Price', 'Receiving'];

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
      if (type === 'Paying') {
        filterOrders.sort((a, b) => {
          const [fValue]: string[] = a.paying ? a.paying.split(' ') : ['0'];
          const [sValue]: string[] = b.paying ? b.paying.split(' ') : ['0'];
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
      if (type === 'Receiving') {
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
  const Cell = ({ autoHeight = true, heading = false, children, ...props }) => (
    <Flex
      alignItems={'center'}
      w={'full'}
      bg={heading ? 'transparent' : 'bgBoxLighter'}
      h={autoHeight ? '2rem' : '2.5rem'}
      p={heading ? '0 0.5rem 0 0' : 'spacing03'}
      borderRadius={'.25rem'}
      minW={heading ? 'max-content' : '150px'}
      {...props}
    >
      {children}
    </Flex>
  );

  const Col = ({ children, ...props }) => (
    <Flex flexDir="column" alignItems="flex-start" {...props} gap="4px">
      {children}
    </Flex>
  );

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
            <Col fontSize="sm" key={`${limitOrder.pair}-${i}`}>
              <Cell autoHeight={false}>
                <Flex flexDir="column">
                  {limitOrder.pair?.map((token, i) => (
                    <Text key={`${token}-${i}`}>{token}</Text>
                  ))}
                </Flex>
              </Cell>
              <Cell>{limitOrder.paying}</Cell>
              <Cell>{limitOrder.price}</Cell>
              <Cell>{limitOrder.receiving}</Cell>
            </Col>
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
              <Tr fontSize="sm" key={`${limitOrder.pair?.[0]}${i}`} h="54px">
                <Td>
                  {limitOrder.pair?.map((token, i) => (
                    <Text key={`${token}-${i}`} flexGrow={1}>
                      {token}
                    </Text>
                  ))}
                </Td>
                <Td>{limitOrder.paying}</Td>
                <Td>{limitOrder.price}</Td>
                <Td>{limitOrder.receiving}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LimitTable;
