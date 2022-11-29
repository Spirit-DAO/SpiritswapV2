import { FC } from 'react';
import { Suffix } from 'app/components/Suffix';
import { useTranslation } from 'react-i18next';
import { Props, ItemProps } from './IconTooltipPanel.d';
import {
  StyledContainer,
  StyledLeftCell,
  StyledRightCell,
  StyledRow,
} from './styles';
import { QuestionHelper } from 'app/components/QuestionHelper';

const IconTooltipPanel: FC<Props> = ({ items, staked }: Props) => {
  const { t } = useTranslation();
  const translationPath = 'farms.iconTooltipPanel';
  if (!items) {
    return null;
  }

  return (
    <StyledContainer staked={staked}>
      {items.map((item: ItemProps, index: number) => (
        <StyledRow key={`icon-tooltip-item-${index}`}>
          <StyledLeftCell>
            {/* TODO Replace w/ Tooltip component */}
            {item.tooltip ? (
              <Suffix
                suffix={
                  <QuestionHelper
                    title={t(`${translationPath}.${item.tooltip}`)}
                    text={t(`${translationPath}.${item.tooltip}Explanation`)}
                  />
                }
              >
                {item.label}
              </Suffix>
            ) : (
              item.label
            )}
          </StyledLeftCell>
          <StyledRightCell>
            {item.icon ? (
              <Suffix suffix={item.icon}>{item.value}</Suffix>
            ) : (
              item.value
            )}
          </StyledRightCell>
        </StyledRow>
      ))}
    </StyledContainer>
  );
};

export default IconTooltipPanel;
