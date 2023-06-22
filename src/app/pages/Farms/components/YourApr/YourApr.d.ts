import { EcosystemFarmType } from 'app/interfaces/Farm';

export interface Props {
  label?: string;
  value: string;
  ecosystem?: EcosystemFarmType;
  isBoosted: boolean;
  isExpanded?: boolean;
  farmUserData: {
    lpTokens: string;
    lpTokensMoney: string;
    spiritEarned: string;
    spiritEarnedMoney: string;
    currentBoost: string;
    spiritNeededForMax: string;
    yourAprValue: string;
  };
  isMax: boolean;
  lpApr: string;
  staked: boolean;
  concentrated: boolean | undefined;
}
