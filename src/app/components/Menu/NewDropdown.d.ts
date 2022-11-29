export interface Props {
  items: {
    id: number | string;
    value: string;
    type: string;
    onSelect?: Function;
  }[];
  address: string;
  onSelect?: (selectedId) => void;
  migrateItem?: () => void;
}
