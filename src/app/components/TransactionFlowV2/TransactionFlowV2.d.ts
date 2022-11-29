import { StepStateProps } from 'app/pages/Inspirit/components/Aside/components/GetInSpirit/GetInSpirit.d';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  steps: StepStateProps[];
}

export interface ContentProps extends Props {
  handleCancel: () => void;
  stepCompleted: number;
  onComplete: () => void;
  onFinish: () => void;
}

export interface StepProps {
  index: number;
  prevStep: number;
  onComplete: () => void;
  step: StepStateProps;
  isFinish: boolean;
}
