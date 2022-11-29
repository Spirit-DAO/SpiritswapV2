import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import autocolors from 'chartjs-plugin-autocolors';
import { StyledContainer } from './styles';

ChartJS.register(ArcElement, Tooltip, Legend, autocolors);

const PieChart = ({ data, options, ...rest }) => {
  return (
    <StyledContainer>
      <Pie data={data} options={options} {...rest} />
    </StyledContainer>
  );
};

export default PieChart;
