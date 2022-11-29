import { useTranslation } from 'react-i18next';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Flex } from '@chakra-ui/react';
import Aside from './components/Aside';
import Dashboard from './components/Dashboard';
import { Stats } from './components/Stats';
import { Voting } from './components/Voting';
import { StyledContainer } from './styles';
import SpiritsBackground from './components/SpiritsBackground';
import { GetSpiritLocked } from 'app/utils';
import useMobile from 'utils/isMobile';

const InspiritPage = () => {
  const { t } = useTranslation();
  const pageTitle = `${t('common.name')} - ${t('common.menu.inSpirit')}`;
  const { spiritLocked } = GetSpiritLocked();
  const isMobile = useMobile('1024px');

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="inSPIRIT" content="inSPIRIT" />
        </Helmet>
      </HelmetProvider>

      <SpiritsBackground />

      <StyledContainer ismobile={isMobile ? 1 : 0}>
        <Flex
          flexDirection="column"
          gap=".5rem"
          p={{ base: '0rem .5rem', md: 0 }}
        >
          <Aside spiritLocked={!spiritLocked} />
          <Stats />
        </Flex>

        <Flex
          flexDirection="column"
          gap=".5rem"
          p={{ base: '0.25rem .5rem', md: 0 }}
          mr={isMobile ? '0px' : '8px'}
        >
          <Dashboard />
          {!spiritLocked ? null : <Voting />}
        </Flex>
      </StyledContainer>
    </>
  );
};

export default InspiritPage;
