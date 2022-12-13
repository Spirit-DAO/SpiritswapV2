import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import {
  DiscordSvg,
  TwitterSvg,
  GitHubSvg,
  MediumSvg,
  YouTubeSvg,
  TelegramSvg,
} from 'app/layouts/Footer';
import { ThirdPartyItemsDiv } from 'app/layouts/Footer/styles';
import { useTranslation } from 'react-i18next';
import useMobile from 'utils/isMobile';
import { ArrowDownAnimation } from 'app/components/ArrowDownAnimation';
import { PeckShiledAuditLogo, ZokyoAuditLogo } from 'app/assets/icons';
import { PECK_SHIELD_AUDIT_URL, ZOKYO_AUDIT_URL } from 'constants/index';

export default function MiniFooter() {
  const { t } = useTranslation();
  const isMobile = useMobile();

  const translationPath = 'common.footer';

  return (
    <Flex
      flexDirection={isMobile ? 'column' : 'row'}
      justifyContent="space-between"
      mt={isMobile ? '90px' : '0'}
      mb="16px"
      alignItems="center"
      id="mini_footer_landing"
    >
      {!isMobile ? null : (
        <Box>
          <ArrowDownAnimation />
        </Box>
      )}

      <Flex
        justifyContent={isMobile ? 'center' : 'start'}
        py={isMobile ? '20px' : '0'}
      >
        <ThirdPartyItemsDiv>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://discord.gg/8FGd4nFQdT"
          >
            <DiscordSvg />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/Spirit_Swap"
          >
            <TwitterSvg />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Spirit-DAO/"
          >
            <GitHubSvg />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://spiritswap.medium.com/"
          >
            <MediumSvg />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.youtube.com/channel/UCrKLtNctO0obN4-bDMGlFuQ"
          >
            <YouTubeSvg />
          </a>
          <a target="_blank" rel="noreferrer" href="https://t.me/spirit_swap">
            <TelegramSvg />
          </a>
        </ThirdPartyItemsDiv>
      </Flex>

      {isMobile ? null : (
        <Box>
          <ArrowDownAnimation />
        </Box>
      )}

      <Flex
        id="audit_id"
        justifyContent={isMobile ? 'center' : 'end'}
        alignItems="start"
        minW="336px"
      >
        <Text mr="5px">{t(`${translationPath}.auditedBy`)}</Text>

        <a href={ZOKYO_AUDIT_URL} target="_blank" rel="noreferrer">
          <ZokyoAuditLogo h="18px" w="auto" />
        </a>
        <Text mx="5px">{`&`}</Text>
        <a href={PECK_SHIELD_AUDIT_URL} target="_blank" rel="noreferrer">
          <PeckShiledAuditLogo h="22px" w="auto" />
        </a>
      </Flex>
    </Flex>
  );
}
