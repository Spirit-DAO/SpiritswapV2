import {
  Button,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@chakra-ui/react';
import Step from '../Step';
import type { ContentProps } from '../TransactionFlowV2.d';

const ContentModal = ({
  title,
  description,
  steps,
  stepCompleted,
  handleCancel,
  onComplete,
  onFinish,
}: ContentProps) => {
  const isFinish: boolean = steps.length === stepCompleted;

  return (
    <>
      <ModalHeader mt="15px">
        <HStack>
          <Text fontWeight="500" fontSize="xl">
            {title}
          </Text>
        </HStack>
      </ModalHeader>
      <ModalCloseButton bg="secondary" fontSize="9px" mt="15px" mr="20px" />

      <ModalBody>
        <Text color="gray">{description}</Text>
        <VStack h="250px" overflow="scroll">
          {steps.map((step, i) => (
            <Step
              key={`${i}-step`}
              index={++i}
              prevStep={stepCompleted}
              onComplete={onComplete}
              step={step}
              isFinish={isFinish}
            />
          ))}
        </VStack>
      </ModalBody>

      <ModalFooter>
        <Button
          variant={isFinish ? 'inverted' : 'secondary'}
          w="full"
          fontSize="sm"
          onClick={isFinish ? onFinish : handleCancel}
        >
          {isFinish ? 'Finish' : 'Cancel process'}
        </Button>
      </ModalFooter>
    </>
  );
};

export default ContentModal;
