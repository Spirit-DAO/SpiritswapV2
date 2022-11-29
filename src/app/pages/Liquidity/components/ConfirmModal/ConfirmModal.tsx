import { Flex, Icon, Button, Text, Box, Stack } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';
import { CardHeader } from 'app/components/CardHeader';
import PlusLogoGreen from '../PlusLogoGreen';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Danger } from 'app/assets/images/danger.svg';
import { Props } from './Modal.d';
import { ARROWBACK } from 'constants/icons';
import NewTokenAmountPanel from 'app/components/NewTokenAmountPanel/NewTokenAmountPanel';
import { Switch } from 'app/components/Switch';
import { QuestionHelper } from 'app/components/QuestionHelper';

const ConfirmModal = ({
  onConfirm,
  onCancel,
  sharePool,
  price,
  tokensWithValue,
  isWeightedPool = false,
  poolName,
  isLoading,
  poolData,
  zapDirectly,
  setZapDirectly,
}: Props) => {
  const { t } = useTranslation();
  const translationPath = 'liquidity.confirmPanel';
  const translationPathCommon = 'liquidity.common';

  const poolAmountDisplay =
    parseFloat(sharePool.toString()) < 0.01 ? '<0.01' : sharePool;

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

      <Flex direction="column" mt="spacing06" mb="spacing06">
        <Text>{t(`${translationPath}.youPay`)}</Text>
        {tokensWithValue?.map((tokenAmount, index) => {
          const isTheLast = index === tokensWithValue.length - 1;
          if (isTheLast)
            return (
              <NewTokenAmountPanel
                key={`input-${tokenAmount.token.symbol}`}
                inputValue={tokenAmount.amount}
                context="token"
                token={tokenAmount.token}
                isSelectable={false}
                showConfirm={true}
              />
            );
          return (
            <div key={`div-${tokenAmount.token.address}`}>
              <NewTokenAmountPanel
                key={`output-${tokenAmount.token.symbol}`}
                context="token"
                inputValue={tokenAmount.amount}
                token={tokenAmount.token}
                isSelectable={false}
                showConfirm={true}
              />
              <PlusLogoGreen key={`plus-${tokenAmount.token.address}`} />
            </div>
          );
        })}
      </Flex>

      <Flex direction="column">
        <Text mb="5px" color="ci" fontSize="sm">
          {t(`${translationPathCommon}.youWillReceive`)}
        </Text>
        <Flex mt="5px">
          {tokensWithValue?.map(tokenAmount => (
            <ImageLogo
              symbol={tokenAmount.token.symbol}
              size="32px"
              key={`${tokenAmount.token.address}-tokens-list`}
            />
          ))}
        </Flex>
        <Text fontSize="xl">
          {price} {poolName?.replace('-', ' + ')}
        </Text>

        {!isWeightedPool && (
          <Flex
            my="spacing04"
            alignItems="center"
            bgColor="ciTrans15"
            borderRadius="md"
            p="spacing04"
          >
            <Icon as={Danger} mr="spacing04" color="ci" />
            <Text fontSize="sm" color="ci">
              {t(`${translationPath}.alert`)}
            </Text>
          </Flex>
        )}
      </Flex>

      <Flex direction="column" mt="5px">
        {Object.keys(poolData ?? {}).length > 0 && (
          <Flex justify="space-between" w="100%" mb="10px">
            <Text color="gray" fontSize="sm">
              {t(`${translationPath}.zapDirectlyFarm`)}
              <QuestionHelper
                iconMargin="0 0 4px 5px"
                text={`Zapping directly to this farm will deposit 100% of your held ${poolName} tokens.`}
                title="Zap Info"
              />
            </Text>
            <Switch
              checked={zapDirectly}
              onChange={() => setZapDirectly(!zapDirectly)}
            />
          </Flex>
        )}
        <Flex justify="space-between" w="100%">
          <Text color="gray" fontSize="sm">
            {t(`${translationPath}.shareOfPool`)}
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            {`${poolAmountDisplay}`}
          </Text>
        </Flex>

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

export default ConfirmModal;
