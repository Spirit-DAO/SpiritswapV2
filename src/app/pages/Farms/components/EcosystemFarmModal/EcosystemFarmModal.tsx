import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Button as ChakraButton,
  Flex,
} from '@chakra-ui/react';
import { ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Requirements } from './Steps/Requirements';
import { TokensInLP } from './Steps/TokensInLP';
import { EmissionSettings } from './Steps/EmissionSettings';
import { Review } from './Steps/Review';
import { spacing } from 'theme/base/spacing';
import { CardHeader } from 'app/components/CardHeader';
import { IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { EDITING } from 'constants/icons';
import {
  resetEcosystemValues,
  setLpTokenAddress,
  setPairError,
} from 'store/farms';
import { useDispatch, useSelector } from 'react-redux';
import { selectEcosystemValues } from 'store/farms/selectors';
import { Contract } from 'utils/web3';
import { FTM, tokens } from 'constants/tokens';
import contracts from 'constants/contracts';
import styled from '@emotion/styled';
import { useMediaQuery } from '@chakra-ui/react';
import { StepMobileIndicator } from './StepMobileIndicator';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { addNewEcosystemFarm } from 'utils/web3/actions/farm';
import useWallets from 'app/hooks/useWallets';

const StyledStep = styled(Step)`
  display: ${({ isMobile, stepIndex, activeStep }) =>
    isMobile && stepIndex !== activeStep && 'none'};

  * {
    border-bottom: ${({ isMobile, stepIndex, activeStep }) =>
      isMobile && stepIndex === activeStep && 'none !important'};
  }import { opacity } from 'theme/base/opacity';

`;

const Button = ({ ...props }) => (
  <ChakraButton
    border="none"
    p={spacing.spacing04}
    _active={{
      border: 'none',
    }}
    {...props}
  />
);

const EcosystemFarmModal = ({ isOpen, onOpen, onClose, ...props }) => {
  const { account } = useWallets();
  const { addToQueue } = Web3Monitoring();

  const translationRoot = `farms.ecosystem`;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ecosystemValues = useSelector(selectEcosystemValues);

  const steps = [
    {
      label: t(`${translationRoot}.requirements.title`),
      content: <Requirements />,
    },
    {
      label: t(`${translationRoot}.tokensInLP.title`),
      content: <TokensInLP />,
    },
    {
      label: t(`${translationRoot}.emissionSettings.title`),
      content: <EmissionSettings />,
    },
    { label: t(`${translationRoot}.review.title`), content: <Review /> },
  ];

  const { nextStep, prevStep, activeStep, reset } = useSteps({
    initialStep: 0,
  });

  const checkTokenIsVerified = (tokenAddress: string) => {
    return tokens.some(token => token.address === tokenAddress);
  };

  let verifiedFarm =
    checkTokenIsVerified(ecosystemValues.token1.address) &&
    checkTokenIsVerified(ecosystemValues.token2.address);

  const onFinishHandler = () => {
    addNewEcosystemFarm(
      dispatch,
      account,
      addToQueue,
      ecosystemValues,
      verifiedFarm,
    );
    onClose();
    dispatch(resetEcosystemValues());
    reset();
  };

  const onCancelHandler = () => {
    onClose();
    dispatch(resetEcosystemValues());
    reset();
  };

  const validateStep = async () => {
    if (activeStep === 1) {
      const FACTORY_CONTRACT = contracts.factory[250];

      const factoryContract = async (_connector = window.ethereum) => {
        const contract = await Contract(FACTORY_CONTRACT, 'factory');
        return contract;
      };

      try {
        const contract = await factoryContract();

        const pair = await contract.getPair(
          ecosystemValues.token1.address,
          ecosystemValues.token2.address,
        );

        if (pair === FTM.address) {
          return dispatch(setPairError(true));
        }

        // LP TOKEN ADDRESS would be the result of getPair function
        dispatch(setLpTokenAddress(pair));
        dispatch(setPairError(false));
        nextStep();
      } catch (e) {
        dispatch(setPairError(true));
        console.error(e);
      }
    } else {
      dispatch(setPairError(false));
      nextStep();
    }
  };

  const mobileBreakpoint = '768px';
  const [isMobile] = useMediaQuery(`(max-width: ${mobileBreakpoint})`);
  const [nextIsDisabled, setNextIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (!ecosystemValues || activeStep !== 2) {
      return;
    }
    setNextIsDisabled(ecosystemValues.emissionAmount <= 0);
  }, [activeStep, ecosystemValues]);

  return (
    <Modal isOpen={isOpen} onClose={onCancelHandler} {...props} isCentered>
      <ModalOverlay />
      <ModalContent maxW={mobileBreakpoint} m={isMobile ? '8px' : '0'}>
        <Flex
          p={['spacing04', 'spacing06']}
          pl={['spacing03', 'spacing05']}
          alignItems="center"
          justifyContent={'space-between'}
        >
          <CardHeader
            title={t(`${translationRoot}.create`)}
            id={EDITING}
            helperContent={{
              title: '',
              text: '',
              showDocs: true,
            }}
          />
          <IconButton
            size="xs"
            height="2rem"
            width="2rem"
            bg="grayBorderBox"
            border="0"
            aria-label={t(`${translationRoot}.close`)}
            _active={{
              border: 'none',
            }}
            icon={<CloseIcon />}
            onClick={onCancelHandler}
          />
        </Flex>

        <Flex
          direction="column"
          px={['spacing04', 'spacing06']}
          gap="spacing05"
        >
          <Steps activeStep={activeStep} responsive={false}>
            {steps.map(({ label, content }, index) => (
              <StyledStep
                label={`${index + 1}. ${label}`}
                key={label}
                isMobile={isMobile}
                stepIndex={index}
                activeStep={activeStep}
              >
                <StepMobileIndicator
                  steps={steps}
                  currentStepIndex={activeStep}
                />
                {content}
              </StyledStep>
            ))}
          </Steps>

          <Flex pt="spacing02" pb={['spacing04', 'spacing06']}>
            <Button bg="grayBorderBox" onClick={onCancelHandler}>
              {t(`${translationRoot}.cancel`)}
            </Button>
            <Flex width="100%" gap="spacing03" justify="flex-end">
              {activeStep > 0 && (
                <Button
                  isDisabled={activeStep === 0}
                  onClick={prevStep}
                  bg="grayBorderBox"
                >
                  {t(`${translationRoot}.back`)}
                </Button>
              )}
              {activeStep === steps?.length - 1 ? (
                <Button onClick={onFinishHandler}>
                  {t(`${translationRoot}.createFarm`)}
                </Button>
              ) : (
                <Button
                  disabled={nextIsDisabled}
                  opacity={nextIsDisabled ? '0.4' : 1}
                  onClick={validateStep}
                  rightIcon={<ArrowForwardIcon />}
                >
                  {t(`${translationRoot}.next`)}
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default EcosystemFarmModal;
