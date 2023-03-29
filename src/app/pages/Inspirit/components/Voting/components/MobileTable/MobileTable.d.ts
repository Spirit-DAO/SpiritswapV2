export interface MobileTableProps {
  uniqueFarm: any;
  showAll: boolean;
  filteredBribes: any;
  resetInputs: boolean;
  cleanError: any;
  onNewVote: (value: string, lpAddress: string) => void;
  labelData: {
    id: number;
    label: string;
    sortYpe: string;
    onSort: any;
  }[];
}
