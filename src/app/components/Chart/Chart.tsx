import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as charts from 'react-chartjs-2';
import { Props } from './Chart.d';
import { Wrapper } from './styles';
import { chartOptions, dataOptions } from './ChartSetup';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
);

const Chart = ({
  type,
  durationLabels,
  data,
  customChartOptions = chartOptions,
  customChartDataset = dataOptions,
  ...props
}: Props) => {
  const dataOption = {
    ...customChartDataset[type],
    datasets: [
      {
        ...customChartDataset[type].datasets[0],
        data: data,
      },
    ],
    minBarLength: 2,
    labels: durationLabels,
  };

  const ChartComponent = charts[type];

  return (
    <Wrapper {...props}>
      <ChartComponent
        width="30%"
        options={customChartOptions}
        data={dataOption}
      />
    </Wrapper>
  );
};

export default Chart;
