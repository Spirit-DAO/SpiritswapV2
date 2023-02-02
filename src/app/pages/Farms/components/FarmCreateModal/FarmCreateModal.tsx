import { CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Token } from '@lifi/sdk';
import { ArrowRightIcon, LinkIcon } from 'app/assets/icons';
import { CardHeader } from 'app/components/CardHeader';
import { VARIABLE, STABLE, BASE_TOKEN_ADDRESS } from 'constants/index';
import { EDITING } from 'constants/icons';
import {
  STABLE_BASE,
  STABLE_LIST,
  VARIABLES_BASE,
  VARIABLES_LIST,
} from 'constants/whitelistToken';
import { FC, useState } from 'react';
import StepsFarms from '../StepsFarms/StepsFarms';
import { Props } from './FarmCreateModal.d';
import Requirments from './Steps/Requirments';
import Selections from './Steps/Selections';
import { createFarm, getPairs } from 'utils/web3/actions/farm';
import { useNavigate } from 'app/hooks/Routing';
import { LIQUIDITY } from 'app/router/routes';
import { useAppSelector } from 'store/hooks';
import {
  selectSaturatedGauges,
  selectTotalSpiritSupply,
} from 'store/general/selectors';
import { checkAddress, convertTokenPrice, formatNumber } from 'app/utils';
import { transactionResponse } from 'utils/web3';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { useSelector } from 'react-redux';
import { selectInspiritUserBalance } from 'store/user/selectors';
import BigNumber from 'bignumber.js';
import useLogin from 'app/connectors/EthersConnector/login';

