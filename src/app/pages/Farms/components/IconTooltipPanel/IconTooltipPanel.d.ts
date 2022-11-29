export interface StyledProps {}

export interface ItemProps {
  label: string;
  value: number | string;
  tooltip?: string;
  icon?: Icon;
}

export interface Props {
  items: ItemProps[];
  staked: boolean;
}
