import { Box, Button } from '@chakra-ui/react';
import { truncateTokenValue } from 'app/utils';
import { useTranslation } from 'react-i18next';
import {
  StyledRewardsWrapper,
  StyledRewardsSubtitle,
  StyledH2Heading,
} from '../../styles';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectFarmRewards } from 'store/user/selectors';
import useAllHarvest from 'app/hooks/useAllHarvest';
import { NOTIFICATIONS_STATE } from 'constants/index';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { useProgressToast } from 'app/hooks/Toasts/useProgressToast';
import { Props } from './FarmRewards.d';
import useWallets from 'app/hooks/useWallets';
import { setFarmRewards } from 'store/user';

const translationPath = 'farms.common';

export const FarmRewards = ({ rewards, spiritPrice }: Props) => {
  const { t } = useTranslation();
  const { isLoggedIn } = useWallets();
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const { showToast } = useProgressToast();
  const dispatch = useAppDispatch();
  const farmsWithRewards = useAppSelector(selectFarmRewards);
  const notificationsTranslationsPath = 'notifications.farm.claim';

  const getDataToClaimRewards = () => {
    if (!farmsWithRewards) {
      return {
        farmsPidV1: [],
        farmsGaugeAddressesV2: [null],
      };
    }
    const farmsPidV1: number[] = farmsWithRewards
      .filter(farm => +farm.earned > 0)
      .filter(farm => !farm.gaugeAddress)
      .map(farm => farm.pid);
    const farmsGaugeAddressesV2: (string | undefined)[] = farmsWithRewards
      .filter(farm => +farm.earned > 0)
      .filter(farm => farm.gaugeAddress)
      .map(farm => farm.gaugeAddress);

    return { farmsPidV1, farmsGaugeAddressesV2 };
  };

  const { farmsPidV1, farmsGaugeAddressesV2 } = getDataToClaimRewards();

  const claimRewardsCallback = useAllHarvest(farmsPidV1, farmsGaugeAddressesV2);

  const claimRewards = async () => {
    try {
      loadingOn();
      const response = await claimRewardsCallback();
      showToast({
        id: `${response.length ?? 0}-claimingRewards`,
        type: NOTIFICATIONS_STATE.SUCCESS,
        title: t(`${notificationsTranslationsPath}.title`),
        uniqueMessage: {
          text: t(`${notificationsTranslationsPath}.success`),
        },
      });
      dispatch(setFarmRewards([]));
      loadingOff();
    } catch (error) {
      loadingOff();
    }
  };

  const isDisabled = () =>
    !isLoggedIn || !(farmsPidV1.length || farmsGaugeAddressesV2.length);

  return (
    <StyledRewardsWrapper>
      <Box>
        <StyledRewardsSubtitle>
          {t(`${translationPath}.farmRewards`)}
        </StyledRewardsSubtitle>
        <StyledH2Heading level={2}>
          {truncateTokenValue(Number(rewards) * spiritPrice, spiritPrice, '$')}
        </StyledH2Heading>
      </Box>
      <Box>
        <Button
          variant="inverted"
          isLoading={isLoading}
          isDisabled={isDisabled()}
          onClick={claimRewards}
        >
          {t(`${translationPath}.claimAllRewards`)}
        </Button>
      </Box>
    </StyledRewardsWrapper>
  );
};
