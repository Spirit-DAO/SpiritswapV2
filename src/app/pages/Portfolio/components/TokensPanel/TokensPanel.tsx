import {
  ReactNode,
  useCallback,
  useState,
  ChangeEvent,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { getSign } from 'app/utils';
import { TokenOptions } from 'app/utils/tokenOptions';
import { Heading, Paragraph } from 'app/components/Typography';
import { PercentBadge } from 'app/components/PercentBadge';
import { Suffix } from 'app/components/Suffix';
import { CardHeader } from 'app/components/CardHeader';
import { onClickUrl } from 'app/utils/redirectTab';
import { TOKENS } from 'constants/icons';
import { ListItem } from '../ListItem';
import {
  StyledPanel,
  StyledHeader,
  StyledFooter,
  StyledContent,
  StyledIconToInput,
  StyledNoTokensBody,
  StyledNoTokensMessage,
  StyledTokenCount,
  StyledGrayParagraph,
  StyledDescription,
  StyledDropdown,
} from './styles';
import {
  Flex,
  List,
  Skeleton,
  Stack,
  Button as ChakraButton,
} from '@chakra-ui/react';
import { TOKENS_TO_SHOW } from 'constants/index';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setTokensToShow } from 'store/general';
import { useNavigate } from 'app/hooks/Routing';
import { balanceReturnData, tokenData } from 'utils/data';
import { selectTokens } from 'store/user/selectors';
import { ArrowDiagonalIcon } from 'app/assets/icons';
import { Button } from 'app/components/Button';
import { BRIDGE, SWAP } from 'app/router/routes';

interface Props {
  tokensData: balanceReturnData;
}

