import { HStack, Icon, Text } from '@chakra-ui/react';
import { ClaimStateLabelProps } from '..';
import { ReactComponent as SparklesSvg } from 'app/assets/images/sparkles.svg';

const ClaimStateLabel = ({
  claimableState,
  claimableAmount,
}: ClaimStateLabelProps) => {
  return (
    <HStack
      bg="ciTrans15"
      w="full"
      spacing="auto"
      p="spacing03"
      borderRadius="8px"
      h="40px"
    >
      <Text>{claimableState}</Text>

      {claimableAmount && (
        <Text>
          {claimableAmount}
          <Icon
            w="1.25rem"
            h="1.25rem"
            as={SparklesSvg}
            color="ci"
            ml="spacing02"
            mb="spacing02"
          />
        </Text>
      )}
    </HStack>
  );
};

export default ClaimStateLabel;
