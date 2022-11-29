export interface Props {
  totalInSpiritSupply?: string;
  circulatingSpirit?: string;
  averagePeg?: string | number;
  projects?: number;
  tokenDistribution?: Token[];
  isLoadingData?: boolean;
  pegChartData?: HistoricalPegProps;
}

export interface Token {
  name: string;
  distribution: string;
  color: string;
  project: string;
}

export interface WinSpiritPegDetails {
  datapointAt: string;
  fromToken: string;
  pegPercentage: string;
}
