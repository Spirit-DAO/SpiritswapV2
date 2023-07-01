import { Flex, Button, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Select } from 'app/components/Select';
import useMobile from 'utils/isMobile';
import {
  StyledFarmsControls,
  StyledDropdown,
  StyledIconToInput,
} from '../../styles';
import { StyledSwitch } from './styles';

export default function FarmControls({
  farmFilters,
  selectedTab,
  onFarmTabChange,
  showFilters,
  setFarmFilters,
  account,
  setShowFilters,
  dropdownSortOptions,
  sortType,
  setSortType,
  debouncedResults,
}) {
  const { t } = useTranslation();
  const isMobile = useMobile();

  return (
    <StyledFarmsControls>
      <Select
        selected={selectedTab}
        labels={['All', 'Tradicional', 'Concentrated']}
        onChange={onFarmTabChange}
      />

      <Flex
        gap=".5em"
        direction={{ base: 'column-reverse', md: 'row' }}
        marginLeft={'0.8rem'}
      >
        {(!isMobile || showFilters) && (
          <Flex
            gap="0.75em"
            direction={{ base: 'column', md: 'row' }}
            my={{ base: '0.75em', md: '0' }}
          >
            {account && (
              <StyledSwitch
                label={t('farms.filter.staked')}
                justify={{ base: 'space-between', md: 'initial' }}
                onChange={() =>
                  setFarmFilters({
                    ...farmFilters,
                    staked: !farmFilters.staked,
                  })
                }
                checked={farmFilters.staked}
              />
            )}
            <StyledSwitch
              label={t('farms.filter.inactive')}
              justify={{ base: 'space-between', md: 'initial' }}
              onChange={() =>
                setFarmFilters({
                  ...farmFilters,
                  inactive: !farmFilters.inactive,
                })
              }
              checked={farmFilters.inactive}
            />
          </Flex>
        )}
        <HStack>
          <HStack>
            {isMobile && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {t(`farms.filter.${!showFilters ? 'show' : 'hide'}`)}
              </Button>
            )}
            <StyledDropdown
              icon={false}
              onSelect={id => setSortType(id)}
              items={dropdownSortOptions}
              selectedId={sortType}
              label={t('farms.sort.label')}
            />
          </HStack>
          <StyledIconToInput onChange={debouncedResults} iconPos="right" />
        </HStack>
      </Flex>
    </StyledFarmsControls>
  );
}
