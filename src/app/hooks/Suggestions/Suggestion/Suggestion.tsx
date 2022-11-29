import { useState, useEffect } from 'react';
import {
  VStack,
  Text,
  HStack,
  Flex,
  SimpleGrid,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { CloseIconButton } from 'app/assets/icons';
import { CircularProgress } from '@chakra-ui/react';
import { CloseBox } from './styles';
import { SuggestionsProps } from './index';
import { SuggestionIcon } from 'app/assets/icons';

const Suggestion = ({
  body,
  title,
  id,
  buttonsAmount,
  buttons,
  closeSuggestion,
}: SuggestionsProps) => {
  const duration = 10000;
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

  return (
    <VStack
      mr="10px"
      borderRadius="md"
      w="365px"
      spacing="0"
      id="suggestion_ID"
    >
      <Flex
        borderTopRadius="md"
        py="spacing03"
        px="spacing03"
        bg="successBg"
        w="full"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack>
          <SuggestionIcon />
          <Text color="white">{title ? title : 'Suggestion'}</Text>
        </HStack>

        <CloseBox onClick={() => closeSuggestion(id)}>
          <CircularProgress
            value={notificationProgress}
            size="24px"
            thickness="8px"
            color="white"
            trackColor="ciTrans15"
          >
            <CircularProgressLabel>
              <CloseIconButton top="0" right="8px" />
            </CircularProgressLabel>
          </CircularProgress>
        </CloseBox>
      </Flex>

      <VStack
        borderBottomRadius="md"
        py="spacing03"
        px="spacing03"
        bg="bgBoxDarker"
        w="full"
        align="stretch"
      >
        <Text>{body}</Text>
        <SimpleGrid spacing="4px" columns={buttonsAmount}>
          {buttons}
        </SimpleGrid>
      </VStack>
    </VStack>
  );
};

export default Suggestion;
