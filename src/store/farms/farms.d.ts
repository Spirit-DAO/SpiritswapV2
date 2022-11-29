import { GaugeFarm } from 'app/interfaces/Farm';
import { FarmToken } from 'app/interfaces/General';

export type EcosystemValues = {
  token1: Token;
  token2: Token;
  emissionToken: Token;
  emissionAmount: BigNum;
  emissionRate: string;
  emissionSchedule: {
    value: number;
    index: number;
  };
  pairError: boolean;
  lpTokenAddress: string;
  ecosystemFarmAddress: string;
};

export interface InitialStateProps {
  ecosystemValues: EcosystemValues;
  farmTokens: FarmToken[];
  customFarmTokens: FarmToken[];
  ecosystemFarms: Farm[];
  farmMasterData: Farm[];
}
