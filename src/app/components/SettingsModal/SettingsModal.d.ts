export interface Props {
  selectedLanguageId: number | string;
  onClose: () => void;
  onSelectLanguage: (selectedId) => void;
}
