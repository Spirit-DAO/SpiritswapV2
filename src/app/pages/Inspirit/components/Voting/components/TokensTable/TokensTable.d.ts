export interface TokensTableRow {
  tokens: string[];
  liquidity: number | string;
  globalVoting: {
    percent: number | string;
    total: number | string;
  };
  yourVote: number | string;
  newResult: number | string;
  changePercent: {
    sign: number;
    value: number | string;
  };
  fulldata?: any;
}
