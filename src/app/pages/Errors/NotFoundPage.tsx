import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlaceholderScreen } from 'app/components/PlaceholderScreen';
import { ReactComponent as NotFound } from 'app/assets/errors/404.svg';

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
        action: () => navigate('/home'),
      },
    ],
  };
  return <PlaceholderScreen {...props} />;
};

export default NotFoundPage;
