import { FC } from 'react';
import {
  StyledContainer,
  StyledDoughnutWrapper,
  StyledInSpirit,
  StyledDoughnutText,
  StyledCurrentBoost,
  StyledText,
  StyledParagraph,
  StyledTextGraph,
} from './styles';
import { darkTheme } from '../../../../../theme/dark/index';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation, Trans } from 'react-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Props, DoughnutChartOptions } from './BoostFactor.d';
import { formatNumber } from 'app/utils';
import { QuestionHelper } from 'app/components/QuestionHelper';

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultOptions: DoughnutChartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 26,
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
};

const DoughnutChart = ({ options, data }) => (
  <>{Doughnut && <Doughnut options={options} data={data} />}</>
);

const BoostFactor: FC<Props> = ({
  currentBoost,
  holdAmountForMaxBoost,
  options = defaultOptions,
  lpTokens,
}) => {
  const { t } = useTranslation();
  const translationPath = 'farms.boostInfoPanel';
  const currentBoostValue = parseFloat(currentBoost);

  const data = {
    datasets: [
      {
        data: [currentBoost, 2.5 - currentBoostValue],
        backgroundColor: [darkTheme.color.ci, darkTheme.color.ciTrans15],
        borderWidth: 0,
      },
    ],
  };

  const amountforMaxBoostValue = formatNumber({
    value: parseFloat(holdAmountForMaxBoost),
    maxDecimals: 0,
  });

  return (
    <StyledContainer>
      <div>
        <StyledInSpirit />
        <StyledParagraph>
          {t(`${translationPath}.yourBoostFactor`)}
          <QuestionHelper
            title={t(`${translationPath}.yourBoostFactor`)}
            text={t(`${translationPath}.boostfactorExplanation`)}
            iconMargin="-2px 5px 0"
          />
        </StyledParagraph>
      </div>
      <StyledText>
        {currentBoostValue >= 2.5 ? (
          t(`${translationPath}.maxBoostAchieved`)
        ) : parseFloat(lpTokens) === 0 ? (
          t(`${translationPath}.noBoostTokens`)
        ) : (
          <Trans
            i18nKey={`${translationPath}.holdForMaxBoost`}
            values={{ amount: amountforMaxBoostValue }}
          />
        )}
      </StyledText>
      <StyledDoughnutWrapper>
        <StyledDoughnutText>
          <StyledCurrentBoost level={4}>{currentBoost}x</StyledCurrentBoost>
          <StyledTextGraph>{t(`${translationPath}.of`)} 2.5x</StyledTextGraph>
        </StyledDoughnutText>
        <DoughnutChart data={data} options={options} />
      </StyledDoughnutWrapper>
    </StyledContainer>
  );
};

export default BoostFactor;
