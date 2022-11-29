import { HStack, Square, Text } from '@chakra-ui/react';
import { TFFailed, TFRefresh, TFSuccess, TFUpcoming } from 'app/assets/icons';
import { StyledLoadingIcon } from 'app/components/TransactionFlow/styles';
import { TransactionStatus } from 'app/components/TransactionFlow/TransactionFlow';
import { FC, useEffect, useState } from 'react';
import type { StepProps } from '../TransactionFlowV2.d';

const Step: FC<StepProps> = ({
  prevStep,
  index,
  onComplete,
  step,
  isFinish,
}) => {
  const { action, label, status } = step;
  const [txStatus, setTxStatus] = useState(
    isFinish ? TransactionStatus.SUCCESS : status,
  );
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

  const handleAction = async () => {
    try {
      setTxStatus(TransactionStatus.LOADING);
      await action();

      onComplete();
      setTxStatus(TransactionStatus.SUCCESS);
    } catch (error) {
      setTxStatus(TransactionStatus.FAILED);
    }
  };

  const onMouseRefresh = () => {
    if (txStatus === TransactionStatus.FAILED)
      setTxStatus(TransactionStatus.REFRESH);
  };
  const onMouseLeaveRefresh = () => {
    if (txStatus === TransactionStatus.REFRESH)
      setTxStatus(TransactionStatus.FAILED);
  };

  const handleRefresh = () => {
    if (txStatus === TransactionStatus.REFRESH) handleAction();
  };

  useEffect(() => {
    if ((prevStep === 0 && index === 1) || prevStep === index - 1) {
      if (txStatus === TransactionStatus.SUCCESS) {
        onComplete();
      } else {
        handleAction();
      }
    }
  }, [prevStep]);

  return (
    <HStack
      w="full"
      justify="space-between"
      fontSize="md"
      bg="bgBoxLighter"
      h="44px"
      p="spacing03"
      alignItems="center"
      cursor="pointer"
      borderRadius="8px"
      _hover={{ bg: 'ciTrans15' }}
      onMouseEnter={onMouseRefresh}
      onMouseLeave={onMouseLeaveRefresh}
      onClick={handleRefresh}
    >
      <HStack>
        <Square
          fontSize="xs"
          color="ci"
          bg="ciTrans15"
          size="18px"
          borderRadius="sm"
        >
          {index}
        </Square>
        <Text>{label}</Text>
      </HStack>
      {getStatusFromType(txStatus)}
    </HStack>
  );
};

export default Step;
