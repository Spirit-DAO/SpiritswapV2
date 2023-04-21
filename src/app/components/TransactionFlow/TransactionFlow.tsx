import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  HStack,
  Box,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import {
  TFStart,
  TFFailed,
  TFRefresh,
  TFSuccess,
  TFUpcoming,
} from 'app/assets/icons';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DetailBox, NumberBox, StyledLoadingIcon } from './styles';
import { TransactionFlowProps, StepProps } from './TransactionFlow.d';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';

export enum TransactionStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  LOADING = 'loading',
  UPCOMING = 'upcoming',
  REFRESH = 'refresh',
}

const getStatusFromType = (type: string) => {
  switch (type) {
    case TransactionStatus.SUCCESS:
      return <TFSuccess />;
    case TransactionStatus.FAILED:
      return <TFFailed />;
    case TransactionStatus.LOADING:
      return <StyledLoadingIcon />;
    case TransactionStatus.UPCOMING:
      return <TFUpcoming />;
    case TransactionStatus.REFRESH:
      return <TFRefresh />;
    default:
      return <TFSuccess />;
  }
};

export const TransactionFlow = ({
  heading,
  generalText,
  description,
  arrayOfSteps,
  handleFinish,
  onClose,
  isOpen,
  disabled,
  nextStep,
  stepsLeft,
  leftText,
  notifications,
}: TransactionFlowProps) => {
  const [submitted, setSubmitted] = useState<number[]>([]);
  const [cancelTransaction, setCancelTransaction] = useState<Boolean>(false);
  const translationPath = 'liquidity.common';
  const { t } = useTranslation();

  const [steps, setSteps] = useState<Array<StepProps>>(() => arrayOfSteps);
  const { addToQueue } = Web3Monitoring();

  useEffect(() => {
    setSteps(arrayOfSteps);
  }, [arrayOfSteps, steps]);

  const cancelProcess = useCallback(() => {
    setCancelTransaction(true);
    setSubmitted([]);
  }, []);

  const goBack = useCallback(() => {
    setCancelTransaction(false);
  }, []);

  const closeModal = useCallback(() => {
    setSteps([]);
    onClose();
    setCancelTransaction(false);
    setSubmitted([]);
  }, [onClose]);

  const onNext = useCallback(() => {
    setSteps([]);
    nextStep();
  }, [nextStep]);

  const allAproved = useCallback(() => {
    return steps?.every(step => step.status === TransactionStatus.SUCCESS);
  }, [steps]);

  useEffect(() => {
    const handleCheckFlow = async () => {
      steps?.forEach(async (step, index) => {
        if (
          step.status === TransactionStatus.UPCOMING &&
          (index === 0 ||
            steps[index - 1].status === TransactionStatus.SUCCESS) &&
          !submitted.includes(index)
        ) {
          const newSubmitted = [...submitted, index];
          setSubmitted(newSubmitted);
          if (step.action) {
            await step.fn({
              params: step.params,
              action: step.action,
              index,
              steps,
              setSteps,
              notifications,
              addToQueue,
            });
          } else {
            await step.fn({
              ...step.params,
              index,
              steps,
              setSteps,
              notifications,
              addToQueue,
            });
          }
        }
      });
    };

    if (isOpen) {
      handleCheckFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, notifications, steps]);

  const executeStep = useCallback(
    (step, index) => {
      if (step.action) {
        step.fn({
          params: step.params,
          action: step.action,
          index,
          steps,
          setSteps,
        });
      } else {
        step.fn({ ...step.params, index, steps, setSteps });
      }
    },
    [steps, setSteps],
  );

  const shouldSetRedo = useCallback(
    index => {
      if (steps[index].status === TransactionStatus.FAILED) {
        const newStep = [...steps];
        newStep[index].status = TransactionStatus.REFRESH;
        setSteps(newStep);
      }
    },
    [steps, setSteps],
  );

  const shoulSetFailed = useCallback(
    index => {
      if (steps[index].status === TransactionStatus.REFRESH) {
        const newStep = [...steps];
        newStep[index].status = TransactionStatus.FAILED;
        setSteps(newStep);
      }
    },
    [steps, setSteps],
  );

  const allApprovedR = allAproved();
  const showNext = stepsLeft ? allApprovedR && stepsLeft > 0 : false;
  const showFinish = stepsLeft ? allApprovedR && stepsLeft === 0 : allApprovedR;
  const showCancel = !allApprovedR;

  const renderCancelTransaction = () => {
    return (
      <>
        <Text fontSize="lg" fontWeight="600" m="15px 0px">
          {t(`${translationPath}.cancelTransactionProcess`)}
        </Text>

        <Text fontSize="md" fontWeight="400" color="gray">
          {t(`${translationPath}.confirmCancelTransactionProcess`)}
        </Text>

        <HStack mt="10px" mb="10px">
          <Button w="100%" onClick={goBack} variant="inverted">
            {t(`${translationPath}.goBack`)}
          </Button>
          <Button w="100%" onClick={closeModal} variant="secondary">
            {t(`${translationPath}.confirm`)}
          </Button>
        </HStack>
      </>
    );
  };

  const renderFlow = () => (
    <>
      <Text fontWeight="500" fontSize="xl" m="15px 0px">
        {heading}
      </Text>
      {description ? <Text color="gray">{description}</Text> : null}
      <Text fontSize="md" mt="spacing04" color="gray">
        {generalText}
      </Text>
      {steps.length > 0 && stepsLeft ? (
        <Flex
          fontSize="md"
          w="100%"
          m="4px 0px"
          bg="ciTrans15"
          h="44px"
          p="spacing03"
          alignItems="center"
          borderRadius="8px"
        >
          <TFStart mr="spacing03" />
          {`${stepsLeft} ${leftText}`}
        </Flex>
      ) : null}
      <Box mt="spacing02">
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <DetailBox
              key={`${step.number}-${index}`}
              step={step}
              onClick={() => {
                if (step.status === TransactionStatus.REFRESH) {
                  executeStep(step, index);
                }
              }}
              _hover={
                step.status === TransactionStatus.REFRESH
                  ? {
                      bg: 'ciTrans15',
                      cursor: 'pointer',
                    }
                  : {}
              }
              onMouseOver={() => shouldSetRedo(index)}
              onMouseOut={() => shoulSetFailed(index)}
            >
              <HStack justifyContent="space-between">
                <HStack>
                  <NumberBox>
                    <Text fontSize="sm" color="ci" fontWeight="400">
                      {index + 1}
                    </Text>
                  </NumberBox>
                  <Text>{step.title}</Text>
                </HStack>
                <Box justifyContent="flex-end">
                  {getStatusFromType(step.status)}
                </Box>
              </HStack>
            </DetailBox>
          ))
        ) : (
          <HStack w="full">
            <Skeleton
              startColor="ciTrans15"
              width="full"
              borderRadius="md"
              padding="0.75rem"
              border="grayBorderToggle"
              bg="bgBox"
              display="flex"
              flexDirection="column"
              gap="0.5rem"
              height="227px"
            />
          </HStack>
        )}
      </Box>
      {showNext ? (
        <Button
          onClick={onNext}
          variant="inverted"
          w="100%"
          m="10px 0px"
          disabled={disabled}
        >
          Next
        </Button>
      ) : null}
      {showFinish ? (
        <Button
          onClick={handleFinish}
          variant="inverted"
          w="100%"
          m="10px 0px"
          disabled={disabled}
        >
          Finish
        </Button>
      ) : null}
      {showCancel ? (
        <Button
          onClick={cancelProcess}
          variant="secondary"
          w="100%"
          m="10px 0px"
        >
          Cancel process
        </Button>
      ) : null}
    </>
  );

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={cancelProcess}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="bgBoxDarker">
          {!cancelTransaction ? (
            <ModalCloseButton
              bg="secondary"
              fontSize="9px"
              mr="12px"
              mt="16px"
            />
          ) : null}

          <ModalBody>
            {cancelTransaction ? renderCancelTransaction() : renderFlow()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