const TokensPanel = ({ tokensData }: Props) => {
  const { tokenList = [], totalValue, diffAmount, diffPercent } = tokensData;
  const { t } = useTranslation();
  const translationPath = 'portfolio.tokensPanel';
  const commonTranslationPath = 'portfolio.common';
  const commonMenuPath = 'common.menu';
  const isLoading = useAppSelector(selectTokens).tokenList.length === 0;
  const dispath = useAppDispatch();
  const [query, setQuery] = useState<string>('');
  const [dropdownID, setDropdownID] = useState<string>(TOKENS_TO_SHOW.VERIFIED);
  const navigate = useNavigate();

  const tokensFound = !!tokenList.length;

  const dropdownItems = [
    {
      id: TOKENS_TO_SHOW.ALL,
      value: t(`${commonTranslationPath}.verifiedDropdown.allTokens`),
      type: 'option',
    },
    {
      id: TOKENS_TO_SHOW.VERIFIED,
      value: t(`${commonTranslationPath}.verifiedDropdown.verified`),
      type: 'option',
    },
    {
      id: TOKENS_TO_SHOW.UNVERIFIED,
      value: t(`${commonTranslationPath}.verifiedDropdown.unverified`),
      type: 'option',
    },
  ];

  const onSelectDropdown = (itemID: string) => {
    dispath(setTokensToShow(itemID));
    setDropdownID(itemID);
  };

  useEffect(() => {
    dispath(setTokensToShow(TOKENS_TO_SHOW.VERIFIED));
    setDropdownID(TOKENS_TO_SHOW.VERIFIED);
  }, [dispath]);

  const filteredList =
    tokenList?.filter((token: tokenData) =>
      token?.name?.toLowerCase().includes(query.toLowerCase()),
    ) || [];

  const onSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const renderHeader = (): ReactNode => (
    <StyledHeader>
      <CardHeader
        id={TOKENS}
        title={t(`${translationPath}.title`)}
        helperContent={{
          title: t(`${translationPath}.title`),
          text: t(`${translationPath}.helper`),
          showDocs: true,
        }}
      />
      {tokensFound && <StyledIconToInput onChange={onSearch} />}
    </StyledHeader>
  );

  const renderFooter = (): ReactNode => (
    <StyledFooter>
      <Button variant="secondary" onClick={() => navigate(BRIDGE.path)}>
        {t(`${translationPath}.footer.bridge`)}
      </Button>
      <Button
        variant="secondary"
        onClick={() => navigate(`${SWAP.path}/FTM/SPIRIT`)}
      >
        {t(`${translationPath}.footer.swap`)}
      </Button>
    </StyledFooter>
  );

  const renderTokenList = (list: tokenData[]): ReactNode => (
    <List
      display="inline-grid"
      gap=" 0.25rem"
      maxH="170px"
      mb="spacing05"
      w="100%"
      gridAutoFlow="row"
      overflowY="scroll"
    >
      {list.map((token, index) => (
        <ListItem
          key={`token-list-${index}`}
          tokenName={token.name}
          tokenAmount={token.amount}
          tokenAddress={`${token?.address}`}
          usdAmount={token.usd}
          options={TokenOptions(token.address)}
        />
      ))}
    </List>
  );

  const renderTokensStatus = () => {
    if (query || !tokenList.length) return null;

    return (
      <>
        {totalValue && (
          <StyledDescription>
            <Heading level={4}>
              {t(`${commonTranslationPath}.totalValue`)}
            </Heading>
            <Heading level={2}>{totalValue}</Heading>
          </StyledDescription>
        )}
        {(diffAmount || diffPercent !== undefined) && (
          <StyledDescription>
            <Paragraph sub>
              {t(`${commonTranslationPath}.lastChange`)}
            </Paragraph>
            <Suffix
              suffix={
                diffPercent !== undefined ? (
                  <PercentBadge
                    amount={diffPercent}
                    sign={getSign(diffPercent)}
                  />
                ) : null
              }
            >
              {diffAmount && (
                <StyledGrayParagraph>{diffAmount}</StyledGrayParagraph>
              )}
            </Suffix>
          </StyledDescription>
        )}
      </>
    );
  };

  const renderNotFound = (): ReactNode => (
    <StyledNoTokensBody>
      <StyledNoTokensMessage>
        {dropdownID === TOKENS_TO_SHOW.ALL &&
          t(`${translationPath}.noTokens.message.ALL`)}
        {dropdownID === TOKENS_TO_SHOW.VERIFIED &&
          t(`${translationPath}.noTokens.message.VERIFIED`)}
        {dropdownID === TOKENS_TO_SHOW.UNVERIFIED &&
          t(`${translationPath}.noTokens.message.UNVERIFIED`)}
      </StyledNoTokensMessage>
      <Stack spacing={4} direction="row" align="center">
        <Button variant="primary" onClick={() => navigate(BRIDGE.path)}>
          {t(`${translationPath}.noTokens.action`)}
        </Button>
        <ChakraButton
          rightIcon={<ArrowDiagonalIcon w="20px" h="auto" color="inherit" />}
          bg="ciDark"
          _hover={{ bg: 'ciDark', opacity: 0.8 }}
          variant="solid"
          onClick={onClickUrl('https://spiritswap.banxa.com/')}
        >
          {t(`${commonMenuPath}.buyftm`)}
        </ChakraButton>
      </Stack>
    </StyledNoTokensBody>
  );

  const renderTokens = (): ReactNode => {
    if (isLoading) {
      return (
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          w="full"
          h="170px"
          mb="spacing05"
        />
      );
    }

    if (!tokenList.length) {
      return renderNotFound();
    }

    if (query) {
      return (
        <>
          {filteredList.length
            ? renderTokenList(filteredList)
            : renderNotFound()}
        </>
      );
    }

    return <>{renderTokenList(tokenList)}</>;
  };

  const renderStatusBar = (): ReactNode => {
    return (
      <Flex
        w="full"
        pr="spacing02"
        h="20px"
        justifyContent="space-between"
        alignItems="center"
        mb="spacing02"
      >
        <StyledTokenCount level={5}>
          {!tokensFound
            ? t(`${translationPath}.tokensNotFound`)
            : query
            ? `${filteredList.length} ${t(`${translationPath}.searchResults`)}`
            : `${tokenList.length} ${t(`${translationPath}.title`)}`}
        </StyledTokenCount>
        <StyledDropdown
          items={dropdownItems}
          selectedId={dropdownID}
          onSelect={onSelectDropdown}
          isUnverified={dropdownID === TOKENS_TO_SHOW.UNVERIFIED}
        />
      </Flex>
    );
  };

  return (
    <StyledPanel footer={tokensFound && renderFooter()}>
      <StyledContent>
        {renderHeader()}
        {renderStatusBar()}
        {renderTokens()}
        {isLoading ? null : renderTokensStatus()}
      </StyledContent>
    </StyledPanel>
  );
};

export default TokensPanel;
