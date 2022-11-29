import { Flex } from '@chakra-ui/react';
import { Switch } from '../../../../../../components/Switch';
import useMobile from '../../../../../../../utils/isMobile';
import { useTranslation } from 'react-i18next';

const ToggleFilter = ({ toggleFarms, userFarmsOnly }) => {
  const isMobile = useMobile();
  const { t } = useTranslation();

  return (
    <Flex gap="1rem" flexDirection={!isMobile ? 'row' : 'column'}>
      <Switch
        label={t('inSpirit.voting.myFarms')}
        style={{ justifyContent: isMobile ? 'space-between' : '' }}
        onChange={toggleFarms}
        checked={userFarmsOnly}
      />
    </Flex>
  );
};

export default ToggleFilter;
