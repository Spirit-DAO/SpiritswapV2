import styled from '@emotion/styled';
import { Panel } from 'app/components/Panel';
import { IconToInput } from 'app/components/IconToInput';
import { SelectWithDropdown } from 'app/components/SelectWithDropdown';
import { Heading, Paragraph } from 'app/components/Typography';

export const StyledPanel = styled(Panel)`
  overflow: hidden;
  margin-bottom: 12px;
`;

export const StyledContent = styled.div`
  padding: 1.5rem;
  min-height: 200px;
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  min-height: 40px;
`;

export const StyledIconToInput = styled(IconToInput)`
  justify-content: flex-end;
  flex: 1;
  margin-left: 0.625rem;
`;

export const StyledNoTokensBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
`;

export const StyledGrayParagraph = styled(Paragraph)`
  color: ${({ theme }) => theme.colors.gray};
`;

export const StyledNoTokensMessage = styled(StyledGrayParagraph)`
  margin-bottom: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const StyledTokenCount = styled(Heading)`
  color: ${({ theme }) => theme.colors.gray};
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const StyledDescription = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
`;

export const StyledFooter = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledDropdown = styled(SelectWithDropdown)<{
  isUnverified: boolean;
}>`
  label {
    color: ${({ theme, isUnverified }) =>
      isUnverified ? theme.colors.warning : theme.colors.ci};
  }

  * {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }

  #items-wrapper {
    top: 2rem;
    right: 0.2rem;
  }
`;
