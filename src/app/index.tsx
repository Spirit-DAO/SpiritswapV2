import { Helmet } from 'react-helmet-async';

import { GlobalStyle } from '../styles/global-styles';
import { useTranslation } from 'react-i18next';
import { SiteRouting, RootPathContext } from 'app/router';

import Layers from './assets/background';
import { Box } from '@chakra-ui/react';
import { CHAIN_ID, SPIRIT } from 'constants/index';
import { getTokenUsdPrice } from 'utils/data';
import { useEffect, useState } from 'react';

const GlobalStyleProxy: any = GlobalStyle;

export function App() {
  const { i18n } = useTranslation();
  const [spiritPrice, setSpiritPrice] = useState(0);
  const rootPath = document.documentElement.dataset['rootPath'] || '/';

  useEffect(() => {
    const fetchPrice = async () => {
      const data = await getTokenUsdPrice(SPIRIT.address, CHAIN_ID);
      if (data) {
        setSpiritPrice(data);
      }
    };

    fetchPrice();
  }, []);

  const Layout = ({ children }) => <Box>{children}</Box>;

  return (
    <RootPathContext.Provider value={rootPath}>
      <Helmet
        titleTemplate={`SpiritSwap - $${spiritPrice.toFixed(3)}`}
        defaultTitle={`SpiritSwap - $${spiritPrice.toFixed(3)}`}
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="SpiritSwap webapp" />
      </Helmet>
      <GlobalStyleProxy />

      <Layout>
        <Layers />
        <SiteRouting />
      </Layout>
    </RootPathContext.Provider>
  );
}
