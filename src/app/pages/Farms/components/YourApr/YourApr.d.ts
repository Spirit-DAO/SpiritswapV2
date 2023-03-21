import { EcosystemFarmType } from 'app/interfaces/Farm';

export interface Props {
  label?: string;
  value: string;
  ecosystem?: EcosystemFarmType;
  isBoosted: boolean;
  isMax: boolean;
  lpApr: string;
  staked: boolean;
  concentrated: boolean | undefined;
}
