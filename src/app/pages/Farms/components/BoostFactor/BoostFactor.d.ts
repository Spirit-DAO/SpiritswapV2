export interface DoughnutChartOptions {
  plugins?: {
    legend: {
      display: boolean;
    };
  };
  animation: {
    duration: number;
  };
  cutout?: number;
  maintainAspectRatio?: boolean;
}

export interface Props {
  currentBoost: string;
  holdAmountForMaxBoost: string;
  options?: DoughnutChartOptions;
  lpTokens: string;
}
