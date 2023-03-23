import { Box, HStack, Skeleton, Stack, Text, useRadio } from '@chakra-ui/react';
import { usePositionData } from 'app/hooks/v3/usePositionData';
import { ConcentratedRangeBadge } from 'app/pages/Liquidity/components/ConcentratedRangeBadge';
import { truncateTokenValue } from 'app/utils';
import { StyledContainer } from './styles';

export default function ConcentratedPositionsPanelItem({
  position,
  radio,
}: {
  position: any;
  radio: any;
}) {
  const { getInputProps, getCheckboxProps } = useRadio(radio);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const { usdAmount, outOfRange } = usePositionData(position);

  return (
    <Box as="label">
      <input {...input} />
      <StyledContainer
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        _checked={{
          color: 'white',
          borderColor: 'ci',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
      >
        <HStack pl={4}>
          <Text mr={4}>{`Position #${position.tokenId}`}</Text>
          <Box>
            <ConcentratedRangeBadge inRange={!outOfRange} />
          </Box>
        </HStack>

        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          h="24px"
          mr={4}
          w={usdAmount !== undefined ? 'unset' : '40px'}
          isLoaded={usdAmount !== undefined}
        >
          ${truncateTokenValue(usdAmount)}
        </Skeleton>
      </StyledContainer>
    </Box>
  );
}
