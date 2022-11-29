import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Grid, GridItem } from '@chakra-ui/react';
import { ApeCard } from './components/Card';
import { Chart } from './components/Chart';
import { Positions } from './components/Positions';
import useMobile from 'utils/isMobile';
import { useTranslation } from 'react-i18next';
const ApeModePage = () => {
  const { t } = useTranslation();
  const pageTitle = `${t('common.name')} - ${t('common.menu.apemode')}`;
  const isMobile = useMobile();
  const [chartMode, setChartMode] = useState<boolean>(true);
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="inSPIRIT" content="inSPIRIT" />
        </Helmet>
      </HelmetProvider>
      <Grid
        pt="spacing13"
        pb="spacing13"
        maxWidth="1280px"
        templateRows={isMobile ? '1fr' : 'repeat(2, 1fr)'}
        templateColumns={isMobile ? '1fr' : 'repeat(3, 1fr)'}
        gap={isMobile ? 0 : 2}
        gridRowGap={2}
        m="auto"
        px="spacing03"
      >
        <GridItem rowSpan={isMobile ? 1 : 2} colSpan={1}>
          <ApeCard setChartMode={setChartMode} chartMode={chartMode} />
        </GridItem>
        {chartMode ? (
          <GridItem colSpan={2}>
            <Chart />
          </GridItem>
        ) : null}
        <GridItem colSpan={2}>
          <Positions />
        </GridItem>
      </Grid>
    </>
  );
};

export default ApeModePage;
