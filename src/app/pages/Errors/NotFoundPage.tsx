import { useTranslation } from 'react-i18next';
import { PlaceholderScreen } from 'app/components/PlaceholderScreen';
import { ReactComponent as NotFound } from 'app/assets/errors/404.svg';
import { HOME } from 'app/router/routes';
import { useNavigate } from 'app/hooks/Routing';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const props = {
    Image: () => <NotFound />,
    title: 'Oh no!',
    text: t('common.errors.404.message'),
    buttons: [
      {
        type: 'primary',
        label: t('common.errors.404.buttons.back'),
        action: () => navigate(HOME.path),
      },
    ],
  };
  return <PlaceholderScreen {...props} />;
};

export default NotFoundPage;
