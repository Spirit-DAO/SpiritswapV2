import { Text } from '@chakra-ui/react';
import { Props } from './ConcentratedRangeBadge.d';
import { StyledRangeBadge } from './styled';

export const ConcentratedRangeBadge = ({
  inRange,
  isRemoved,
  isFullRange,
}: Props) => {
  const badgeText = isRemoved
    ? 'Closed'
    : inRange
    ? isFullRange
      ? 'Full range'
      : 'In Range'
    : 'Out of range';

  return (
    <StyledRangeBadge inRange={inRange} isRemoved={isRemoved}>
      <Text size="sm" ml={4}>
        {badgeText}
      </Text>
    </StyledRangeBadge>
  );
};

export default ConcentratedRangeBadge;
