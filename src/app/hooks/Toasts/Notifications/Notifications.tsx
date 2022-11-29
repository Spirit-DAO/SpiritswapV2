import { useState, useEffect } from 'react';
import { NotificationsProps } from '.';
import {
  VStack,
  Text,
  HStack,
  Spinner,
  Flex,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { ErrorIcon, SuccessIcon } from 'app/assets/icons';
import { CloseIconButton, LinkIcon } from 'app/assets/icons';
import { NOTIFICATIONS_STATE } from 'constants/index';
import { openInNewTab } from 'app/utils/redirectTab';
import { CircularProgress } from '@chakra-ui/react';

const IconHeader = ({ type }) => {
  switch (type) {
    case NOTIFICATIONS_STATE.PENDING:
      return <Spinner size="sm" color="warning" speed="1s" />;
    case NOTIFICATIONS_STATE.ERROR:
      return <ErrorIcon />;
    default:
      return <SuccessIcon />;
  }
};
const Notifications = ({
  title,
  type,
  duration = 10000,
  closeNotification,
  id,
  uniqueMessage,
  inputValue,
  outputValue,
  inputSymbol,
  outputSymbol,
  icon,
  link,
}: NotificationsProps) => {
  const mountTimeStamp = Date.now();
  const [notificationProgress, setNotificationProgress] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationProgress(
        Math.max(100 - ((Date.now() - mountTimeStamp) / duration) * 100, 0),
      );
    }, 100);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = (bgHeader: string, colorLoader: string) => {
    return {
      bgHeader: bgHeader,
      colorLoader: colorLoader,
    };
  };

  const colorNotifications = () => {
    switch (type) {
      case NOTIFICATIONS_STATE.PENDING:
        return options('pendingBg', 'yellow');
      case NOTIFICATIONS_STATE.ERROR:
        return options('errorBg', 'red');
      default:
        return options('successBg', 'teal');
    }
  };

  const colorProgress = () => {
    switch (type) {
      case NOTIFICATIONS_STATE.ERROR:
        return 'errorNotification';
      default:
        return 'defaultNotification';
    }
  };

  const generateTextForBridge = (text, icon) => {
    const [firstToken, secondToken] = text.split(' ');
    return (
      <>
        <Text fontSize="14px" color="white" fontWeight="bold">
          {firstToken}
        </Text>
        {icon}
        <Text fontSize="14px" color="white" fontWeight="bold">
          {secondToken}
        </Text>
      </>
    );
  };
  const scheme = colorNotifications();

  return (
    <VStack mr="10px" borderRadius="md" w="365px" spacing="0">
      <Flex
        borderTopRadius="md"
        py="spacing02"
        px="spacing03"
        bg={scheme.bgHeader}
        w="full"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack>
          <IconHeader type={type} />
          <Text color="white"> {title} </Text>
        </HStack>

        <Flex onClick={() => closeNotification(id)}>
          {type !== NOTIFICATIONS_STATE.PENDING && (
            <CircularProgress
              value={notificationProgress}
              size="24px"
              thickness="6px"
              color="white"
              trackColor={colorProgress()}
            >
              <CircularProgressLabel>
                <CloseIconButton top="0" right="8px" />
              </CircularProgressLabel>
            </CircularProgress>
          )}
        </Flex>
      </Flex>

      <HStack
        borderBottomRadius="md"
        py="spacing02"
        px="spacing03"
        pr="spacing04"
        bg="bgBoxDarker"
        w="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack>
          {inputSymbol ? (
            <>
              <Text color="grayDarker"> {inputValue} </Text>
              <Text color="white" fontWeight="bold">
                {inputSymbol}
              </Text>
              <>{icon && icon}</>
              {outputSymbol ? (
                <>
                  <Text color="grayDarker"> {outputValue} </Text>
                  <Text color="white" fontWeight="bold">
                    {outputSymbol}
                  </Text>
                </>
              ) : null}
            </>
          ) : null}
          {uniqueMessage?.text ? (
            <>
              <Text fontSize="14px" fontWeight="500" color="grayDarker">
                {uniqueMessage.text}
              </Text>
              {uniqueMessage.uniqueIcon ? (
                generateTextForBridge(
                  uniqueMessage.secondText,
                  uniqueMessage.uniqueIcon,
                )
              ) : (
                <Text fontSize="14px" color="white" fontWeight="bold">
                  {uniqueMessage.secondText}
                </Text>
              )}
            </>
          ) : null}
        </HStack>
        {link ? (
          <LinkIcon
            w="20px"
            h="20px"
            _hover={{
              cursor: 'pointer',
            }}
            color="white"
            onClick={() => openInNewTab(link)}
          />
        ) : null}
      </HStack>
    </VStack>
  );
};

export default Notifications;
