export interface Props {
  header: string;
  handleLiquiditySettings?: () => void;
  questionHelper?: {
    title: string;
    text: string;
    importantText?: string;
    showDocs?: boolean;
  };
}
