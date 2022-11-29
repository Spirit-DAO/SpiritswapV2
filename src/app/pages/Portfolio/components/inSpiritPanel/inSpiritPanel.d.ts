export interface GreeBoxProps {
  title: string;
  buttonTitle: string;
  navigateTo: string;
}

export interface TokenLabelProps {
  symbol: string;
  tokenBalance: number | string;
  tokenValue: number;
  spiritPrice: number;
  valueOnSpirit: boolean;
}

interface ValuesStatsProps {
  totalValue: number;
}

interface ClaimStateLabelProps {
  claimableState: string;
  claimableAmount?: string;
}

interface inSpiritData {
  userLockedAmount: number;
  inSpiritBalance: number;
  userClaimableAmount: number;
  userLockEndDate: number;
  nextDistribution: string;
  userLockedAmountValue: number;
}

interface inSpiritPanel {
  inSpiritData: inSpiritData;
  spiritData: TokenAmount | undefined;
}
