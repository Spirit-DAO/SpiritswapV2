import { Text } from '@chakra-ui/react';
import { Props } from './ConcentratedRangeBadge.d';
import { StyledRangeBadge } from './styled';

export const ConcentreatedRangeBadge = ({ inRange }: Props) => {
  const badgeText = inRange ? 'In Range' : 'Out of range';

  return (
    <StyledRangeBadge inRange={inRange}>
      <Text size="sm" ml={4}>
        {badgeText}
      </Text>
    </StyledRangeBadge>
  );
};

export default ConcentreatedRangeBadge;
