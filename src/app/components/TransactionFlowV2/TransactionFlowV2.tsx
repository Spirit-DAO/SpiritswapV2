import { FC, useState } from 'react';
import type { Props } from './TransactionFlowV2.d';
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import TransactionCancel from '../TransactionCancel/TransactionCancel';
import ContentModal from './ContentModal';

const TransactionFlowV2: FC<Props> = ({
  isOpen,
  onClose,
  title,
  description,
  steps,
}) => {
  const [cancelIsOpen, setCancelIsOpen] = useState(false);
  const [stepCompleted, setStepCompleted] = useState<number>(0);

  const onComplete = () => {
    setStepCompleted(prevState => ++prevState);
  };

  const handleCancel = () => {
    setCancelIsOpen(prev => !prev);
  };

  const handleClose = () => {
    if (cancelIsOpen) {
      setCancelIsOpen(false);
      onClose();
    } else {
      handleCancel();
    }
  };

  const handleFinish = () => {
    setStepCompleted(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      closeOnOverlayClick={false}
      blockScrollOnMount={false}
      onClose={handleClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg="bgBoxDarker">
        {cancelIsOpen ? (
          <TransactionCancel
            onClose={handleClose}
            handleCancel={handleCancel}
          />
        ) : (
          <ContentModal
            description={description}
            isOpen={isOpen}
            handleCancel={handleCancel}
            title={title}
            onClose={handleClose}
            steps={steps}
            stepCompleted={stepCompleted}
            onComplete={onComplete}
            onFinish={handleFinish}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default TransactionFlowV2;
