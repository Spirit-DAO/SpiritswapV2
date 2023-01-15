import { useEffect, useState } from 'react';
import { Props } from './ModalToken.d';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import ListTokenItem from '../ListTokenItem';
import { useTranslation } from 'react-i18next';
import { UserCustomToken } from 'app/interfaces/General';
import { BackspaceIconButton, SearchIcon } from 'app/assets/icons';
import { GetBridgeWallets, formatAmount, checkAddress } from 'app/utils';
import { useTokens } from 'app/hooks/useTokens';
import { CommonTokens } from '../CommonTokens';
import { useTokenBalances } from 'app/hooks/useTokenBalances';
import { List } from 'react-virtualized';
import useWallets from 'app/hooks/useWallets';
import { resolveRoutePath } from 'app/router/routes';

const ModalToken = ({
  tokens,
  commonTokens,
  tokenSelected,
  bridge,
  onSelect,
  isOpen,
  onClose,
  chainID,
  notSearchToken,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'common.tokenModal';
  const [inputSearch, setInputSearch] = useState('');
  const { tokens: allTokens, getAddressTokenInfo } = useTokens(chainID, bridge);
  const { wallet } = useWallets();
  const { originWallet, destinationWallet } = GetBridgeWallets();
  const [filteredTokens, setFilteredTokens] = useState<UserCustomToken[]>([]);
  const [commonBridge, setCommonBridge] = useState<UserCustomToken[]>([]);
  if (!tokens) {
    tokens = allTokens;
  }

  const liFinacneBalance = useTokenBalances(chainID);

  useEffect(() => {
    if (tokens) {
      const filterTokens = tokens?.filter(
        ({ name, address, symbol, chainId }) =>
          name?.toLowerCase().includes(inputSearch.toLowerCase()) ||
          address?.toLowerCase().includes(inputSearch.toLowerCase()) ||
          symbol?.toLowerCase().includes(inputSearch.toLowerCase()),
      );

      if (bridge) {
        const commonWithBalance = commonTokens.map(token => {
          const findToken = liFinacneBalance.tokens.find(liToken =>
            checkAddress(token.address, liToken.address),
          );
          if (findToken) {
            const path =
              findToken.chainId === 250
                ? resolveRoutePath(`images/tokens/${findToken.symbol}.png`)
                : findToken.logoURI;

            return {
              balance:
                !findToken?.amount || findToken?.amount === '0'
                  ? '0'
                  : formatAmount(findToken.amount, findToken.decimals, 4),
              balanceUSD:
                findToken.amount === '0'
                  ? '0'
                  : (
                      Number(findToken.amount) *
                      Number(findToken.priceUSD ?? '0.1')
                    ).toFixed(4),
              address: findToken.address,
              symbol: findToken.symbol,
              decimals: findToken.decimals,
              chainId: findToken.chainId,
              name: findToken.name,
              coinKey: findToken.coinKey,
              priceUSD: findToken.priceUSD,
              logoURI: path,
            };
          }
          return { ...token, balance: '0', balanceUSD: '0' };
        });
        setCommonBridge(commonWithBalance);
      }

      const tokensWithBalance = filterTokens?.map(token => {
        let target = wallet;
        if (bridge) {
          const liFinanceToken = liFinacneBalance.tokens.find(litoken =>
            checkAddress(token.address, litoken.address),
          );

          if (
            liFinanceToken &&
            liFinanceToken?.amount &&
            liFinanceToken.logoURI
          ) {
            const path =
              liFinanceToken.chainId === 250
                ? resolveRoutePath(`images/tokens/${liFinanceToken.symbol}.png`)
                : liFinanceToken.logoURI;

            return {
              balance:
                liFinanceToken?.amount === '0'
                  ? '0'
                  : formatAmount(
                      liFinanceToken.amount,
                      liFinanceToken.decimals,
                      4,
                    ),
              balanceUSD:
                liFinanceToken.amount === '0'
                  ? '0'
                  : (
                      Number(liFinanceToken.amount) *
                      Number(liFinanceToken.priceUSD ?? '0.1')
                    ).toFixed(4),
              address: liFinanceToken.address,
              symbol: liFinanceToken.symbol,
              decimals: liFinanceToken.decimals,
              chainId: liFinanceToken.chainId,
              name: liFinanceToken.name,
              coinKey: liFinanceToken.coinKey,
              priceUSD: liFinanceToken.priceUSD,
              logoURI: path,
            };
          }
        }

        let tokenBalance: any = liFinacneBalance?.tokens?.find(balance =>
          checkAddress(balance.address, token.address),
        );
        if (!tokenBalance) {
          tokenBalance = target?.find(balance =>
            checkAddress(balance.address, token.address),
          );
        }
        if (tokenBalance && tokenBalance.amount) {
          return {
            ...token,
            balance: formatAmount(tokenBalance.amount, token.decimals, 4),
            balanceUSD:
              tokenBalance.usd ??
              (
                parseFloat(tokenBalance.priceUSD ?? '0') *
                parseFloat(tokenBalance.amount ?? '0')
              ).toFixed(2),
          };
        }

        return { ...token, balance: '0', balanceUSD: '0' };
      });
      const orderedTokens = tokensWithBalance?.sort((a, b) => {
        if (Number(a.balanceUSD) > Number(b.balanceUSD)) {
          return -1;
        }
        if (Number(a.balanceUSD) < Number(b.balanceUSD)) {
          return 1;
        }
        return 0;
      });
      setFilteredTokens(orderedTokens);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tokens,
    wallet,
    bridge,
    destinationWallet,
    inputSearch,
    originWallet,
    liFinacneBalance.tokens,
  ]);

  const handleInputChange = async value => {
    setInputSearch(value);
    const filterTokens = tokens?.filter(
      ({ name, address, symbol }) =>
        name?.toLowerCase().includes(value.toLowerCase()) ||
        address?.toLowerCase().includes(value.toLowerCase()) ||
        symbol?.toLowerCase().includes(value.toLowerCase()),
    );

    const address = value.toLowerCase();

    if (!filterTokens?.length && address.length > 30 && !notSearchToken) {
      const token = await getAddressTokenInfo(address);
      setFilteredTokens(token);
    }
  };

  const resetInput = () => {
    setInputSearch('');
  };

  const onModalClose = () => {
    resetInput();
    onClose();
  };

  const TokenRenderer = ({ index, key, style }) => {
    const item = filteredTokens[index];
    return (
      <ListTokenItem
        key={`${item.symbol}-${item.address}-${index}`}
        bridge={bridge}
        onClose={onModalClose}
        item={item}
        onSelect={onSelect}
        style={style}
      />
    );
  };

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onModalClose}
      isCentered
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent bg="bgBoxDarker">
        <ModalHeader fontWeight="500">
          {t(`${translationPath}.select`, 'Select a token')}
        </ModalHeader>
        <InputGroup px="spacing06">
          <InputLeftElement
            color="grayDarker"
            left="25px"
            children={<SearchIcon color="grayDarker" />}
          />
          <Input
            w="full"
            aria-label="search-input"
            fontSize="lg"
            placeholder={
              !notSearchToken
                ? 'Search by name'
                : t(`${translationPath}.placeholder`)
            }
            value={inputSearch}
            onChange={e => handleInputChange(e.target.value)}
            sx={{
              '::placeholder': {
                color: 'grayDarker',
              },
            }}
          />
          <InputRightElement
            _hover={{ border: 'none' }}
            onClick={resetInput}
            right="25px"
            color="grayDarker"
            children={<BackspaceIconButton color="grayDarker" />}
          />
        </InputGroup>
        <ModalCloseButton />
        <ModalBody>
          <CommonTokens
            tokenSelected={tokenSelected}
            tokensToShow={bridge ? commonBridge : commonTokens}
            onSelectToken={onSelect}
            onClose={onModalClose}
          />

          <Text
            color="gray"
            ml="8px"
            fontWeight="400"
            fontSize="14px"
            display="inline-block"
          >
            {filteredTokens && filteredTokens.length} Tokens
          </Text>

          <Text
            color="gray"
            mr="4px"
            fontWeight="400"
            fontSize="14px"
            float="right"
            display="inline-block"
          >
            USD Value
          </Text>

          <Text
            color="gray"
            ml="8px"
            fontWeight="400"
            fontSize="14px"
            display="inline-block"
          >
            {filteredTokens && filteredTokens.length} Tokens
          </Text>

          {filteredTokens ? (
            <List
              rowRenderer={TokenRenderer}
              rowCount={filteredTokens.length}
              rowWidth={400}
              rowHeight={53}
              height={400}
              width={400}
            />
          ) : (
            <Text>
              {t(`${translationPath}.noToken`, 'No tokens availables')}
            </Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ModalToken;
