import { useTranslation } from 'react-i18next';
import { TokensTableRow } from './TokensTable.d';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  VStack,
  Icon,
} from '@chakra-ui/react';
import useMobile from 'utils/isMobile';
import TokenList from 'app/pages/Farms/components/TokenList/TokenList';
import { useEffect, useState } from 'react';
import { default as sortFn } from './sortUtils';
import { ReactComponent as ChevronDown } from 'app/assets/images/chevron-down.svg';
import './styles.css';

let currentlySortBy = '';
let currentSortDir = '';
const direction = dir => (dir === 'des' ? 'rotate(180deg)' : 'rotate(0)');

const TokensTable = ({
  items,
  showBribes = false,
}: {
  items: TokensTableRow[];
  showBribes?: boolean;
  values?: number[];
  onChange: (value, index) => void;
}) => {
  const { t } = useTranslation();
  const translationPath = 'inSpirit.voting.table';
  const [itemsToList, setItemsToList] = useState<TokensTableRow[]>([]);
  const isMobile = useMobile();

  useEffect(() => {
    currentlySortBy = '';
    currentSortDir = '';
    const itemsFiltered = showBribes
      ? items
      : items.filter(item => item.tokens.length >= 2);
    setItemsToList(itemsFiltered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const sort = by => {
    if (currentlySortBy === by) {
      currentSortDir = currentSortDir === 'asc' ? 'des' : 'asc';
    } else {
      currentlySortBy = by;
      currentSortDir = 'asc';
    }
    setItemsToList(sortFn(itemsToList, by, currentSortDir));
  };

  const Arrow = ({ show }) => (
    <Icon
      as={ChevronDown}
      transform={direction(currentSortDir)}
      color={!show ? 'bgBoxLighter' : ''}
    />
  );

  const DesktopTable = ({ itemsFiltered }) => (
    <Table variant="inspirit">
      <Thead>
        <Tr _hover={{ cursor: 'pointer' }}>
          <Th fontSize="14px" onClick={() => sort('boostedFarms')} minW="145px">
            {t(`${translationPath}.boostedFarms`)}
            <Arrow show={currentlySortBy === 'boostedFarms'} />
          </Th>
          <Th
            fontSize="14px"
            onClick={() => sort('totalLiquidity')}
            minW="150px"
          >
            {t(`${translationPath}.totalLiquidity`)}
            <Arrow show={currentlySortBy === 'totalLiquidity'} />
          </Th>
          {showBribes && (
            <Th fontSize="14px" onClick={() => sort('bribes')}>
              {t(`${translationPath}.bribes`)}
            </Th>
          )}
          <Th fontSize="14px" onClick={() => sort('globalVoting')}>
            {t(`${translationPath}.globalVoting`)}
            <Arrow show={currentlySortBy === 'globalVoting'} />
          </Th>
          <Th fontSize="14px" onClick={() => sort('yourVote')}>
            {t(`${translationPath}.yourVote`)}
            <Arrow show={currentlySortBy === 'yourVote'} />
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {itemsFiltered.map((item, index) => {
          return (
            <Tr key={`table-${item.tokens.join('/')}`}>
              <Td maxW={'8rem'}>
                <TokenList
                  boosted={false}
                  title={item.tokens.join('+')}
                  tokens={[item.tokens]}
                  hideTypeTitle
                  hideTypeIcons
                  invertTitleOrder
                  titleSmall
                />
              </Td>
              <Td>
                <Text maxW={'8rem'}>{item.liquidity.replace(/,/g, '')}</Text>
              </Td>
              {showBribes && (
                <Td>
                  <Text>{item.rewards}</Text>
                </Td>
              )}
              <Td>
                <Flex>
                  <Text mr="5px" fontSize="sm">
                    {item.globalVoting.percent}
                  </Text>
                  <Text fontSize="sm" color="grayDarker">
                    {item.globalVoting.total}
                  </Text>
                </Flex>
              </Td>
              <Td></Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );

  const MobileTable = ({ itemsFiltered }) => {
    return (
      <Flex position={'relative'}>
        <Col position={'absolute'} w={'4rem'} zIndex={'100'} top={'0'}>
          <Cell noPadding transparent onClick={() => sort('boostedFarms')}>
            {t(`${translationPath}.boostedFarms`)}
            <Arrow show={currentlySortBy === 'boostedFarms'} />
          </Cell>
          <Cell noPadding transparent onClick={() => sort('totalLiquidity')}>
            {t(`${translationPath}.totalLiquidity`)}
            <Arrow show={currentlySortBy === 'totalLiquidity'} />
          </Cell>
          {showBribes && (
            <Cell noPadding transparent>
              {t(`${translationPath}.bribes`)}
            </Cell>
          )}
          <Cell noPadding transparent onClick={() => sort('globalVoting')}>
            {t(`${translationPath}.globalVoting`)}
            <Arrow show={currentlySortBy === 'globalVoting'} />
          </Cell>
          <Cell
            noPadding
            transparent
            autoHeight
            onClick={() => sort('yourVote')}
          >
            {t(`${translationPath}.yourVote`)}
            <Arrow show={currentlySortBy === 'yourVote'} />
          </Cell>
        </Col>

        <Flex
          gap={'.5rem'}
          position="relative"
          overflowX={'auto'}
          overflowY={'hidden'}
          flexDirection={'row'}
          pb={'0.5rem'}
          ml={'5rem'}
        >
          {itemsFiltered.map((item, index) => (
            <Col key={item?.fulldata?.address}>
              <Cell>
                <TokenList
                  boosted={false}
                  title={item.tokens.join('+')}
                  tokens={[item.tokens]}
                  hideTypeTitle
                  hideTypeIcons
                  invertTitleOrder
                  titleSmall
                />
              </Cell>
              <Cell>{item.liquidity}</Cell>
              {showBribes && (
                <Td>
                  <Text>{item.rewards}</Text>
                </Td>
              )}
              <Cell>
                <Flex gap={'.5rem'}>
                  <Text>{item.globalVoting.percent}</Text>
                  <Text color={'grayDarker'}>{item.globalVoting.total}</Text>
                </Flex>
              </Cell>
            </Col>
          ))}
        </Flex>
      </Flex>
    );
  };

  return isMobile ? (
    <MobileTable itemsFiltered={itemsToList} />
  ) : (
    <DesktopTable itemsFiltered={itemsToList} />
  );
};

const Col = ({ children, ...props }) => (
  <VStack alignItems={'flex-start'} {...props}>
    {children}
  </VStack>
);

const Cell = ({
  noPadding = false,
  transparent = false,
  autoHeight = false,
  onClick = () => {},
  children,
}) => (
  <Flex
    alignItems={'center'}
    w={'full'}
    bg={transparent ? 'transparent' : 'grayBorderToggle'}
    h={autoHeight ? '2rem' : '5rem'}
    p={noPadding ? '0' : '.5rem'}
    borderRadius={'.25rem'}
    onClick={onClick}
  >
    {children}
  </Flex>
);

export default TokensTable;
