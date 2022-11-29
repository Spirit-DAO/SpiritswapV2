import { useRef } from 'react';
import { StatisticsToken } from './index';
import { ArcElement, Tooltip, Chart as ChartJS } from 'chart.js';
import { Box, Text } from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
ChartJS.register(ArcElement, Tooltip);

interface Props {
  tokens?: StatisticsToken[];
}
const DistributionChart = ({ tokens }: Props) => {
  const translationPath = 'spiritWars';
  const { t } = useTranslation();
  const doughnutChartData = {
    labels: tokens?.map(({ project }) => project) || [],
    datasets: [
      {
        data: tokens?.map(({ distribution }) => Number(distribution)),
        backgroundColor: tokens?.map(({ color }) => color),
      },
    ],
  };
  const textRef = useRef<any>(null);

  const options: any = {
    plugins: {
      tooltip: {
        enabled: false,
        external: function ({ tooltip }) {
          const label = tooltip.dataPoints[0].label;
          const value = tooltip.dataPoints[0].parsed;

          textRef.current.innerText = `${label}${'\n'}${(value * 100).toFixed(
            2,
          )}%`;
        },
      },
      legend: { display: false },
      labels: {
        render: 'percentage',
        precision: 2,
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    cutout: 100,
  };

  return (
    <Box width="250px" height="250px" marginInline="auto" pos="relative">
      <Text
        ref={textRef}
        fontSize="20px"
        fontWeight={500}
        lineHeight="24px"
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%,-50%)"
        textAlign="center"
      >
        {t(`${translationPath}.chartTitle`)}
      </Text>
      <Doughnut
        data={doughnutChartData}
        options={options}
        id="chartjs-tooltip"
      />
    </Box>
  );
};
export default DistributionChart;
