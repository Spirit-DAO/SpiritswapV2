import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, Flex } from '@chakra-ui/react';
import {
  StatusBarInner,
  StatusBarPercent,
  StatusBarValue,
  StatusBarWrapper,
} from './styled';

const StatusBar = ({
  sellToken,
  buyToken,
  remainedSellToken,
  remainedBuyToken,
  completedPercent,
  isCompleted,
  isClosed,
}) => {
  return (
    <Box>
      <Box>
        {isCompleted ? (
          <Flex display={'inline-flex'} alignItems={'center'} w={'100%'}>
            {!isClosed ? (
              <Box mr={2}>
                <CheckCircleIcon />
              </Box>
            ) : null}
            <span>{isClosed ? `Order Cancelled` : `Order Completed`}</span>
            {!isClosed ? (
              <StatusBarPercent isCompleted={true}>100%</StatusBarPercent>
            ) : null}
          </Flex>
        ) : (
          <Flex alignItems={'center'} justifyContent={'space-between'}>
            <Flex mr={3} title={`${remainedSellToken} ${sellToken?.symbol}`}>
              <StatusBarValue>{remainedSellToken}</StatusBarValue>
              <span>{`${sellToken?.symbol}`}</span>
            </Flex>
            <StatusBarPercent
              isCompleted={false}
            >{`${completedPercent}%`}</StatusBarPercent>
            <Flex ml={3} title={`${remainedBuyToken} ${buyToken?.symbol}`}>
              <StatusBarValue>{remainedBuyToken}</StatusBarValue>
              <span>{`${buyToken?.symbol}`}</span>
            </Flex>
          </Flex>
        )}
      </Box>
      {!isClosed ? (
        <StatusBarWrapper>
          <StatusBarInner
            isCompleted={isCompleted}
            completedPercent={completedPercent}
          ></StatusBarInner>
        </StatusBarWrapper>
      ) : null}
    </Box>
  );
};

export default StatusBar;
