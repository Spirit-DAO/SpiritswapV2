import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ChangeEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledPanel, StyledIconToInput } from './style';
import { CardHeader } from 'app/components/CardHeader';
import { ArrowDiagonalIcon } from 'app/assets/icons';
import { LIQUIDITY } from 'constants/icons';
import useMobile from 'utils/isMobile';
import { openInNewTab } from 'app/utils/redirectTab';
import ImageLogo from 'app/components/ImageLogo';
import { LendAndBorrowItem, ActionType } from './LendAndBorrowPanel.d';
import { useAppSelector } from 'store/hooks';
import { selectLendAndBorrowData } from 'store/user/selectors';

const LendAndBorrowPanel = () => {
  const OLA_FINANCE_URL = 'https://app.ola.finance/spiritswap/markets';
  const translationPath = 'portfolio.lendAndBorrowPanel';
  const { t } = useTranslation();
  const isMobile = useMobile();
  const { suppliedTokens, borrowedTokens } = useAppSelector(
    selectLendAndBorrowData,
  );

  const MIN_POSITION_AMOUNT_USD = 0.01;
  const noLendAndBorrowData = !borrowedTokens.length && !suppliedTokens.length;

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    //TODO: implement common search for both supplied and borrowed tokens
    // const query = e.target.value;
  };

  const apyLabelColor = (ID: ActionType) => {
    if (ID === ActionType.Supplied) {
      return 'ci';
    }

    return 'dangerBorder';
  };

  const renderPanelHeader = () => {
    return (
      <Flex alignItems="center">
        <CardHeader
          id={LIQUIDITY}
          title={t(`${translationPath}.header.title`)}
          helperContent={{
            title: t(`${translationPath}.helper.title`),
            text: [t(`${translationPath}.helper.text`)],
            showDocs: true,
          }}
        />
        {!noLendAndBorrowData && <StyledIconToInput onChange={onSearch} />}
      </Flex>
    );
  };

  const renderPanelFooter = () => {
    return (
      <Box>
        <Button
          variant="secondary"
          onClick={() => openInNewTab(OLA_FINANCE_URL)}
        >
          <Flex alignItems="center">
            <Text>{t(`${translationPath}.footer.manage`)}</Text>
            <ArrowDiagonalIcon w="14px" h="14px" />
          </Flex>
        </Button>
      </Box>
    );
  };

  const MobileTable = useCallback(
    ({ data, ID }: { data: LendAndBorrowItem[]; ID: ActionType }) => {
      const Cell = ({
        autoHeight = true,
        heading = false,
        children,
        ...props
      }) => (
        <Flex
          alignItems="center"
          w="full"
          fontSize="14px"
          bg={heading ? 'transparent' : 'bgBoxLighter'}
          h={autoHeight ? '2rem' : '5rem'}
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
      const TableHeadings = ['Asset', 'APY', 'Amount'];

      const renderTableHeader = () => (
        <Col>
          {TableHeadings.map((heading, i) => (
            <Cell heading key={`${heading}-${i}`}>
              {heading}
            </Cell>
          ))}
        </Col>
      );

      const finalData: string[][] = [];

      data.forEach((item: LendAndBorrowItem) => {
        const apy = `${item.apy}`;
        const amount = `${item.amount} ${item.symbol}`;
        return finalData.push([item.symbol, apy, amount]);
      });

      return (
        <Flex position="relative">
          {renderTableHeader()}
          <Flex
            gap="spacing03"
            position="relative"
            overflowX="auto"
            overflowY="hidden"
          >
            {finalData.map((row, i) => (
              <Col key={`Row-${i}`}>
                {row.map((cell, index) => {
                  return (
                    <Cell
                      color={index === 1 ? apyLabelColor(ID) : ''}
                      key={`Cell-${index}`}
                    >
                      {cell}
                    </Cell>
                  );
                })}
              </Col>
            ))}
          </Flex>
        </Flex>
      );
    },
    [],
  );

  const DesktopTable = useCallback(
    ({ data, ID }: { data: LendAndBorrowItem[]; ID: ActionType }) => {
      const renderTableHeader = () => {
        const columns = ['Asset', 'APY', 'Amount'];

        return (
          <Thead>
            <Tr>
              {columns.map((column, i) => (
                <Th key={`Column-${i}`} fontSize="sm" fontWeight="medium">
                  {column}
                </Th>
              ))}
            </Tr>
          </Thead>
        );
      };

      const rederTableBody = (data, ID) => {
        return (
          <Tbody>
            {data.map((item: LendAndBorrowItem, index) => (
              <Tr fontSize="sm" h="48px" key={`${item.symbol}-${index}`}>
                <Td>
                  <Flex align="center">
                    <ImageLogo size="32px" symbol={item.symbol} />
                    <Text ml="4px">{item.symbol}</Text>
                  </Flex>
                </Td>

                <Td color={apyLabelColor(ID)}>{item.apy}</Td>
                <Td>
                  <Flex direction="column" gap="4px">
                    <Text>
                      {item.amount} {item.symbol}
                    </Text>
                    <Text>
                      {+item.amountInUSD < MIN_POSITION_AMOUNT_USD
                        ? `< $${MIN_POSITION_AMOUNT_USD}`
                        : `$${item.amountInUSD}`}
                    </Text>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        );
      };

      return (
        <TableContainer>
          <Table variant="default">
            <>
              {renderTableHeader()}
              {rederTableBody(data, ID)}
            </>
          </Table>
        </TableContainer>
      );
    },
    [],
  );

  const NoLendAndBorrow = () => (
    <Flex>
      <Box textAlign="center" marginInline="auto" mt="spacing05">
        <Text fontSize="sm" color="gray" mb="spacing03">
          {t(`${translationPath}.NoLendAndBorrowText`)}
        </Text>
        <Button variant="primary" onClick={() => openInNewTab(OLA_FINANCE_URL)}>
          Lend & Borrow
          <ArrowDiagonalIcon w="20px" h="20px" />
        </Button>
      </Box>
    </Flex>
  );

  const TableHeader = useCallback(
    ({ noOfTokens, children }) => (
      <Text fontSize="sm" fontWeight="medium" color="gray" mt="15px">
        {`${noOfTokens} ${children}`}
      </Text>
    ),
    [],
  );

  const TableFooter = useCallback(
    ({ text, data }) => (
      <Flex
        justifyContent="space-between"
        fontWeight="medium"
        mt="12px"
        alignItems="center"
      >
        <Text fontSize="base" fontWeight="medium">
          {text}
        </Text>
        <Text fontSize="xl" fontWeight="medium">
          ${data}
        </Text>
      </Flex>
    ),
    [],
  );

  const suppliedSection = () => {
    return (
      <>
        <TableHeader noOfTokens={suppliedTokens.length}>
          {suppliedTokens.length > 2 ? 'Tokens supplied' : 'Token supplied'}
        </TableHeader>
        {isMobile ? (
          <MobileTable data={suppliedTokens} ID={ActionType.Supplied} />
        ) : (
          <DesktopTable data={suppliedTokens} ID={ActionType.Supplied} />
        )}
        <TableFooter
          text={t(`${translationPath}.labels.totalSupplied`)}
          data={suppliedTokens
            .reduce((acc, current) => acc + parseFloat(current.amountInUSD), 0)
            .toFixed(2)}
        />
      </>
    );
  };

  const borrowedSection = () => {
    return (
      <>
        <TableHeader noOfTokens={borrowedTokens.length}>
          {borrowedTokens.length > 2 ? 'Tokens borrowed' : 'Token borrowed'}
        </TableHeader>

        {isMobile ? (
          <MobileTable data={borrowedTokens} ID={ActionType.Borrowed} />
        ) : (
          <DesktopTable data={borrowedTokens} ID={ActionType.Borrowed} />
        )}

        <TableFooter
          text={t(`${translationPath}.labels.totalBorrowed`)}
          data={borrowedTokens
            .reduce((acc, current) => acc + parseFloat(current.amountInUSD), 0)
            .toFixed(2)}
        />
      </>
    );
  };

  return (
    <StyledPanel footer={renderPanelFooter()}>
      <Box p="1.5rem">
        {renderPanelHeader()}
        {noLendAndBorrowData ? (
          <NoLendAndBorrow />
        ) : (
          <>
            {suppliedTokens.length ? suppliedSection() : null}
            {borrowedTokens.length ? borrowedSection() : null}
          </>
        )}
      </Box>
    </StyledPanel>
  );
};

export default LendAndBorrowPanel;
