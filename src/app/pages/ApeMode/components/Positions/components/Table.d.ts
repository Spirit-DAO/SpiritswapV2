export interface Props {
  columns?: column[];
  variantTable: string;
  isMobile?: boolean;
}

export interface column {
  Header: string;
  accessor: string;
  isNumeric?: boolean;
}
