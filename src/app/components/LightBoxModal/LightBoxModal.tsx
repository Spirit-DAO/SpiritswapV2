import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  Button,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  Image,
  Text,
  HStack,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { InfoGraphics } from 'app/utils';
import { CloseIconButton } from 'app/assets/icons';
import { ArrowRightIcon, ArrowLeftIcon } from 'app/assets/icons';
import useMobile from 'utils/isMobile';

const LightBoxModal = ({ id, width, variant }) => {
  const isMobile = useMobile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const [idNumber, setIdNumber] = useState<number>(1);
  const [isLastImg, setisLastImg] = useState<boolean>(false);
  const translationPath = 'home.common';
  const pathImages = useMemo(() => InfoGraphics[id], [id]);

  const pathImg = `images/infographics/${pathImages[idNumber - 1]}.png`;

  const pathsLength = InfoGraphics[id].length;
  const checkIfLastImage = useCallback(() => {
    return idNumber === pathsLength;
  }, [idNumber, pathsLength]);

  const handleClose = () => {
    onClose();
    setIdNumber(1);
    setisLastImg(checkIfLastImage());
  };

  const changeImg = (direction, i) => {
    if (direction === 'next') {
      setIdNumber(prevState => prevState + 1);
    }
    if (direction === 'back') {
      setIdNumber(prevState => prevState - 1);
    }
  };

  useEffect(() => {
    setisLastImg(checkIfLastImage());
  }, [checkIfLastImage, idNumber, pathsLength]);

  return (
    <>
      <Button variant={variant} onClick={onOpen} width={width}>
        {t(`${translationPath}.learnMore`)}
      </Button>

      <Modal
        onClose={handleClose}
        isOpen={isOpen}
        isCentered
        blockScrollOnMount={false}
        motionPreset="slideInBottom"
        closeOnOverlayClick={true}
      >
        <ModalOverlay backdropFilter="blur(16px)" backdropBlur="16px" />

        <ModalContent
          bg="transparent"
          border="none"
          boxShadow="none"
          mt="0"
          mb="0"
          padding="0"
          maxW="unset"
          minW={isMobile ? 'auto' : 'min(80vh, 1080px)'}
          w="fit-content"
        >
          <ModalBody padding="0" mb="0" mt="0" marginInline="auto">
            <Box
              w={isMobile ? 'auto' : 'clamp(700px,80vh,100vw)'}
              h={isMobile ? 'auto' : 'clamp(400px,80vh,90vh)'}
              maxW={'unset'}
              marginInline="auto"
            >
              <Image
                borderRadius="8px"
                src={pathImg}
                h="100%"
                marginX="auto"
                objectFit="contain"
                ignoreFallback
              />
            </Box>
          </ModalBody>
          <ModalFooter marginInline="auto" mt="0" mb="0" pb="0" pt="spacing05">
            <HStack padding="4px" bg="bgInput" borderRadius="md">
              {idNumber === 1 ? (
                <CloseIconButton
                  onClick={handleClose}
                  as={CloseIconButton}
                  color="white"
                  bg="grayBorderBox"
                  w="40px"
                  h="40px"
                />
              ) : (
                <Button
                  variant="inverted"
                  w="40px"
                  h="40px"
                  onClick={() => changeImg('back', idNumber)}
                >
                  <ArrowLeftIcon />
                </Button>
              )}
              <Text fontSize="lg" fontWeight="bold">
                {idNumber} / {pathsLength}
              </Text>
              {isLastImg ? (
                <CloseIconButton
                  color="white"
                  w="40px"
                  h="40px"
                  bg="grayBorderBox"
                  onClick={handleClose}
                />
              ) : (
                <Button
                  w="40px"
                  h="40px"
                  variant="inverted"
                  onClick={() => changeImg('next', idNumber)}
                >
                  <ArrowRightIcon />
                </Button>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default LightBoxModal;
