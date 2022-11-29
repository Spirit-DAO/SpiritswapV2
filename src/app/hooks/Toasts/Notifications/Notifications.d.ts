export interface useProgressToastProps {
  title: string;
  id: string;
  type: string;
  uniqueMessage?: { text: string; secondText?: string; uniqueIcon?: any };
  inputValue?: string;
  outputValue?: string;
  inputSymbol?: string;
  outputSymbol?: string;
  icon?: any;
  duration?: number;
  link?: string;
}

export interface NotificationsProps extends useProgressToastProps {
  closeNotification: (id) => void;
}