const FarmCreateModal: FC<Props> = ({ isOpen, onClose, isConnected }) => {
  const navigate = useNavigate();
  const ERROR_LP: string = 'You need to create a LP Pair First';
  const ERROR_SUPPLY: string = 'Insufficient inSPIRIT balance';
  const ERROR_FARM_EXIST: string = 'Farm already exists';
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const { handleLogin } = useLogin();
  const inspiritSupply: string = useSelector(selectTotalSpiritSupply);
  const inSpiritBalance: string = useAppSelector(selectInspiritUserBalance);
  const {
    isLoading: isChecking,
    loadingOff: checkingOff,
    loadingOn: checkingOn,
  } = UseIsLoading();
  const { boostedV2, boostedStable } = useAppSelector(selectSaturatedGauges);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedBase, setSelectedBase] = useState<Token>(VARIABLES_BASE.WFTM);
  const [selectedToken, setSelectedToken] = useState<Token>(VARIABLES_LIST.BNB);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [addressFarm, setAddressFarm] = useState<string>('');
  const [farmType, setFarmType] = useState(VARIABLE);
  const [listTokens, setListTokens] = useState({
    base: VARIABLES_BASE,
    list: VARIABLES_LIST,
  });
  const [inspiritData, setInspiritData] = useState({
    totalSupply: '0',
    balance: '0',
  });

  const resetVerification = () => {
    setErrorMessage('');
  };

  const onSelectType = (type: string) => {
    if (type === farmType) return;
    if (type === VARIABLE) {
      selectBase(VARIABLES_BASE.WFTM, () => {});
      selectToken(VARIABLES_LIST.BNB, () => {});
      setListTokens({ base: VARIABLES_BASE, list: VARIABLES_LIST });
    }
    if (type === STABLE) {
      selectBase(STABLE_BASE.USDC, () => {});
      selectToken(STABLE_LIST.FUSDT, () => {});
      setListTokens({ base: STABLE_BASE, list: STABLE_LIST });
    }
    setFarmType(type);
    resetVerification();
  };

  const checkPair = async (): Promise<string> => {
    try {
      checkingOn();
      const isStable = farmType === STABLE;
      const addressPair: string = await getPairs(
        isStable,
        selectedBase.address,
        selectedToken.address,
      );
      if (addressPair === BASE_TOKEN_ADDRESS) {
        setErrorMessage(ERROR_LP);
        checkingOff();
        return '';
      }

      checkingOff();
      setAddressFarm(addressPair);
      return addressPair;
    } catch (error) {
      checkingOff();
      return '';
    }
  };

  const checkInspiritAmount = () => {
    if (inspiritSupply && inSpiritBalance) {
      const bnSupply = new BigNumber(inspiritSupply);
      const bnBalance = new BigNumber(inSpiritBalance);
      const minAmount = bnSupply.multipliedBy(0.01);
      const balanceFormatted = formatNumber({
        value: Number(inSpiritBalance),
        maxDecimals: 2,
      });
      const canCreate = bnBalance.isGreaterThan(minAmount);
      const inspiritNeedIt = convertTokenPrice(minAmount.toNumber(), 1);
      if (!canCreate) setErrorMessage(ERROR_SUPPLY);
      setInspiritData({
        balance: balanceFormatted,
        totalSupply: inspiritNeedIt,
      });
    }
  };

  const checkFarmExist = (pairAddress: string): boolean => {
    const farms = farmType === VARIABLE ? boostedV2 : boostedStable;
    const findFarm = farms.find(farm =>
      checkAddress(farm?.fulldata?.farmAddress, pairAddress),
    );
    if (findFarm) {
      setErrorMessage(ERROR_FARM_EXIST);
      return true;
    }
    if (inspiritData.totalSupply === '0') checkInspiritAmount();
    return false;
  };

  const nextStep = async () => {
    if (activeStep === 1) {
      const addressPair: string = await checkPair();
      if (addressPair) {
        const farmExist = checkFarmExist(addressPair);
        if (!farmExist) {
          setActiveStep(prevStep => prevStep + 1);
        }
      }
    }

    if (activeStep !== 1) setActiveStep(prevStep => prevStep + 1);
  };
  const prevStep = () => {
    setActiveStep(prevStep => prevStep - 1);
    resetVerification();
  };

  const handleCreateFarm = async () => {
    try {
      loadingOn();
      const tx = await createFarm(farmType, addressFarm);
      if (tx) {
        transactionResponse('farm.ecosystem', {
          tx: tx,
          uniqueMessage: { text: 'Creating a New Farm' },
          update: 'farms',
        });
        await tx.wait();
        loadingOff();
        onClose();
      }
    } catch (error) {
      setErrorMessage(ERROR_SUPPLY);
      loadingOff();
    }
  };

  const selectBase = (item: Token, onClose: () => void) => {
    if (item.address !== selectedBase.address) {
      setSelectedBase(item);
      resetVerification();
    }
    onClose();
  };
  const selectToken = (item: Token, onClose: () => void) => {
    if (item.address !== selectedToken.address) {
      setSelectedToken(item);
      resetVerification();
    }
    onClose();
  };

  const steps = ['1. Requirements', '2. Select Tokens', '3. Review'];

  const navigateLiquidity = () => {
    navigate(LIQUIDITY.path);
  };

  const buttonStatus = () => {
    if (!isConnected)
      return {
        icon: <></>,
        text: 'Connect Wallet',
        action: handleLogin,
      };
    if (errorMessage === ERROR_LP)
      return {
        icon: <LinkIcon color="white" w="25px" h="25px" />,
        text: 'Go Liquidity',
        action: navigateLiquidity,
      };
    return {
      icon: <ArrowRightIcon color="white" w="25px" h="25px" />,
      text: 'Next',
      action: nextStep,
    };
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex
            w="full"
            p="spacing02"
            alignItems="center"
            justifyContent="space-between"
          >
            <CardHeader
              title="Create farm"
              id={EDITING}
              helperContent={{
                title: 'Create a Farm',
                text: 'You can create a Stable or Variable Farm here',
                showDocs: false,
              }}
            />
            <IconButton
              size="xs"
              height="2rem"
              width="2rem"
              bg="grayBorderBox"
              border="0"
              aria-label="close "
              _active={{
                border: 'none',
              }}
              icon={<CloseIcon />}
              onClick={onClose}
            />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <HStack p="spacing02" w="full" justify="center">
            {steps.map((label, i) => (
              <StepsFarms
                isActive={activeStep === i}
                label={label}
                key={`${i}-${label}`}
              />
            ))}
          </HStack>
          {activeStep === 0 ? <Requirments /> : null}
          {activeStep === 1 || activeStep === 2 ? (
            <Selections
              selectBase={selectBase}
              selectToken={selectToken}
              selectedBase={selectedBase}
              selectedToken={selectedToken}
              onSelectType={onSelectType}
              farmType={farmType}
              listTokens={listTokens}
              activeStep={activeStep}
              inspiritData={inspiritData}
            />
          ) : null}
          {errorMessage && (
            <Text fontSize="xs" color="error" p="spacing03">
              {errorMessage}
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <HStack w="full" justify="space-between" p="spacing02">
            <Button variant="secondary" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <HStack>
              {activeStep > 0 ? (
                <Button variant="secondary" onClick={prevStep}>
                  <Text>Back</Text>
                </Button>
              ) : null}
              {activeStep < 2 ? (
                <Button
                  disabled={
                    errorMessage.length > 0 && errorMessage !== ERROR_LP
                  }
                  isLoading={isChecking}
                  loadingText="Verifying"
                  onClick={() => buttonStatus().action()}
                >
                  <Text>{buttonStatus().text}</Text>
                  {buttonStatus().icon}
                </Button>
              ) : null}
              {activeStep === 2 ? (
                <Button
                  disabled={errorMessage.length > 0}
                  isLoading={isLoading}
                  loadingText="Creating a Farm"
                  onClick={handleCreateFarm}
                >
                  <Text>Create Farm</Text>
                </Button>
              ) : null}
            </HStack>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default FarmCreateModal;
