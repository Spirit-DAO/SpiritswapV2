import { FC, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { useTranslation } from 'react-i18next';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Text,
  Button,
} from '@chakra-ui/react';

import ImageLogo from 'app/components/ImageLogo';
import { Props } from './Table.d';
const TablePositions: FC<Props> = ({
  columns,
  variantTable,
  isMobile,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'apeMode.common';
  const data = useMemo(
    () => [
      {
        token: 'WFTM',
        symbol: 'WFTM',
        size: '9,850.34',
        value: '$23,448.42',
        price: '$1.505',
        APY: '0.25%',
      },
      {
        token: 'SPIRIT',
        symbol: 'SPIRIT',
        size: '2,000.00',
        value: '$323.59',
        price: '$0.45',
        APY: '0.14%',
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: data || [] }, useSortBy);
  return (
    <Table variant={variantTable} {...getTableProps()}>
      <Thead>
        {headerGroups.map(headerGroup => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render('Header')}
              </Th>
            ))}
            <Th>{t(`${translationPath}.actionLabel`, 'Action')}</Th>
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <Td
                  alignItems="center"
                  textAlign="start"
                  {...cell.getCellProps()}
                  isNumeric={cell.column.isNumeric}
                >
                  {cell.column.Header === 'Token' && (
                    <ImageLogo
                      symbol={cell.row.original.symbol}
                      type="tokens"
                      size="32px"
                    />
                  )}
                  {cell.render('Cell')}
                  {cell.column.Label === 'price' && (
                    <Text color="grayDarker" fontSize="xs">
                      Leverage: 1.50x
                    </Text>
                  )}
                </Td>
              ))}
              <Td padding="0" textAlign="center">
                <Button
                  w={isMobile ? '184px' : 'auto'}
                  gap="5px"
                  bg="grayBorderBox"
                  border="transparent"
                  textAlign="center"
                  fontWeight="bold"
                >
                  Close
                  {isMobile && ' position'}
                </Button>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
export default TablePositions;
