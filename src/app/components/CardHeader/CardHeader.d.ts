export interface Props {
  title: string;
  id: string;
  hidebackground?: boolean;
  onIconClick?: () => void;
  hideQuestionIcon?: boolean;
  helperContent?: {
    title: string;
    text: string | string[];
    importantText?: string;
    showDocs?: boolean;
  };
  props?: string;
  showIcon?: boolean;
}
