import { Line } from 'react-chartjs-2';
import {
  ArcElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
} from 'chart.js';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  HistoricalPegProps,
  initialPegChartProps,
} from 'utils/data/spiritwars';
import { addressToToken } from '../../spiritWarsHelpers';
import moment from 'moment';

const plugin = {
  id: 'corsair',
  afterInit: chart => {
    chart.corsair = {
      x: 0,
      y: 0,
    };
  },
  afterEvent: (chart, evt) => {
    const {
      chartArea: { top, bottom, left, right },
    } = chart;
    const { x, y } = evt.event;
    // check if cursor is in chart area
    if (x < left || x > right || y < top || y > bottom) {
      chart.corsair = {
        x,
        y,
        draw: false,
      };
      chart.draw(); // draw datasets without corsair
      return;
    }
    // enable draw when cursor in chart area
    chart.corsair = {
      x,
      y,
      draw: true,
    };

    chart.draw();
  },
  afterDatasetsDraw: (chart, _, opts) => {
    const {
      ctx,
      chartArea: { top, bottom, left, right },
    } = chart;
    const { x, y, draw } = chart?.corsair;

    if (!draw) {
      return;
    }
    //get line settings from options
    ctx.lineWidth = opts.width || 0;
    ctx.setLineDash(opts.dash || []);
    ctx.strokeStyle = opts.color || 'black';
    //set values
    ctx.save();
    ctx.beginPath();
    // draw vertical line
    if (opts.vertical) {
      ctx.moveTo(x, bottom);
      ctx.lineTo(x, top);
    }
    // draw horizontal line
    if (opts.horizontal) {
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
    }
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  plugin,
  zoomPlugin,
);

const PegChart = ({ pegData }) => {
  const [points, setPoints] =
    useState<HistoricalPegProps>(initialPegChartProps);

  useEffect(() => {
    const points = {};
    for (const key in addressToToken) {
      points[key] = [];
    }

    if (pegData) {
      for (const tokenAddress in pegData) {
        const dataPointsArray = pegData[tokenAddress];
        dataPointsArray.forEach(dataPoint => {
          points[tokenAddress].push({
            x: dataPoint.datapointAt,
            y: dataPoint.pegPercentage,
          });
        });
      }
    }

    let obj = _.mapKeys(points, function (_, key) {
      return addressToToken[key];
    });
    setPoints(obj);
  }, [pegData]);

  const getbgColor = label => {
    switch (label) {
      case 'Liquid driver':
        return 'rgb(120, 216, 245)';
      case 'Grim':
        return 'rgb(193, 24, 40)';
      case 'Scarab':
        return 'rgb(239, 207, 131)';
      case 'Ola':
        return 'rgb(244, 182, 127)';
      case 'Tarot':
        return 'yellow';
      case 'Millenium Club':
        return 'white';
      case 'Beefy':
        return 'rgb(90, 143, 105)';

      default:
        break;
    }
  };
  const lineChartData = {
    labels: _.flatten(
      Object.entries(points)?.map((val: any) => {
        return val[1]?.map(d => moment(d.x));
      }),
    ),
    datasets: Object.entries(points)?.map((val: any) => {
      return {
        label: val[0],
        data: val[1]?.map(d => (d?.y * 100).toFixed(2)),
        fill: true,
        backgroundColor: getbgColor(val[0]),
        borderColor: getbgColor(val[0]),
      };
    }),
  };

  const chartOptions: any = {
    plugins: {
      corsair: {
        horizontal: true,
        vertical: true,
        color: 'green',
        dash: [1, 2],
        width: 2,
      },
      tooltip: {
        callbacks: {
          title: function ([context]) {
            return moment(context.label || '').format('MMM DD - HH:mm');
          },
          label: function (context) {
            const value = context.formattedValue || '';
            const name = context.dataset.label || '';

            return `${name}: ${parseFloat(
              value.replace(',', '.').replace(' ', ''),
            )}%`;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          mode: 'xy',
          speed: 100,
        },
        pan: {
          enabled: true,
          mode: 'xy',
          speed: 100,
        },
      },
      legend: { position: false },
    },
    pointRadius: 1,
    pointHoverRadius: 1,
    scales: {
      x: {
        type: 'time',
        grid: {
          color: 'white',
          lineWidth: 0.2,
        },
      },
      y: {
        max: 100,
        min: 0,
        ticks: {
          callback: function (value) {
            const fixedValue = value.toFixed(1);

            return `${fixedValue} %`;
          },
        },
        grid: {
          color: 'white',
          lineWidth: 0.2,
        },
      },
    },
    normalized: true,
    spanGaps: true,
    animation: {
      duration: 0, // general animation time
    },
    hover: {
      animationDuration: 0, // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0, // animation duration after a resize
    elements: {
      point: {
        radius: 0, // default to disabled in all datasets
      },
      line: {
        tension: 0, // disables bezier curves
      },
    },
  };
  return <Line data={lineChartData} options={chartOptions} />;
};

export default PegChart;
