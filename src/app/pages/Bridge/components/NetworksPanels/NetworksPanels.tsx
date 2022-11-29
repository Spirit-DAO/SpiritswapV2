import { Stack } from '@chakra-ui/react';
import { SwapIconButton } from 'app/assets/icons';
import useMobile from 'utils/isMobile';
import { NetworksDropdown } from '../NetworksDropdown';
import { Props } from './NetworksPanels.d';

const NetworksPanels = ({
  selectedNetworks,
  labels,
  handleSelectedNetworks,
  swapNetworks,
  showConfirmModal,
}: Props) => {
  const isMobile = useMobile();
  const { From, To } = selectedNetworks;

  return (
    <Stack direction={{ base: 'column', md: 'row' }} align="center">
      <NetworksDropdown
        network={From}
        unselectableId={To.id}
        label={labels.from}
        updateSelectedNetworks={handleSelectedNetworks}
        swapNetworks={swapNetworks}
        top="150px"
        showConfirmModal={showConfirmModal}
      />
      <SwapIconButton
        m="auto 8px"
        onClick={swapNetworks}
        showConfirmModal={showConfirmModal}
      />
      <NetworksDropdown
        network={To}
        label={labels.to}
        unselectableId={From.id}
        updateSelectedNetworks={handleSelectedNetworks}
        swapNetworks={swapNetworks}
        top={isMobile ? '280px' : '150px'}
        showConfirmModal={showConfirmModal}
      />
    </Stack>
  );
};

export default NetworksPanels;
