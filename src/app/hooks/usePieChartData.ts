import { BoostedFarm } from 'app/interfaces/Inspirit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const colorChannelMixer = (
  colorChannelA: number,
  colorChannelB: number,
  amountToMix: number,
) => {
  const channelA = colorChannelA * amountToMix;
  const channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
};
const colorMixer = (rgbA, rgbB, amountToMix, symbol) => {
  const colorA = rgbA ? rgbA : [23, 173, 99];
  const colorB = rgbB ? rgbB : [223, 73, 129];
  const customAmount = symbol === 'WFTM' ? 2 : amountToMix;
  const r = colorChannelMixer(colorA[0], colorB[0], customAmount);
  const g = colorChannelMixer(colorA[1], colorB[1], customAmount);
  const b = colorChannelMixer(colorA[2], colorB[2], customAmount);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

const TOKENS_COLORS = {
  USDC: [247, 147, 26],
  SPIRIT: [147, 47, 126],
  fUSDT: [60, 60, 61],
  MIM: [111, 139, 150],
  DAI: [255, 255, 255],
  FRAX: [127, 17, 224],
  miMATIC: [251, 231, 185],
  WFTM: [255, 215, 0],
  BTC: [80, 231, 185],
  ETH: [251, 80, 185],
  LQDR: [75, 10, 230],
  BIFI: [123, 104, 238],
  SUSHI: [76, 0, 19],
  DEUS: [255, 99, 71],
};

const pieChartOptions = {
  plugins: {
    legend: {
      display: false,
    },
    autocolors: {
      mode: 'data',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = `${context.label}: `;
          const value = `${context.parsed}%`;
          return `${label}${value}`;
        },
      },
    },
  },
};

const usePieChartData = ({ farmsList }: { farmsList: BoostedFarm[] }) => {
  const { t } = useTranslation();
  const translationPath = 'inSpirit.voting';

  const pieChartData = useMemo(() => {
    const data: number[] = [];
    const labels: string[] = [];
    const othersVotes = {
      name: t(`${translationPath}.others`),
      value: 0,
      color: 'rgb(47, 92, 69)',
    };
    for (let i = 0; i < farmsList.length; i++) {
      const { name, userVotes } = farmsList[i];
      const value = +`${userVotes}`.replace('%', '');
      const lpSymbol = `${name.replace(' ', '-')} LP`;
      if (value > 1) {
        data.push(value);
        labels.push(lpSymbol);
      } else {
        othersVotes.value = othersVotes.value + value;
      }
    }

    return {
      labels,
      datasets: [
        {
          data,
          borderColor: ['white'],
          borderWidth: 1,
          hoverBorderWidth: 2,
          hoverBorderColor: ['#424348'],
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmsList]);

  return {
    pieChartData,
    pieChartOptions,
  };
};

export default usePieChartData;
