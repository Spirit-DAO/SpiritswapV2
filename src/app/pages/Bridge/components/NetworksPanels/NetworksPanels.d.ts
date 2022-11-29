import { SelectedNetworksProps } from 'app/interfaces/Bridge';

export interface Props {
  selectedNetworks: SelectedNetworksProps;
  labels: { from: string; to: string };
  handleSelectedNetworks: (
    label: string,
    network: NetworkSelectionProps,
  ) => void;
  swapNetworks: () => void;
  showConfirmModal: boolean;
}
