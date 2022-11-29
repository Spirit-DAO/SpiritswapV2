import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  useDisclosure,
  Text,
  Box,
  Heading,
  HStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { Props } from './QuestionHelper.d';
import { QuestionIcon } from 'app/assets/icons';
import { useTranslation } from 'react-i18next';
import useMobile from 'utils/isMobile';
import { SPIRIT_DOCS_URL } from 'constants/index';

const QuestionHelper: FC<Props> = ({
  size,
  title,
  text,
  importantText,
  showDocs,
  iconWidth = '20px',
  iconMargin = 'inherit',
}) => {
  const { t } = useTranslation();
  const translationPath = 'common.helperModal';
  const isMobile = useMobile();
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Modal
        variant="questionHelper"
        blockScrollOnMount={false}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent mx="spacing04" style={{ border: 'none' }}>
          <ModalHeader pt="spacing04" pl="spacing04">
            <QuestionIcon w="auto" h="22px" mr="spacing03" color="ci" />
            <Text fontWeight={500} data-testid="title">
              {title}
            </Text>
            <ModalCloseButton
              mr="0"
              p="spacing04"
              data-testid="close-modal-button"
            />
          </ModalHeader>

          <ModalBody pl="spacing04" pr="spacing04" data-testid="textContent">
            {Array.isArray(text) ? (
              text?.map(parragraph => (
                <Text lineHeight="spacing06" key={parragraph.substring(1, 5)}>
                  {parragraph}
                </Text>
              ))
            ) : (
              <Text>{text}</Text>
            )}

            {importantText && (
              <Box>
                <Heading
                  mt="spacing04"
                  mb="spacing02"
                  fontSize="base"
                  color="white"
                >
                  Important
                </Heading>
                <Text pr="spacing02">{importantText}</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter pl="spacing04" pr="spacing04">
            <HStack w={!showDocs || isMobile ? '100%' : 'auto'}>
              {showDocs && (
                <Button
                  as="a"
                  href={SPIRIT_DOCS_URL}
                  target="_blank"
                  w="auto"
                  variant="secondary"
                >
                  {t(`${translationPath}.readDocs`)}
                </Button>
              )}
              <Button
                onClick={onClose}
                w={!showDocs ? '100%' : 'auto'}
                variant="inverted"
              >
                {t(`${translationPath}.understood`)}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        data-testid="open-modal-button"
        border="none"
        minW="none"
        padding="0"
        bgColor="transparent"
        _active={{ border: 'none' }}
        onClick={onOpen}
        m={iconMargin}
        height="auto"
      >
        <QuestionIcon w={iconWidth} h={iconWidth} _hover={{ color: 'ci' }} />
      </Button>
    </>
  );
};

export default QuestionHelper;
