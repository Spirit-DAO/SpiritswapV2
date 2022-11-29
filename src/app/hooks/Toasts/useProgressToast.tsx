import Notifications from './Notifications/Notifications';
import { ToastId, useToast } from '@chakra-ui/react';
import { useProgressToastProps } from './Notifications';
import { NOTIFICATIONS_STATE } from 'constants/index';
import { useAppSelector } from 'store/hooks';
import { selectUserSettings } from 'store/settings/selectors';

export function useProgressToast() {
  const toast = useToast();
  const closeToast = (id: ToastId) => {
    toast.close(id);
  };
  const { notifications } = useAppSelector(selectUserSettings);
  const showToast = ({
    title,
    type,
    id,
    inputSymbol,
    uniqueMessage,
    outputSymbol,
    inputValue,
    outputValue,
    icon,
    duration = 10000,
    link,
  }: useProgressToastProps) => {
    const time = type === NOTIFICATIONS_STATE.PENDING ? null : duration;

    if (notifications && !toast.isActive(id)) {
      return toast({
        id: id,
        position: 'top-right',
        duration: time,
        render: () => (
          <Notifications
            title={title}
            id={id}
            uniqueMessage={uniqueMessage}
            link={link}
            type={type}
            closeNotification={closeToast}
            duration={duration}
            inputSymbol={inputSymbol}
            inputValue={inputValue}
            outputSymbol={outputSymbol}
            outputValue={outputValue}
            icon={icon}
          />
        ),
      });
    }
  };
  return { showToast, closeToast };
}
