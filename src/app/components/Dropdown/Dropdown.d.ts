export interface Props {
  items: {
    id: number | string;
    value: string;
    type: string;
    onSelect?: Function;
  }[];
  selectedId: number | string;
  tokenAddress?: string;
  onClickOutside: () => void;
  unselectableId?: number;
  onSelect?: (selectedId) => void;
  swapNetworks?: () => void;
}

export interface ButtonProps {
  isSelected: boolean;
}
