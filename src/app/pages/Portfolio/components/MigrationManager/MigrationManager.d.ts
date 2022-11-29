import type { FarmData } from './LiquidityPanel.d';

export interface Props {
  farmDataArray: FarmData[];
  isFarm: boolean;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}
