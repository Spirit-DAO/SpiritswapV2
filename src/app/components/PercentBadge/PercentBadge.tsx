import { useState, useEffect, useMemo, ReactNode } from 'react';
import { Sign } from 'app/utils';
import { ReactComponent as ChevronUp } from 'app/assets/images/chevron-up.svg';
import { ReactComponent as ChevronDown } from 'app/assets/images/chevron-down.svg';
import { ReactComponent as ChevronSide } from 'app/assets/images/chevron-side.svg';
import { Icon } from '../Icon';
import type { Props } from './PercentBadge.d';
import { StyledContainer } from './styles';

const PercentBadge = ({ amount, sign, showIcon = true, ...props }: Props) => {
  const [icon, setIcon] = useState<ReactNode | undefined>();

  const signIcons = useMemo(() => {
    return {
      [Sign.POSITIVE]: <ChevronUp />,
      [Sign.NEGATIVE]: <ChevronDown />,
      [Sign.NEUTRAL]: <ChevronSide />,
    };
  }, []);

  useEffect(() => {
    const signValue = sign.toString();
    const icon = signIcons[signValue];
    setIcon(icon);
  }, [sign, signIcons]);

  if (typeof amount === 'number') {
    amount = amount.toFixed(2);
  }

  return (
    <StyledContainer sign={sign} amount={amount} {...props}>
      {showIcon && icon && <Icon icon={icon} size={16} />}
      <span>{amount}</span>
      <span>%</span>
    </StyledContainer>
  );
};

export default PercentBadge;
