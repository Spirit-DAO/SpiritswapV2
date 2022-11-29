import { FC } from 'react';
import { Heading } from 'app/components/Typography';
import { Button } from 'app/components/Button';
import {
  WalletPanelWrapper,
  WalletPanelTitle,
  WalletPanelBottomWrapper,
} from './styles';

interface WalletPanelProps {
  title: string;
  amount: string;
  buttonTitle: string;
  onButtonClick: () => void;
}

const WalletPanel: FC<WalletPanelProps> = ({
  title,
  amount,
  buttonTitle,
  onButtonClick,
}) => {
  return (
    <WalletPanelWrapper>
      <WalletPanelTitle level={5}>{title}</WalletPanelTitle>
      <WalletPanelBottomWrapper>
        <Heading level={1}>{`$${amount}`}</Heading>
        <Button variant="inverted" onClick={onButtonClick}>
          {buttonTitle}
        </Button>
      </WalletPanelBottomWrapper>
    </WalletPanelWrapper>
  );
};

export default WalletPanel;
