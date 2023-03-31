import { useTranslation } from 'react-i18next';
import { Modal } from 'app/components/Modal';
import { Button, Flex } from '@chakra-ui/react';
import { Props } from './SettingsModal.d';
import { BodyContainer, Label } from './styles';
import { openInNewTab } from 'app/utils/redirectTab';
import { Switch } from 'app/components/Switch';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectUserSettings } from 'store/settings/selectors';
import { setUserNotifications, setUserSuggestions } from 'store/settings';
import ODNP from '@open-defi-notification-protocol/widget';
import useWallets from 'app/hooks/useWallets';

const SettingsModal = ({
  selectedLanguageId,
  onClose,
  onSelectLanguage,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'common.settingsModal';
  const dispatch = useAppDispatch();
  const { notifications, suggestions } = useAppSelector(selectUserSettings);
  const { account } = useWallets();
  const handleToggleSuggestions = toggle => {
    dispatch(
      setUserSuggestions({
        suggestions: toggle,
      }),
    );
  };

  const handleToggleNotifications = toggle => {
    dispatch(setUserNotifications({ notifications: toggle }));
  };

  const handleOpenModal = () => {
    const odnp = new ODNP();
    odnp.init();
    odnp.show(account, 'spiritswap');
  };

  // const selectedLanguage = 'en';
  // const selectedLanguageObject = LanguageItems.find(
  //   item => item.id === selectedLanguage,
  // );

  return (
    <Modal title={t(`${translationPath}.title`)} onClose={onClose} {...props}>
      <BodyContainer>
        {/* <Flex w="full" justify="space-between" align="center">
          <Label>{t(`${translationPath}.language`)}</Label>
          <Flex justify="space-between" align="center">
            <ImageLogo
              symbol={selectedLanguageObject?.value}
              type={selectedLanguageObject?.type}
              margin="0"
              size={'20px'}
            />
            <StyledSelectWithDropdown
              items={LanguageItems}
              onSelect={onSelectLanguage}
              selectedId={i18n.language === 'en-US' ? 'en' : i18n.language}
            />
          </Flex> */}
        {/* </Flex> */}
        <Flex w="full" justify="space-between" align="center">
          <Label>{t(`${translationPath}.notifications`)}</Label>
          <Switch
            checked={notifications}
            onChange={() => handleToggleNotifications(!notifications)}
          />
        </Flex>
        <Flex w="full" justify="space-between" align="center">
          <Label>{t(`${translationPath}.pushNotifications`)}</Label>
          <Button onClick={handleOpenModal} bg="secondary" border={'none'}>
            Set up
          </Button>
        </Flex>
        <Flex w="full" justify="space-between" align="center">
          <Label>Suggestions</Label>
          <Switch
            checked={suggestions}
            onChange={() => handleToggleSuggestions(!suggestions)}
          />
        </Flex>
        <Button
          w="full"
          bg="grayBorderBox"
          h="28px"
          mt="spacing03"
          border="none"
          onClick={() => openInNewTab('https://app.spiritswap.finance/#/')}
        ></Button>
      </BodyContainer>
    </Modal>
  );
};

export default SettingsModal;
