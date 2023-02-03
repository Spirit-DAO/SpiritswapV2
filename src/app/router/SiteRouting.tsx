import { useCallback, useEffect, useState, useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Box } from '@chakra-ui/react';
import { InspiritPage } from 'app/pages/Inspirit/Loadable';
import { LiquidityPage } from 'app/pages/Liquidity/Loadable';
import { FarmsPage } from 'app/pages/Farms/Loadable';
import { SwapPage } from 'app/pages/Swap/Loadable';
import { BridgePage } from 'app/pages/Bridge/Loadable';
import { HomePage } from 'app/pages/Home/Loadable';
import { ApeModePage } from 'app/pages/ApeMode/Loadable';
import { TopBar } from 'app/layouts/TopBar';
import { Footer as MidFooter } from 'app/layouts/Footer';
import PageFooter from 'app/components/PageFooter';
import { UnexpectedErrorPage, NotFoundPage } from 'app/pages/Errors';
import { selectUnexpectedError } from 'store/errors/selectors';
import { useAppSelector } from 'store/hooks';
import ScrollToTop from 'app/components/ScrollToTop';
import { SpiritWars } from 'app/pages/SpiritWars';
import {
  APEMODE,
  BRIDGE,
  FARMS,
  HOME,
  INSPIRIT,
  LIQUIDITY,
  SPIRITWARS,
  SWAP,
  resolveRoutePath,
} from './routes';

const SiteRouting = () => {
  const unexpectedError = useAppSelector(selectUnexpectedError);
  const [showFooter, setShowFooter] = useState(false);

  const Pages = useCallback(
    () => (
      <ErrorBoundary
        FallbackComponent={UnexpectedErrorPage}
        resetKeys={[unexpectedError]}
      >
        <div id="top-page" />
        <Routes>
          <Route
            path={resolveRoutePath()}
            element={<Navigate to={resolveRoutePath(HOME.path)} />}
          />
          <Route path={resolveRoutePath(HOME.path)} element={<HomePage />} />
          <Route path={resolveRoutePath(SWAP.path)} element={<SwapPage />} />
          <Route
            path={`${resolveRoutePath(SWAP.path)}/address/:address`}
            element={<SwapPage />}
          />
          <Route
            path={`${resolveRoutePath(SWAP.path)}/:token1`}
            element={<SwapPage />}
          />{' '}
          <Route
            path={`${resolveRoutePath(SWAP.path)}/:token1/:token2`}
            element={<SwapPage />}
          />
          <Route
            path={resolveRoutePath(BRIDGE.path)}
            element={<BridgePage />}
          />
          <Route
            path={resolveRoutePath(LIQUIDITY.path)}
            element={<LiquidityPage />}
          />
          <Route
            path={`${resolveRoutePath(LIQUIDITY.path)}/:token1/:token2`}
            element={<LiquidityPage />}
          />
          <Route
            path={`${resolveRoutePath(LIQUIDITY.path)}/:token1/:token2/:type`}
            element={<LiquidityPage />}
          />
          <Route
            path={`${resolveRoutePath(LIQUIDITY.path)}/:token1/:token2/remove`}
            element={<LiquidityPage />}
          />
          <Route path={resolveRoutePath(FARMS.path)} element={<FarmsPage />}>
            <Route
              path={`${resolveRoutePath(FARMS.path)}/:address`}
              element={<FarmsPage />}
            />
          </Route>
          <Route
            path={resolveRoutePath(INSPIRIT.path)}
            element={<InspiritPage />}
          />
          {/* <Route path={APEMODE.path} element={<ApeModePage />} /> */}
          <Route
            path={resolveRoutePath(SPIRITWARS.path)}
            element={<SpiritWars />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    ),
    [unexpectedError],
  );

  window.onbeforeunload = () => {
    localStorage.setItem('scrollPosition', `${window.scrollY}`);
    setShowFooter(false);
  };

  window.onload = () => {
    const scrollPosition = localStorage.getItem('scrollPosition');
    setTimeout(() => {
      if (scrollPosition) {
        window.scrollTo({
          top: +scrollPosition,
          behavior: 'smooth',
        });
      }
      setShowFooter(true);
    }, 500);
  };

  useEffect(() => {
    function setScroll() {
      const header = document.getElementById('top-bar');

      if (window.pageYOffset > 1) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', setScroll);
    return () => {
      window.removeEventListener('scroll', setScroll);
    };
  }, []);

  const Page = useCallback(() => <Pages />, [Pages]);

  return (
    <Box minH="100vh" overflowY="scroll">
      <BrowserRouter>
        <TopBar />
        <ScrollToTop />
        <Page />
        <MidFooter />
        {showFooter ? <PageFooter /> : null}
      </BrowserRouter>
      <div id="bottom-page" />
    </Box>
  );
};

export default SiteRouting;
