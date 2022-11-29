import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function EcosystemFarmButton({ onCreateEcosystemFarm }) {
  const { t } = useTranslation();
  return (
    <Button onClick={onCreateEcosystemFarm}>
      {t('farms.ecosystem.create')}
    </Button>
  );
}
