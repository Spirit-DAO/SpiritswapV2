import { useState } from 'react';
import Iframe from 'react-iframe';
import { Select } from 'app/components/Select';
import { CardHeader } from 'app/components/CardHeader';
import { useMediaQuery, HStack } from '@chakra-ui/react';
import { breakpoints } from 'theme/base/breakpoints';
import { CHART } from 'constants/icons';
import { ChartContainer } from './styles';

interface Props {
  url: string;
  onCurrencyChange: (string) => void;
  islimit: boolean;
}

const Chart = ({ url, onCurrencyChange, islimit }: Props) => {
  const [coin, setCoin] = useState(0);
  const onCoinpSelectChange = ({ index }) => {
    index === 0 ? onCurrencyChange('stable') : onCurrencyChange('native');
    setCoin(index);
  };
  const [isMobile] = useMediaQuery(`(max-width: ${breakpoints.md})`);

  return (
    <ChartContainer
      isLimit={islimit}
      bg="bgBox"
      border="1px solid"
      borderColor="grayBorderBox"
      borderRadius="md"
      pt="spacing06"
      h={islimit ? '608px' : '630px'}
      px="spacing01"
    >
      <HStack
        w="full"
        justifyContent="space-between"
        px="spacing06"
        mb="spacing05"
      >
        <CardHeader id={CHART} title="Chart" hideQuestionIcon />
        <Select
          labels={['USD', 'WFTM']}
          selected={coin}
          onChange={onCoinpSelectChange}
        ></Select>
      </HStack>

      <Iframe
        title="chart"
        url={url}
        width="100%"
        height={!isMobile ? '600px' : '93%'}
        scrolling="no"
      />
    </ChartContainer>
  );
};
export default Chart;
