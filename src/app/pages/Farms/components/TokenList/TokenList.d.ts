import { TokenIcon } from 'app/components/TokenIcon';
import { EcosystemFarmType } from 'app/interfaces/Farm';

export interface Props {
  tokens: TokenIcon[];
  boosted: boolean;
  title: string;
  ecosystem?: EcosystemFarmType;
  hideTypeTitle?: boolean;
  hideTypeIcons?: boolean;
  invertTitleOrder?: boolean;
  titleSmall?: boolean;
  apr?: string | number;
  rewardToken?: string;
  type?: string;
  farmType?: string;
  lpAddress?: string;
}
