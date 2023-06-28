export interface Props {
  type: ChartStyles;
  durationLabels: string[];
  data: number[];
  customChartOptions?: any;
  customChartDataset?: any;
}

export type ChartStyles =
  | 'Pie'
  | 'Bar'
  | 'Line'
  | 'Radar'
  | 'Doughnut'
  | 'PolarArea'
  | 'Bubble'
  | 'Scatter';
