import { Heading } from '../../../../../../components/Typography';
import { useTranslation } from 'react-i18next';
import useMobile from '../../../../../../../utils/isMobile';
import { StyledIconToInput } from '../../../../../../pages/Farms/styles';
import { Button, Flex, HStack } from '@chakra-ui/react';
import ToggleFilter from './ToggleFilter';

const HeaderTable = ({
  toggleUserFarm,
  userFarmsOnly,
  toggleMobileTableFilters,
  onFarmSearch,
  farmsSize,
}) => {
  const isMobile = useMobile();
  const { t } = useTranslation();

  const translationPath = 'inSpirit.voting';

  return (
    <HStack w="full" justify={isMobile ? 'flex-end' : 'space-between'}>
      {isMobile ? null : (
        <div>
          <Heading level={4}>{t(`${translationPath}.votingPanel`)}</Heading>
          <Heading level={5}>
            {farmsSize} {t(`${translationPath}.farms`)}
          </Heading>
        </div>
      )}
      <Flex gap=".5rem" alignItems="center">
        <div>
          {isMobile ? (
            <Flex>
              <Button
                variant="secondary"
                size="small"
                onClick={toggleMobileTableFilters}
              >
                Filters
              </Button>
            </Flex>
          ) : (
            <ToggleFilter
              toggleFarms={toggleUserFarm}
              userFarmsOnly={userFarmsOnly}
            />
          )}
        </div>
        <div>
          <StyledIconToInput onChange={onFarmSearch} />
        </div>
      </Flex>
    </HStack>
  );
};

export default HeaderTable;
