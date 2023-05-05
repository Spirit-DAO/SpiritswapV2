import { Text } from '@chakra-ui/react';
import { Props } from './ConcentratedRangeBadge.d';
import { StyledRangeBadge } from './styled';

export const ConcentreatedRangeBadge = ({ inRange, isRemoved }: Props) => {
  const badgeText = isRemoved
    ? 'Closed'
    : inRange
    ? 'In Range'
    : 'Out of range';

  return (
    <StyledRangeBadge inRange={inRange} isRemoved={isRemoved}>
      <Text size="sm" ml={4}>
        {badgeText}
      </Text>
    </StyledRangeBadge>
  );
};

export default ConcentreatedRangeBadge;
