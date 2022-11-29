import React, { useEffect } from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Select } from 'app/components/Select';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { setEcosystemValues, setFarmTokens } from 'store/farms';
import { useDispatch, useSelector } from 'react-redux';
import { selectEcosystemValues } from 'store/farms/selectors';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';

import tokens, { FTM, WFTM } from 'constants/tokens';

import { Token } from 'app/interfaces/General';

const StyledSelect = styled(Select)`
  width: 100%;
  height: 48px;
`;

export const EmissionSettings = ({ showLabel = true, isReview = false }) => {
  const translationRoot = `farms.ecosystem.emissionSettings`;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ecosystemValues = useSelector(selectEcosystemValues);

  const onEmissionScheduleChange = ({ index }) => {
    dispatch(
      setEcosystemValues({
        ...ecosystemValues,
        emissionSchedule: {
          value: index === 0 ? 14 : index === 1 ? 30 : 90,
          index,
        },
      }),
    );
  };

  const selectToken = (item: Token, onClose: () => void) => {
    dispatch(
      setEcosystemValues({
        ...ecosystemValues,
        emissionToken: {
          ...item,
          address: item.address === FTM.address ? WFTM.address : item.address,
        },
      }),
    );

    onClose();
  };

  useEffect(() => {
    dispatch(setFarmTokens(tokens));
  }, [dispatch]);

  return (
    <Flex direction="column" gap="spacing04">
      {showLabel && (
        <Text color={'gray'}>{t(`${translationRoot}.legend`)}</Text>
      )}

      <Flex flexDirection={['column', 'row']} gap={'1rem'}>
        <FormControl>
          <FormLabel color={'gray'} htmlFor="token-1" fontSize={'sm'}>
            {t(`${translationRoot}.emissionTokenAddress`)}
          </FormLabel>

          <NewTokenAmountPanel
            token={ecosystemValues.emissionToken}
            onSelect={selectToken}
            context="token"
            isSelectable={!isReview}
            inputValue={''}
            showNumberInputField={false}
            showBalance={false}
            height={'48px'}
            placeContent={'center'}
          />
        </FormControl>
        <FormControl>
          <FormLabel color={'gray'} htmlFor="token-2" fontSize={'sm'}>
            {t(`${translationRoot}.emissionAmount`)}
          </FormLabel>

          <Input
            autoFocus
            type="number"
            fontSize={'1rem'}
            borderColor={'grayBorderBox'}
            id="token-2"
            width={'100%'}
            size="lg"
            placeholder={t(`${translationRoot}.emissionAmountPlaceholder`)}
            defaultValue={isReview ? ecosystemValues.emissionAmount : ''}
            disabled={isReview}
            opacity={isReview ? 0.4 : 1}
            bg={isReview ? 'bgBoxLighter' : 'bgInput'}
            onChange={e =>
              dispatch(
                setEcosystemValues({
                  ...ecosystemValues,
                  emissionAmount: e.target.value,
                }),
              )
            }
          />
        </FormControl>
      </Flex>

      <Flex flexDirection={['column', 'row']} gap={'1rem'}>
        <FormControl>
          <FormLabel color={'gray'} htmlFor="token-1">
            {t(`${translationRoot}.emissionSchedule`)}
          </FormLabel>

          <StyledSelect
            disabled={isReview}
            selected={ecosystemValues.emissionSchedule.index}
            labels={[
              t(`${translationRoot}.14days`),
              t(`${translationRoot}.1month`),
              t(`${translationRoot}.3month`),
            ]}
            onChange={onEmissionScheduleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel color={'gray'} htmlFor="token-1">
            <HStack>
              <Text>{t(`${translationRoot}.emissionRate`)}</Text>
              <Tooltip
                label={`${translationRoot}.tokensEmittedPerDay`}
                placement="right"
                bg="bgBoxDarker"
              >
                <Icon _hover={{ cursor: 'pointer' }} />
              </Tooltip>
            </HStack>
          </FormLabel>
          <Input
            fontSize={'1rem'}
            borderColor={'grayBorderBox'}
            id="token-2"
            width={'100%'}
            size="lg"
            placeholder={t(`${translationRoot}.calculatedAutomatically`)}
            value={
              !isReview
                ? ''
                : (
                    ecosystemValues.emissionAmount /
                    ecosystemValues.emissionSchedule.value
                  ).toFixed(2)
            }
            disabled
            bg={isReview ? 'bgBoxLighter' : 'bgInput'}
            opacity={isReview ? 0.4 : 1}
          />
        </FormControl>
      </Flex>
    </Flex>
  );
};
