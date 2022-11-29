export interface Props {
  network: NetworkSelectionProps;
  label: string;
  unselectableId: number;
  swapNetworks: () => void;
  updateSelectedNetworks: (
    label: string,
    network: NetworkSelectionProps,
  ) => void;
  top: string;
  showConfirmModal: boolean;
}
