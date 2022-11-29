import { render } from '@testing-library/react';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import CollapseItem from '../../Collapse/Collapse';
import { mockUseTranslation } from 'mocks/i18nForTests';
import { store } from 'store';
import { Provider } from 'react-redux';

import { Accordion } from '@chakra-ui/react';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'config/queryClient';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}));

const Component = () => {
  const setLPToken = () => {};
  const handleChangeToken = () => {};
  const hideRemoveLiquidity = () => {};
  const pairsMock = [
    {
      name: 'ginSPIRIT/SPIRIT LP',
      full_name: 'ginSPIRIT-SPIRIT LP',
      amount: '1.2907083746781403',
      symbol: 'ginSPIRIT-SPIRIT LP',
      address: '0xc6ED96EdC14a199bde017A273A2CBd4a129bdC65',
      liquidity: true,
      staked: true,
      title: 'ginSPIRIT + SPIRIT',
      tokens: ['GINSPIRIT', 'SPIRIT'],
      rate: 0,
      rate_24: 0,
      usd: 0,
      usd_24: 0,
    },
    {
      name: 'linSPIRIT/SPIRIT LP',
      full_name: 'linSPIRIT-SPIRIT LP',
      amount: '0.004215737077110635',
      symbol: 'linSPIRIT-SPIRIT LP',
      address: '0x54d5b6881b429a694712fa89875448ca8adf06f4',
      liquidity: true,
      staked: true,
      title: 'linSPIRIT + SPIRIT',
      rate: 0,
      rate_24: 0,
      tokens: ['LINSPIRIT', 'SPIRIT'],
      usd: 0,
      usd_24: 0,
    },
    {
      name: 'SPELL/FTM LP',
      full_name: 'SPELL-FTM LP',
      amount: '2.444618670704541',
      symbol: 'SPELL-FTM LP',
      address: '0x19d4092635740699B6E4735701742740e235165A',
      liquidity: true,
      title: 'SPELL + FTM',
      tokens: ['SPELL', 'FTM'],
      staked: true,
      rate: 0,
      rate_24: 0,
      usd: 0,
      usd_24: 0,
    },
  ];
  return (
    <ThemeWrapper>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Accordion defaultIndex={[1]} allowToggle variant="liquidity">
            {pairsMock.map(pair => (
              <CollapseItem
                setLPToken={setLPToken}
                userAddress={'useraddress'}
                hideRemoveLiquidity={hideRemoveLiquidity}
                handleChangeToken={handleChangeToken}
                pair={pair}
                key={pair.address}
              />
            ))}
          </Accordion>
        </QueryClientProvider>
      </Provider>
    </ThemeWrapper>
  );
};

describe('Collapse component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Component />);
    expect(container.firstChild).toBeTruthy();
  });
});
