import { ChartBox, ChartContainer } from './styles';

interface Props {
  url: string;
  islimit: boolean;
}

const Chart = ({ url, islimit }: Props) => {
  return (
    <ChartContainer
      isLimit={islimit}
      bg="bgBox"
      border="1px solid"
      borderColor="grayBorderBox"
      borderRadius="md"
      h={islimit ? '608px' : '665px'}
    >
      <ChartBox id="dexscreener-embed">
        <iframe title="Chart" src={url} />
      </ChartBox>
    </ChartContainer>
  );
};
export default Chart;
