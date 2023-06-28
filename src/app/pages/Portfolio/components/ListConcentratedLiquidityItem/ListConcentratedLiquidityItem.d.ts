export interface Props {
  positionDetails: PositionPool;
  options: { id: number | string; value: string; type: string }[];
  handleConcentratedPositionTotalValue: ({
    tokenId,
    value,
  }: {
    tokenId: number;
    value: number;
  }) => void;
}
