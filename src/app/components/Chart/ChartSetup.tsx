export const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
    },
    tooltip: {
      backgroundColor: '#101726',
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';

          if (label) {
            label += ': ≈ ';
          }

          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumSignificantDigits: 3,
            }).format(context.parsed.y);
          }
          return label;
        },
        title: function (context) {
          const title = context[0].label;

          if (title === '-') {
            return '';
          }
          return title;
        },
      },
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: false,
        },
        speed: 100,
      },
      pan: {
        enabled: false,
        speed: 100,
      },
    },
  },
  scales: {
    x: {
      offset: true,
      ticks: {
        font: {
          family: 'Jost',
          size: 12,
        },
        color: '#D1D5DB',
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      ticks: {
        display: false,
      },

      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
};

export const dataOptions = {
  Pie: {},
  Bar: {
    datasets: [
      {
        label: '',
        borderColor: '#0086ff',
        backgroundColor: '#0086ff',
        borderRadius: 4,
        minBarLength: 10,
      },
    ],
  },
  Line: {
    datasets: [
      {
        label: 'Tokens value',
        tension: 0.4,
        borderColor: '#0086ff',
        backgroundColor: '#0086ff',
        pointRadius: 3,
      },
    ],
  },
};
