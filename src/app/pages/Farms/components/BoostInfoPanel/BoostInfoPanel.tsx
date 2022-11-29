import { FC } from 'react';
import { Grid, Cell } from 'styled-css-grid';
import { useTranslation } from 'react-i18next';
import { Icon } from 'app/components/Icon';
import { ProgressBar } from 'app/components/ProgressBar';
import { ReactComponent as SpiritLogo } from 'app/assets/images/ghost.svg';
import { ReactComponent as QuestionIcon } from 'app/assets/images/question-3-circle.svg';
import { TokenEarningsBox } from '../TokenEarningsBox';
import { Props } from './BoostInfoPanel.d';
import {
  StyledContainer,
  StyledProgressWrapper,
  StyledHoldLabel,
  StyledReducedIcon,
  StyledParagraph,
} from './styles';

const BoostInfoPanel: FC<Props> = ({
  boostFactor,
  yourApr,
  holdAmountForBoost,
  holdAmountForBoostFactor,
  progress,
}) => {
  const { t } = useTranslation();
  const translationPath = 'farms.boostInfoPanel';

  return (
    <StyledContainer>
      <StyledProgressWrapper>
        <Grid columns={2}>
          <Cell>
            <TokenEarningsBox
              label="Your Boost Factor"
              value={`${boostFactor}`}
              highlight={true}
            />
          </Cell>
          <Cell>
            <TokenEarningsBox
              label="Your APR"
              value={`${yourApr}`}
              highlight={true}
            />
          </Cell>
        </Grid>
        {!!holdAmountForBoost &&
          !!holdAmountForBoostFactor &&
          holdAmountForBoostFactor > 0 && (
            <StyledHoldLabel>
              <StyledReducedIcon icon={<SpiritLogo />} size={28} />
              <StyledParagraph>
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(`${translationPath}.holdLabel`, {
                      value: holdAmountForBoost,
                      boostFactor: holdAmountForBoostFactor,
                    }),
                  }}
                />
              </StyledParagraph>
              <Icon icon={<QuestionIcon />} size={16} />
            </StyledHoldLabel>
          )}
        {!!progress && <ProgressBar value={progress} />}
      </StyledProgressWrapper>
    </StyledContainer>
  );
};

export default BoostInfoPanel;
