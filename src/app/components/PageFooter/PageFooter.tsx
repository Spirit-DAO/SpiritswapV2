import {
  Box,
  HStack,
  Text,
  Grid,
  VStack,
  SimpleGrid,
  useMediaQuery,
  Flex,
  Link,
  Button,
} from '@chakra-ui/react';
import {
  DiscordSvg,
  GitHubSvg,
  MediumSvg,
  TwitterSvg,
  YouTubeSvg,
  TelegramSvg,
} from 'app/layouts/Footer';
import { AuditedByDiv } from 'app/layouts/Footer/styles';
import { StyledArrowDownCircleIcon } from 'app/pages/Home/components/styles';
import { Heading } from 'app/components/Typography';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'store/hooks';
import { setShowPortfolio } from 'store/user';

import { useAppSelector } from 'store/hooks';
import { selectIsLoggedIn, selectShowPortfolio } from 'store/user/selectors';
import { selectIsHomePage } from 'store/general/selectors';
import { useNavigate } from 'app/hooks/Routing';
import {
  ZOKYO_AUDIT_URL,
  PECK_SHIELD_AUDIT_URL,
  SPIRIT_DOCS_URL,
  SPIRIT_WHITELISTING_FORMS,
} from 'constants/index';
import { PeckShiledAuditLogo, ZokyoAuditLogo } from 'app/assets/icons';

declare global {
  var __COMMIT__: boolean;
}
export default function PageFooter() {
  const { t } = useTranslation();
  const translationPath = 'common.footer';
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(`(max-width: 820px)`)[0];
  const navigate = useNavigate();

  const onClickLandingButton = () => {
    dispatch(setShowPortfolio(false));
    navigate('');
  };
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isPortfolioShown = useAppSelector(selectShowPortfolio);
  const isHomePage = useAppSelector(selectIsHomePage);

  return (
    <Box bg="#000314" position="relative">
      <Box p="24px" pt="32px" bg="rgba(100, 221, 192,0.05)" color="gray">
        {isLoggedIn && isPortfolioShown && isHomePage ? (
          <Box w="full" textAlign="center" mb="40px">
            <Button variant="inverted" h="40px" onClick={onClickLandingButton}>
              <StyledArrowDownCircleIcon />
              <Heading level={4}>
                {t(`${translationPath}.goToLandingPage`)}
              </Heading>
            </Button>
          </Box>
        ) : null}
        <Box maxW="1280px" margin="0 auto">
          <Grid
            templateColumns={'repeat(1, 1fr)'}
            gridTemplateColumns={!isMobile ? '1.1fr .9fr' : '1fr'}
          >
            <VStack align="stretch">
              <HStack
                gap="15px"
                alignSelf={isMobile ? 'center' : 'left'}
                color="white"
              >
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://twitter.com/Sterling_Fi"
                  _hover={{ color: 'ci' }}
                >
                  <TwitterSvg />
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://discord.gg/Mr92PZ63xZ"
                  _hover={{ color: 'ci' }}
                >
                  <DiscordSvg />
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/Sterl-o"
                  _hover={{ color: 'ci' }}
                >
                  <GitHubSvg />
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href=""
                  _hover={{ color: 'ci' }}
                >
                  <YouTubeSvg />
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://medium.com/@sterlingfinancearb"
                  _hover={{ color: 'ci' }}
                >
                  <MediumSvg />
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://youtu.be/NMqeWMujiFA"
                  _hover={{ color: 'ci' }}
                >
                  <TelegramSvg />
                </Link>

                {isMobile ? null : (
                  <Button fontSize="base" fontWeight="normal">
                    <Link
                      target="_blank"
                      rel="noreferrer"
                      href={SPIRIT_WHITELISTING_FORMS}
                    >
                      <Text>Whitelist Application</Text>
                    </Link>
                  </Button>
                )}
              </HStack>
              <Box
                display={isMobile ? 'flex' : 'block'}
                alignSelf={isMobile ? 'center' : 'left'}
                m={isMobile ? '0px' : '10px'}
              >
                <Box m={isMobile ? '0px 5px' : '5px 0px'}>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://fantom.foundation/blog/fantom-ecosystem-spotlight-spiritswap/"
                  >
                    About us
                  </Link>
                </Box>
                <Box m={isMobile ? '0px 5px' : '5px 0px'}>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://analytics.spiritswap.finance/home"
                  >
                    Analytics
                  </Link>
                </Box>
                <Box m={isMobile ? '0px 5px' : '5px 0px'}>
                  <Link target="_blank" rel="noreferrer" href={SPIRIT_DOCS_URL}>
                    Docs
                  </Link>
                </Box>
              </Box>
            </VStack>
            {!isMobile ? null : (
              <Button fontSize="base" fontWeight="normal" mt="25px">
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={SPIRIT_WHITELISTING_FORMS}
                >
                  <Text>Whitelist Application</Text>
                </Link>
              </Button>
            )}
            <SimpleGrid
              columns={isMobile ? 2 : 4}
              gap="20px"
              justifyItems={isMobile ? 'flex-start' : 'flex-end'}
              mt={isMobile ? 10 : 0}
            >
              <VStack align="stretch">
                <Box color="ci" fontWeight="bold">
                  DEX
                </Box>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://defillama.com/protocol/spiritswap"
                >
                  Defi Llama
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.coingecko.com/en/exchanges/spiritswap"
                >
                  CoinGecko
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://coinmarketcap.com/exchanges/spiritswap/"
                >
                  CoinMarketCap
                </Link>
              </VStack>

              <VStack align="stretch">
                <Box color="ci" fontWeight="bold">
                  SPIRIT Token
                </Box>
                <Link target="_blank" rel="noreferrer" href="">
                  CoinGecko
                </Link>
                <Link target="_blank" rel="noreferrer" href="">
                  CoinMarketCap
                </Link>
              </VStack>

              <VStack align="stretch">
                <Box color="ci" fontWeight="bold">
                  Exchanges
                </Box>

                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://trade.felix.com/en/trade/basic/SPIRIT_USDT"
                >
                  Felix
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.gate.io/trade/SPIRIT_USDT"
                >
                  Gate.io
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.mexc.com/exchange/SPIRIT_USDT"
                >
                  MEXC
                </Link>
              </VStack>

              <VStack align="stretch" justifyContent="center">
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.hotbit.io/exchange?symbol=SPIRIT_USDT"
                >
                  Hotbit
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href="https://poloniex.com/exchange/USDT_SPIRIT"
                >
                  Poloniex
                </Link>
              </VStack>
            </SimpleGrid>
          </Grid>

          <Flex p="40px 0px 0px 0px" mb={isMobile ? 10 : 0} alignItems="center">
            <Text mr="15px" minW="fit-content" color="grayDarker">
              © 2022 SpiritSwap
            </Text>
            <Box bg="ciTrans15" mr={isMobile ? 4 : 0} h="2px" flexGrow={1} />

            <AuditedByDiv>
              <Text mr="8px" fontSize="16px" fontWeight="500">
                {t(`${translationPath}.auditedBy`)}
              </Text>

              <a href={ZOKYO_AUDIT_URL} target="_blank" rel="noreferrer">
                <ZokyoAuditLogo h="18px" w="auto" />
              </a>
              <Text mx="5px">{`&`}</Text>
              <a href={PECK_SHIELD_AUDIT_URL} target="_blank" rel="noreferrer">
                <PeckShiledAuditLogo h="22px" w="auto" />
              </a>
            </AuditedByDiv>
          </Flex>
          <HStack w="full" justify="flex-end" color="grayDarker">
            <Text fontSize="sm">{`Build ${__COMMIT__}`}</Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
