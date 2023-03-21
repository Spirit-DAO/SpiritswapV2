import { Flex, Icon, Button, Text, Box, Stack } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { CardHeader } from 'app/components/CardHeader';
import PlusLogoGreen from '../PlusLogoGreen';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Danger } from 'app/assets/images/danger.svg';
import { Props } from './ConfirmModalConcentrated.d';
import { ARROWBACK } from 'constants/icons';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { Switch } from 'app/components/Switch';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { Field } from 'store/v3/mint/actions';
import { ADDRESS_ZERO } from '../../../../../v3-sdk';
import { Heading } from 'app/components/Typography';

const ConfirmModalConcentrated = ({
  onConfirm,
  onCancel,
  mintInfo,
  isLoading,
}: Props) => {
  const { t } = useTranslation();

  const translationPath = 'liquidity.confirmPanel';
  const translationPathCommon = 'liquidity.common';

  const currencyA = mintInfo?.currencies[Field.CURRENCY_A];
  const currencyB = mintInfo?.currencies[Field.CURRENCY_B];

  const amountA = mintInfo?.parsedAmounts[Field.CURRENCY_A]?.toSignificant(4);
  const amountB = mintInfo?.parsedAmounts[Field.CURRENCY_B]?.toSignificant(4);

  const lowerPrice = mintInfo?.lowerPrice?.toSignificant(4);
  const upperPrice = mintInfo?.upperPrice?.toSignificant(4);

  return (
    <Box
      bgColor="bgBox"
      borderRadius="md"
      borderWidth="1px"
      maxW="504px"
      p="spacing06"
      w={{ base: '95%', lg: '100%' }}
      mb="spacing06"
      h="fit-content"
    >
      <CardHeader
        hidebackground
        title={t(`${translationPath}.confirmAddingLiquidity`)}
        id={ARROWBACK}
        onIconClick={onCancel}
        hideQuestionIcon
      />

      <Flex direction="column" gap={4} mt="spacing06" mb="spacing06">
        <NewTokenAmountPanel
          key={`input-${currencyA?.symbol}-token`}
          inputValue={amountA}
          context="token"
          token={
            currencyA.isNative
              ? { ...currencyA, address: ADDRESS_ZERO }
              : currencyA
          }
          isSelectable={false}
          showConfirm={true}
          showBalance={false}
        />

        <PlusLogoGreen />

        <NewTokenAmountPanel
          key={`input-${currencyB?.symbol}-token`}
          inputValue={amountB}
          context="token"
          token={
            currencyB.isNative
              ? { ...currencyB, address: ADDRESS_ZERO }
              : currencyB
          }
          isSelectable={false}
          showConfirm={true}
          showBalance={false}
        />

        <Flex justifyContent="space-between">
          <Heading level={3}>Range:</Heading>
          <Box>{`${lowerPrice} — ${upperPrice}`}</Box>
        </Flex>
      </Flex>

      <Flex direction="column" mt="5px">
        <Stack mt="spacing05" direction="row" spacing={1}>
          <Button variant="secondary" w="100%" onClick={onCancel}>
            {t(`${translationPathCommon}.cancel`)}
          </Button>
          <Button
            w="100%"
            bgColor="ciDark"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {t(`${translationPathCommon}.confirm`)}
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default ConfirmModalConcentrated;
