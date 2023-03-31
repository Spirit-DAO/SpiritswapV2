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
            href="https://discord.gg/Mr92PZ63xZ"
          >
            <DiscordSvg />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/Sterling_Fi"
          >
            <TwitterSvg />
          </a>
          <a target="_blank" rel="noreferrer" href="https://github.com/Sterl-o">
            <GitHubSvg />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://medium.com/@sterlingfinancearb"
          >
            <MediumSvg />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://youtu.be/NMqeWMujiFA"
          >
            <YouTubeSvg />
          </a>
          <a target="https://youtu.be/NMqeWMujiFA">
            <TelegramSvg />
          </a>
        </ThirdPartyItemsDiv>
      </Flex>

      {isMobile ? null : (
        <Box>
          <ArrowDownAnimation />
        </Box>
      )}
    </Flex>
  );
}
