import { NumberStyled } from '../../styles';
import { useState, useEffect } from 'react';
import { calcTimeUntilNextBlock } from 'utils/data/inspirit';
import { HStack, Text, VStack } from '@chakra-ui/react';
import useMobile from 'utils/isMobile';
import moment from 'moment';
import { getDaysUntilFriday } from 'app/utils';

export default function Time({
  nextDistributionTimeStamp,
}: {
  nextDistributionTimeStamp: string;
}) {
  const today = moment().utc();

  const timeUntilFriday = getDaysUntilFriday(today);

  const [timeRemanining, setRemainingTime] = useState(
    calcTimeUntilNextBlock(timeUntilFriday.unix()),
  );

  const [splitTime, setSplitTime] = useState('00000000');
  const [greatestTimeInterval, setGreatestTimeInterval] = useState(0);
  const isMobile = useMobile();
  const labels = isMobile
    ? ['Days', 'Hours', 'Min', 'Sec']
    : ['Days', 'Hours', 'Minutes', 'Seconds'];

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calcTimeUntilNextBlock(timeUntilFriday.unix()));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let days = ('' + timeRemanining.days).padStart(2, '0');
    let hours = ('' + timeRemanining.hours).padStart(2, '0');
    let minutes = ('' + timeRemanining.minutes).padStart(2, '0');
    let seconds = ('' + timeRemanining.seconds).padStart(2, '0');

    // logic for green background of digit
    if (timeRemanining.minutes === 0) setGreatestTimeInterval(6);
    else if (timeRemanining.hours === 0) setGreatestTimeInterval(4);
    else if (timeRemanining.days === 0) setGreatestTimeInterval(2);
    else setGreatestTimeInterval(0);

    setSplitTime(days + hours + minutes + seconds);
  }, [timeRemanining]);

  return (
    <HStack spacing={0} w="full" mx="20px">
      {[...Array(4)].map((unit, index) => (
        <HStack
          key={`${index}-time-${unit}`}
          w="full"
          justify="center"
          align="center"
        >
          <VStack w="full">
            <HStack spacing={0} w="full">
              <NumberStyled
                key={`numberStyled_${index}`}
                isGreen={2 * index === greatestTimeInterval}
              >
                {splitTime[2 * index]}
              </NumberStyled>
              <NumberStyled
                key={`numberStyled_${index + 1}`}
                isGreen={2 * index === greatestTimeInterval}
              >
                {splitTime[2 * index + 1]}
              </NumberStyled>
            </HStack>
            <Text> {labels[index]}</Text>
          </VStack>
        </HStack>
      ))}
    </HStack>
  );
}
