import { Flex, FormControl, Text } from '@chakra-ui/react';
import { Alert, AlertDescription } from '@chakra-ui/react';
import { WarningIcon } from 'app/assets/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setEcosystemValues, setPairError } from 'store/farms';
import { selectEcosystemValues } from 'store/farms/selectors';
import { FTM, WFTM } from 'constants/tokens';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { Token } from 'app/interfaces/General';

export const TokensInLP = ({ showLabel = true, isReview = false }) => {
  const translationRoot = `farms.ecosystem.tokensInLP`;
  const { t } = useTranslation();
  const ecosystemValues = useSelector(selectEcosystemValues);
  const dispatch = useDispatch();

  const selectToken1 = (item: Token, onClose: () => void) => {
    dispatch(
      setEcosystemValues({
        ...ecosystemValues,
        token1: {
          ...item,
          address: item.address === FTM.address ? WFTM.address : item.address,
        },
      }),
    );
    dispatch(setPairError(false));
    onClose();
  };

  const selectToken2 = (item: Token, onClose: () => void) => {
    dispatch(
      setEcosystemValues({
        ...ecosystemValues,
        token2: {
          ...item,
          address: item.address === FTM.address ? WFTM.address : item.address,
        },
      }),
    );
    dispatch(setPairError(false));
    onClose();
  };

  return (
    <Flex direction={'column'} gap={'spacing04'}>
      {showLabel && (
        <Text color={'gray'}>{t(`${translationRoot}.legend`)}</Text>
      )}

      <Flex flexDirection={['column', 'row']} gap={'1rem'}>
        <FormControl>
          <Text color={'gray'} fontSize={'sm'} mb={'spacing03'}>
            Token 1
          </Text>
          <NewTokenAmountPanel
            token={ecosystemValues.token1}
            onSelect={selectToken1}
            inputValue={''}
            context="token"
            showNumberInputField={false}
            showBalance={false}
            isSelectable={!isReview}
            height={'48px'}
            placeContent={'center'}
          />
        </FormControl>
        <FormControl>
          <Text color={'gray'} fontSize={'sm'} mb={'spacing03'}>
            Token 2
          </Text>
          <NewTokenAmountPanel
            token={ecosystemValues.token2}
            onSelect={selectToken2}
            context="token"
            isSelectable={!isReview}
            inputValue={''}
            showNumberInputField={false}
            showBalance={false}
            height={'48px'}
            placeContent={'center'}
          />
        </FormControl>
      </Flex>
      {ecosystemValues.pairError && (
        <Alert
          status="error"
          bg="dangerBg"
          rounded={'md'}
          color="danger"
          gap="spacing04"
          py="spacing02"
          px="spacing03"
        >
          <WarningIcon w="1rem" h="1rem" color="danger" />
          <AlertDescription fontSize={'sm'}>
            {t(`${translationRoot}.alertMessage`)}
          </AlertDescription>
        </Alert>
      )}
    </Flex>
  );
};
