import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Props } from './SelectTokenPopup.d';
import {
  StyledPanel,
  StyledTopContainer,
  StyledTitle,
  StyledCloseButton,
  StyledSearchInput,
} from './styles';

const SelectTokenPopup: FC<Props> = ({ children, ...props }: Props) => {
  const { t } = useTranslation();
  const translationPath = 'common.selectTokenPopup';

  return (
    <StyledPanel {...props}>
      <StyledTopContainer>
        <StyledTitle>{t(`${translationPath}.title`)}</StyledTitle>
        <StyledCloseButton />
      </StyledTopContainer>
      <StyledSearchInput placeholder={t(`${translationPath}.placeholder`)} />
      {children}
    </StyledPanel>
  );
};

export default SelectTokenPopup;
