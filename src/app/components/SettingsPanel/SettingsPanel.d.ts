export interface Props {
  labels: (string | number)[];
  selected: number;
  timer: number;
  custom: string;
  translationsPath: string;
  backAction?: () => void;
}
