export interface Props {
  positionDetails: PositionPool;
  options: { id: number | string; value: string; type: string }[];
  handleConcentratedPositionTotalValue: (value: number) => void;
}
