import { FarmRewardInfo } from 'utils/data';

export type Props = {
  farmsWithRewards: FarmRewardInfo[];
  isOpen: boolean;
  onClose: () => void;
};
