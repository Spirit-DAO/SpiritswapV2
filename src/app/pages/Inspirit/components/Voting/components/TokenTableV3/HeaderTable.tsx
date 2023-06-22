import { Heading } from '../../../../../../components/Typography';
import { useTranslation } from 'react-i18next';
import useMobile from '../../../../../../../utils/isMobile';
import { StyledIconToInput } from '../../../../../../pages/Farms/styles';
import { Button, Flex, HStack } from '@chakra-ui/react';
import ToggleFilter from './ToggleFilter';
import { Switch } from '../../../../../../components/Switch';

const HeaderTable = ({
  toggleUserFarm,
  userFarmsOnly,
  toggleMobileTableFilters,
  onFarmSearch,
  farmsSize,
  showAll,
  toggleShow,
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
            <Flex gap={4}>
              <Switch
                label="All Farms"
                checked={showAll}
                onClick={toggleShow}
              />
              <Button
                variant="secondary"
                size="small"
                padding="7px 12px"
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
