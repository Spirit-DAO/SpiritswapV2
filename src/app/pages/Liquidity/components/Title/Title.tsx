import { FC } from 'react';
import { Props } from './Title.d';
import { Flex, Spacer } from '@chakra-ui/react';
import { Heading } from 'app/components/Typography';
import { ReactComponent as MoneyHandIcon } from 'app/assets/images/money-with-hand-small.svg';
import { StyledFarmIcon, StyledLiquiditySetting } from '../../styles';
import { useTranslation } from 'react-i18next';
import { QuestionHelper } from 'app/components/QuestionHelper';

const Title: FC<Props> = ({
  header,
  handleLiquiditySettings,
  questionHelper,
}) => {
  const { t } = useTranslation();
  const translationPath = 'liquidity.common';
  return (
    <Flex justify="space-between" align="center" w="100%" mb="20px">
      <Flex align="center" sx={{ gap: '0.3rem' }}>
        <StyledFarmIcon icon={<MoneyHandIcon />} size={32} />
        <Heading level={2}>{t(`${translationPath}.${header}`)}</Heading>
        <Spacer />
        <QuestionHelper
          title={questionHelper?.title || ''}
          text={questionHelper?.text || ''}
          importantText={questionHelper?.importantText}
          showDocs={questionHelper?.showDocs}
        />
      </Flex>
      <StyledLiquiditySetting onClick={handleLiquiditySettings} />
    </Flex>
  );
};

export default Title;
