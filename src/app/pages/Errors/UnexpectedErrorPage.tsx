import { useTranslation } from 'react-i18next';
import { ReactComponent as UnexpectedError } from 'app/assets/errors/500.svg';
import PlaceholderScreen from 'app/components/PlaceholderScreen/PlaceholderScreen';
import { useAppDispatch } from 'store/hooks';
import { setUnexpectedError } from 'store/errors';
import { HOME } from 'app/router/routes';
import { useNavigate } from 'app/hooks/Routing';

const UnexpectedErrorPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const props = {
    Image: () => <UnexpectedError />,
    title: 'Oh no!',
    text: t('common.errors.500.message'),
    buttons: [
      {
        type: 'primary',
        label: t('common.errors.500.buttons.retry'),
        action: () => window.location.reload(),
      },
      {
        type: 'secondary',
        label: t('common.errors.500.buttons.back'),
        action: () => {
          dispatch(setUnexpectedError(false));
          navigate(HOME.path);
        },
      },
    ],
  };

  dispatch(setUnexpectedError(true));
  return <PlaceholderScreen {...props} />;
};

export default UnexpectedErrorPage;
