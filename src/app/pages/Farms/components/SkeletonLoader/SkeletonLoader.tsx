import { Skeleton, HStack } from '@chakra-ui/react';
import useMobile from 'utils/isMobile';

const SkeletonLoader = () => (
  <Skeleton
    startColor="#1F2937"
    endColor="#3B4452"
    opacity=".9"
    width="full"
    borderRadius="md"
    padding="0.75rem"
    display="flex"
    flexDirection="column"
    gap="0.5rem"
    height="227px"
  />
);

const SkeletonStack = () => {
  const isMobile = useMobile();

  const ResponsiveStack = isMobile ? (
    <HStack w="full" mt="1rem">
      <SkeletonLoader />
    </HStack>
  ) : (
    <HStack mt=".5rem">
      <SkeletonLoader />
      <SkeletonLoader />
      <SkeletonLoader />
    </HStack>
  );

  return <>{ResponsiveStack}</>;
};

export default SkeletonStack;
