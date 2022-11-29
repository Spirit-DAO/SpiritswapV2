import { Box, HStack, Button, Text, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FarmController } from '../../FarmController';
import BackButton from '../BackButton';
import SkeletonStack from '../SkeletonLoader';

function FarmItems({
  address,
  handleBackToFarms,
  handleResetFilters,
  userLiquidity,
  farms,
  farmFilters,
  isLoading,
  onOpen,
}) {
  const { t } = useTranslation();

  return (
    <Box>
      {!isLoading ? (
        <Box mt={'spacing05'}>
          {address && (
            <BackButton
              handleBackToFarms={handleBackToFarms}
              text={t('farms.backToAllFarms')}
            />
          )}
          {farms?.length === 0 ? (
            <HStack
              fontSize="sm"
              bg="bgBoxLighter"
              py="16px"
              placeContent="center"
            >
              <Text>No farms found</Text>
              {farmFilters.staked || farmFilters.inactive ? (
                <Button size="sm" variant="bgBox" onClick={handleResetFilters}>
                  Clear filters
                </Button>
              ) : null}
            </HStack>
          ) : (
            <>
              <SimpleGrid columns={[1, 1, 1, 1, 2, 2, 3]} gap="0.5rem">
                {farms?.map((farm, index) => {
                  return (
                    farm &&
                    farm.valid && (
                      <FarmController
                        key={`farm-${farm.title}-${farm.lpAddress}-${farm.label}-${index}`}
                        onOpen={onOpen}
                        farm={{ ...farm, wallet: userLiquidity }}
                      />
                    )
                  );
                })}
              </SimpleGrid>
            </>
          )}
        </Box>
      ) : (
        <SkeletonStack />
      )}
    </Box>
  );
}

export default FarmItems;
