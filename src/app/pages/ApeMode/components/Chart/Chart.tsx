import React, { useState } from 'react';
import Iframe from 'react-iframe';
import { Select } from 'app/components/Select';
import { CardHeader } from 'app/components/CardHeader';
import { useMediaQuery, VStack, HStack } from '@chakra-ui/react';
import { breakpoints } from 'theme/base/breakpoints';
import { CHART } from 'constants/icons';

const Chart = ({ ...props }) => {
  const chartUrl = `https://kek.tools/t/0x5Cc61A78F164885776AA610fb0FE1257df78E59B/chart?pair=0x30748322b6e34545dbe0788c421886aeb5297789&exchange=spiritswap&accent=101726&background=101726&theme=dark&fallback=0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83`;
  const [coin, setCoin] = useState(0);
  const onCoinpSelectChange = ({ index }) => setCoin(index);
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.xs})`);
  return (
    <VStack
      bg="bgBox"
      border="1px solid"
      borderColor="grayBorderBox"
      borderRadius="md"
      w="full"
      h="657px"
      pt="spacing06"
      px="spacing01"
    >
      <HStack
        w="full"
        justifyContent="space-between"
        px="spacing06"
        mb="spacing055"
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
        url={chartUrl}
        width="100%"
        height={!isMobile ? '600px' : '93%'}
        scrolling="no"
      />
    </VStack>
  );
};
export default Chart;
