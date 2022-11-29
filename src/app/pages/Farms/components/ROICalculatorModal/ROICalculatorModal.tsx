import { CloseIcon } from '@chakra-ui/icons';
import {
  Flex,
  Input,
  Select,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { CardHeader } from 'app/components/CardHeader';
import { CALCULATOR } from 'constants/icons';
import { IconButton } from '@chakra-ui/react';
import styled from 'styled-components';
import { useROICalculator } from '../../hooks/useROICalculator';
import { useTranslation } from 'react-i18next';
import useMobile from 'utils/isMobile';

const StyledOption = styled.option`
  font-size: ${({ theme }) => theme.fontSize.sm};
  background-color: ${({ theme }) => theme.color.bgDark} !important;
  color: ${({ theme }) => theme.color.while};
`;

export const TIME_FRAMES = [
  {
    text: '1 Year',
    value: 365,
  },
  {
    text: '6 Months',
    value: 180,
  },
  {
    text: '1 Month',
    value: 30,
  },
  {
    text: '1 Week',
    value: 7,
  },
  {
    text: '1 Day',
    value: 1,
  },
];

export const ROICalculatorModal = ({
  farmName,
  apr,
  isOpen,
  onOpen,
  onClose,
  rewardTokenSymbol = 'SPIRIT',
  ...props
}) => {
  const { onAmountChange, onTimeFrameChange, roi, roiUSDValue, roiPercent } =
    useROICalculator({ apr, rewardTokenSymbol, isOpen });

  const { t } = useTranslation();
  const translationRoot = `farms.roiCalculator`;
  const isMobile = useMobile();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      {...props}
      isCentered
      size={isMobile ? 'xs' : 'md'}
    >
      <ModalOverlay />
      <ModalContent p="spacing.04">
        {/* Header */}
        <Flex
          p={{ base: 'spacing03', md: 'spacing06' }}
          pl="spacing05"
          alignItems="center"
          justifyContent="space-between"
        >
          <CardHeader title="ROI Calculator" id={CALCULATOR} hideQuestionIcon />
          <IconButton
            size="xs"
            height="2rem"
            width="2rem"
            bg="grayBorderBox"
            border="0"
            _active={{
              border: 'none',
            }}
            aria-label={'Close'}
            icon={<CloseIcon />}
            onClick={onClose}
          />
        </Flex>
        {/* Form controls */}
        <Flex
          p={{ base: 'spacing03', md: 'spacing06' }}
          flexDirection="column"
          gap="spacing04"
        >
          {/* Input */}
          <div>
            <Text as="label" htmlFor="amount" color="gray">
              {t(`${translationRoot}.amount`)}
            </Text>
            <Flex
              gap="spacing04"
              bg="grayBorderToggle"
              pr="spacing04"
              borderRadius="md"
              border="1px solid"
              borderColor="grayBorderBox"
              alignItems="center"
              justifyContent="space-between"
              mt="spacing02"
            >
              <Input
                autoFocus
                id="amount"
                fontSize="base"
                placeholder="Enter LP token amount"
                width="auto"
                onChange={onAmountChange}
                outline="none"
                border="none"
                type="number"
                min={0}
              />
              <Flex alignItems="center" w="auto">
                <Text color="grayDarker">{farmName}</Text>
              </Flex>
            </Flex>
          </div>

          {/* Select */}
          <div>
            <Text as="label" htmlFor="amount" color="gray">
              {t(`${translationRoot}.timeFrame`)}
            </Text>
            <Select
              textAlign="center"
              bg="grayBorderBox"
              border="none"
              fontSize="sm"
              mt="spacing02"
              variant="outline"
              onChange={onTimeFrameChange}
            >
              {TIME_FRAMES.map(item => (
                <StyledOption key={item.value} value={item.value}>
                  {item.text}
                </StyledOption>
              ))}
            </Select>
          </div>

          {/* Rewards */}
          <Flex
            px="spacing03"
            py="spacing02"
            flexDirection="column"
            bg="grayBorderToggle"
            borderRadius="md"
          >
            <Text color="gray" fontSize="sm">
              {t(`${translationRoot}.estimatedRewards`)}
            </Text>
            <Text color="white" fontSize="base">
              {roi} {rewardTokenSymbol}
            </Text>
            <Text color="grayDarker" fontSize="sm">
              ≈ ${roiUSDValue} / {roiPercent}%
            </Text>
          </Flex>
        </Flex>
        {/* Legend bottom */}
        <Flex px={{ base: 'spacing03', md: 'spacing06' }} pb="spacing06">
          <Text color="gray" fontSize="sm">
            {t(`${translationRoot}.legend`)}
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
