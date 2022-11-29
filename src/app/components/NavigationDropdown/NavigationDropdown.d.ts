export interface Props {
  items: { title: string; path: string; url?: string }[];
  onClickOutside: () => void;
  width: number | undefined;
}

export type DropdownMenuLink = {
  title: string;
  path: string;
  url?: string;
};
