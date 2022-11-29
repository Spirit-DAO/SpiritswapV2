import type { FarmData } from './LiquidityPanel.d';

export interface Props {
  farmData: FarmData;
  options: { id: number | string; value: string; type: string }[];
  isV2?: boolean;
  isFarm: boolean;
  subindex: number;
  setMigrateIndex: (index: number) => void;
  setMigrateSubIndex: (index: number) => void;
  setOpen: (isOpen: boolean) => void;
}
