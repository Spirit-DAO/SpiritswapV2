import React, { useState } from 'react';
import { HStack, VStack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Trading } from './components/TradingApe';
import { Leverage } from './components/Leverage';
import { SettingsInfo } from './components/SettingsInfo';
import InfoCard from './components/InfoCard/InfoCard';
import { CardHeader } from 'app/components/CardHeader';
import { ConfirmLong } from './components/ConfirmLong';
import { ConnectWallet } from './styles';
import { ChartIconButton } from 'app/assets/icons';
import { APE } from 'constants/icons';
import { SettingsPanel } from 'app/components/SettingsPanel';
import { SettingsIconButton } from 'app/assets/icons';

export const ApeCard = ({ setChartMode, chartMode }) => {
  const { t } = useTranslation();
  const translationPath = 'apeMode.common';
  const [isDisplaySetting, setIsDisplaySetting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const hideSettings = () => setIsDisplaySetting(false);
  const onSettingClick = () => setIsDisplaySetting(true);
  const hideConfirmation = () => setIsConfirmed(false);
  const [isWalletConnected, setIsWalletConnected] = React.useState(false);
  const toggleWalletConnected = () => setIsWalletConnected(!isWalletConnected);
  const toggleConfirmation = () => setIsConfirmed(!isConfirmed);
  const chartModeToggle = () => setChartMode(!chartMode);
  const translationPathHelper = 'apeMode.helperModal';

  const labels = ['0.1%', '0.5%', '1%', 'Auto'];

  return (
    <Box minH="620x" maxW="455px">
      {!isConfirmed ? (
        !isDisplaySetting ? (
          <VStack>
            <VStack
              bg="bgBox"
              border="1px solid"
              borderColor="grayBorderBox"
              borderRadius="md"
              w="full"
              py="spacing06"
              px="spacing06"
            >
              <HStack w="full" justifyContent="space-between" pb="spacing05">
                <CardHeader
                  id={APE}
                  title="Ape Mode"
                  helperContent={{
                    title: 'Ape Mode',
                    text: t(`${translationPathHelper}.apeModeExplanation`),
                    showDocs: true,
                  }}
                />
                <HStack>
                  <ChartIconButton onClick={chartModeToggle} />
                  <SettingsIconButton onClick={onSettingClick} />
                </HStack>
              </HStack>
              <Trading />
              <Leverage
                title={t(
                  `${translationPath}.adjustLeverage`,
                  'Adjust Leverage',
                )}
              />
              <HStack w="full" spacing="spacing02" mb="spacing05">
                <InfoCard
                  value="816.39"
                  currency="WFTM"
                  title={t(
                    `${translationPath}.positionSizeLabel`,
                    'Position size',
                  )}
                />
                <InfoCard
                  isLiquidation
                  value="1.05"
                  title={t(
                    `${translationPath}.liquidationLabel`,
                    'Liquidation price',
                  )}
                />
              </HStack>
              {isWalletConnected ? (
                <ConnectWallet onClick={toggleConfirmation}>
                  Ape Long
                </ConnectWallet>
              ) : (
                <ConnectWallet onClick={toggleWalletConnected}>
                  {t(`${translationPath}.connect`, 'Connect Wallet')}
                </ConnectWallet>
              )}
            </VStack>
            <SettingsInfo
              helperContent={{
                title: 'Slippage Tolerance',
                text: t(`${translationPathHelper}.apeModeExplanation`),
                showDocs: true,
              }}
            />
          </VStack>
        ) : (
          <SettingsPanel
            labels={labels}
            selected={0}
            timer={20}
            custom={''}
            backAction={hideSettings}
            translationsPath={'swap.settings'}
          />
        )
      ) : (
        <ConfirmLong
          hideConfirmation={hideConfirmation}
          token="FTM"
          value="1.0"
        />
      )}
    </Box>
  );
};

export default ApeCard;
