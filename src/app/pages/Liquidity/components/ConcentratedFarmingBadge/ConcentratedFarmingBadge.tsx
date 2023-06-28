import { Text } from '@chakra-ui/react';
import { StyledFarmingBadge } from './styled';

export const ConcentreatedFarmingBadge = () => {
  const badgeText = 'On Farming';

  return (
    <StyledFarmingBadge>
      <Text size="sm" ml={4}>
        {badgeText}
      </Text>
    </StyledFarmingBadge>
  );
};

export default ConcentreatedFarmingBadge;
