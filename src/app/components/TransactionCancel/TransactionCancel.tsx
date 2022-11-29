import { FC } from 'react';
import type { Props } from './TransactionCancel.d';
import {
  Button,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import { QuestionIcon } from 'app/assets/icons';

const TransactionCancel: FC<Props> = ({ onClose, handleCancel }) => {
  return (
    <>
      <ModalHeader mt="15px">
        <HStack>
          <Text fontWeight="500" fontSize="xl">
            Cancel transaction process
          </Text>
          <QuestionIcon />
        </HStack>
      </ModalHeader>
      <ModalCloseButton bg="secondary" fontSize="9px" mt="15px" mr="20px" />

      <ModalBody>
        <Text color="gray">
          Are you sure you want to abort the current transaction process?
        </Text>
      </ModalBody>

      <ModalFooter>
        <HStack w="full" justify="center">
          <Button
            variant="inverted"
            w="full"
            fontSize="sm"
            onClick={handleCancel}
          >
            Go back
          </Button>
          <Button variant="secondary" w="full" fontSize="sm" onClick={onClose}>
            Confirm
          </Button>
        </HStack>
      </ModalFooter>
    </>
  );
};

export default TransactionCancel;
