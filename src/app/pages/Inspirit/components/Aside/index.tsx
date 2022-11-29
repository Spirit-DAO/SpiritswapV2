import useWallets from 'app/hooks/useWallets';
import { useState } from 'react';
import { StyledPanel } from '../../styles';
import { GetInSpirit } from './components/GetInSpirit';
import { Help } from './components/Help';

export default function Aside({ spiritLocked }: { spiritLocked: boolean }) {
  const [showHelp, setShowHelp] = useState(spiritLocked);
  const { isLoggedIn, login } = useWallets();

  const handleGenerateInspirit = () => {
    login();
    setShowHelp(false);
  };

  return (
    <StyledPanel>
      {showHelp || !isLoggedIn ? (
        <Help onGenerate={handleGenerateInspirit} />
      ) : (
        <GetInSpirit />
      )}
    </StyledPanel>
  );
}
