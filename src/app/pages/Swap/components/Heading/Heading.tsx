import { ReactComponent as SettingSwap } from 'app/assets/images/settings.svg';
import { ReactComponent as BusinessProductIcon } from 'app/assets/images/business-product.svg';
import { HStack } from '@chakra-ui/react';
import { CardHeader } from 'app/components/CardHeader';
import { StyledIcon } from '../../styles';

import { SWAP } from 'constants/icons';

export default function Heading({ toggleSettings, helperModal, toggleChart }) {
  return (
    <HStack justifyContent="space-between" mb="15px">
      <CardHeader
        id={SWAP}
        title="Swap"
        helperContent={{
          title: helperModal.title,
          text: helperModal.text,
          showDocs: true,
        }}
      />

      <HStack>
        <StyledIcon
          onClick={toggleSettings}
          size="sm"
          as={SettingSwap}
          aria-label="settings"
        />
        <StyledIcon
          onClick={toggleChart}
          size="sm"
          as={BusinessProductIcon}
          aria-label="business"
        />
      </HStack>
    </HStack>
  );
}
