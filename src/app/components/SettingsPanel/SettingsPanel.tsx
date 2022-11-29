import { ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SWAP_SLIPPAGE_TOLERANCE_INDEX_KEY,
  SWAP_SLIPPAGE_TOLERANCE_VALUE_KEY,
  SWAP_SLIPPAGE_TOLERANCE_CUSTOM_KEY,
} from 'constants/index';
import { SettingsPanelProps } from './index';

import {
  StyledIcon,
  StyledPanel,
  StyledBody,
  StyledSlippageTolerance,
  StyledContent,
  StyledToleranceLabel,
  StyledLabel,
  StyledTimerIcon,
  StyledTimerBox,
  StyledTimerValue,
  StyledSelectedValue,
  StyledBackButton,
  StyledOptionBox,
} from './styles';

import { ReactComponent as ArrowIcon } from 'app/assets/images/arrow-right.svg';
import { ReactComponent as TimerIcon } from 'app/assets/images/timer.svg';

import { Switch } from 'app/components/Switch';
import { SlippageTolerance } from 'app/components/SlippageTolerance';
import { Button } from 'app/components/Button';
import { QuestionHelper } from 'app/components/QuestionHelper';

const SettingsPanel = ({
  labels,
  selected,
  timer,
  custom,
  translationsPath,
  backAction,
}: SettingsPanelProps) => {
  const formatValue = value => {
    if (!value) return '0%';
    return !isNaN(+value) ? `${value}%` : value;
  };

  const formatLabels = labels.map(v => formatValue(v));

  const { t } = useTranslation();

  const [loaded, setLoaded] = useState(false);

  const [slippageToleranceIndex, setSlippageToleranceIndex] =
    useState(selected);

  const [slippageToleranceValue, setSlippageToleranceValue] = useState(
    () =>
      localStorage.getItem(SWAP_SLIPPAGE_TOLERANCE_VALUE_KEY) ||
      formatValue(labels[selected]),
  );

  const [slippageToleranceCustom, setSlippageToleranceCustom] = useState(
    () =>
      localStorage.getItem(SWAP_SLIPPAGE_TOLERANCE_CUSTOM_KEY) ||
      formatValue(custom),
  );

  useEffect(() => {
    const loadSavedValues = () => {
      const savedIndex = localStorage.getItem(
        SWAP_SLIPPAGE_TOLERANCE_INDEX_KEY,
      );

      if (savedIndex) {
        setSlippageToleranceIndex(parseInt(savedIndex));
      }
    };
    loadSavedValues();
  }, [loaded, setLoaded, setSlippageToleranceIndex]);

  const onSelectSlippageTolerance = ({ index, value, custom }) => {
    setSlippageToleranceIndex(index);
    const v = formatValue(value);
    setSlippageToleranceValue(v);
    if (custom) {
      setSlippageToleranceCustom(v);
      localStorage.setItem(SWAP_SLIPPAGE_TOLERANCE_CUSTOM_KEY, v);
    }
    localStorage.setItem(SWAP_SLIPPAGE_TOLERANCE_INDEX_KEY, `${index}`);
    localStorage.setItem(SWAP_SLIPPAGE_TOLERANCE_VALUE_KEY, `${v}`);
  };

  const onResetAction = () => {
    setSlippageToleranceIndex(selected);
    setSlippageToleranceValue(formatValue(labels[selected]));
    setSlippageToleranceCustom(custom);

    // Reset localStorageValues too
    localStorage.setItem(SWAP_SLIPPAGE_TOLERANCE_INDEX_KEY, `${selected}`);
    localStorage.setItem(
      SWAP_SLIPPAGE_TOLERANCE_VALUE_KEY,
      formatValue(labels[selected]),
    );
    localStorage.setItem(SWAP_SLIPPAGE_TOLERANCE_CUSTOM_KEY, `${custom}`);
  };

  const renderHeader = (): ReactNode => (
    <StyledContent>
      <StyledBackButton>
        <Button
          data-testid="back-action"
          variant="inverted"
          flat={true}
          onClick={backAction}
        >
          <StyledIcon icon={<ArrowIcon />} size="normal" />
        </Button>
        {t(`${translationsPath}.title`)}
      </StyledBackButton>
      <Button
        data-testid="reset-action"
        variant="inverted"
        flat={true}
        onClick={onResetAction}
      >
        {t(`${translationsPath}.reset`)}
      </Button>
    </StyledContent>
  );

  const renderBody = (): ReactNode => (
    <StyledBody>
      <StyledContent>
        <StyledContent>
          <StyledToleranceLabel>
            {t(`${translationsPath}.slippageToleranceLabel`)}
          </StyledToleranceLabel>
          <QuestionHelper
            title={t(`${translationsPath}.slippageToleranceLabel`)}
            text={t(`${translationsPath}.slippageExplanation`)}
          />
        </StyledContent>
        <StyledSelectedValue data-testid="slippage-tolerance-value">
          {slippageToleranceValue}
        </StyledSelectedValue>
      </StyledContent>
      <StyledSlippageTolerance>
        <SlippageTolerance
          labels={formatLabels}
          selected={slippageToleranceIndex}
          customValue={slippageToleranceCustom}
          onChange={onSelectSlippageTolerance}
        />
      </StyledSlippageTolerance>
      <StyledContent>
        <StyledContent>
          <StyledLabel>
            {t(`${translationsPath}.transactionDeadlineLabel`)}
          </StyledLabel>
          <QuestionHelper
            title={t(`${translationsPath}.transactionDeadlineLabel`)}
            text={t(`${translationsPath}.transactionDeadlineExplanation`)}
          />
        </StyledContent>
        <StyledTimerBox>
          <StyledTimerIcon icon={<TimerIcon />} size={'normal'} />
          <StyledTimerValue>{timer}</StyledTimerValue>
        </StyledTimerBox>
      </StyledContent>
      <StyledContent>
        <StyledContent>
          <StyledLabel>{t(`${translationsPath}.chartModeLabel`)}</StyledLabel>
          <QuestionHelper
            title={t(`${translationsPath}.chartModeLabel`)}
            text={t(`${translationsPath}.chartExplanation`)}
          />
        </StyledContent>
        <StyledOptionBox>
          <Switch label="OFF" />
        </StyledOptionBox>
      </StyledContent>
      <StyledContent>
        <StyledContent>
          <StyledLabel>{t(`${translationsPath}.tradeModeLabel`)}</StyledLabel>
          <QuestionHelper
            title={t(`${translationsPath}.tradeModeLabel`)}
            text={t(`${translationsPath}.tradeModeExplanation`)}
          />
        </StyledContent>
        <StyledOptionBox>
          <Switch label="Expert" />
        </StyledOptionBox>
      </StyledContent>
    </StyledBody>
  );

  return (
    <StyledPanel>
      {renderHeader()}
      {renderBody()}
    </StyledPanel>
  );
};

export default SettingsPanel;
