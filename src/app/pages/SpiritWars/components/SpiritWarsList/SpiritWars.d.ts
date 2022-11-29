export interface SpiritWarProps {
  tokens: Token[];
  isLoadingData: boolean;
}

export type Token = {
  projectLink: string;
  color: string;
  tokenAddress: string;
  tokenName: string;
  projectName: string;
  inSpiritHoldings: string;
  inSpiritHoldingPercent: string;
  inSpiritHolderAddress: string;
  pegFor100k: string;
};

export type ICollapseDetail = {
  title: string;
  text: string;
  type?: string;
  showArrow: boolean;
};
