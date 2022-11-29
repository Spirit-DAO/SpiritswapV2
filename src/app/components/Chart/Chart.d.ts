export interface Props {
  type: ChartStyles;
  durationLabels: string[];
  data: number[];
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
