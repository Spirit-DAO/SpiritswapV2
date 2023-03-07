import styled from 'styled-components';
import { Heading, Paragraph } from 'app/components/Typography';
import { ReactComponent as InSpirit } from 'app/assets/images/menu-inspirit.svg';
import { Suffix } from 'app/components/Suffix';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) =>
    `${theme.spacing.spacing02} ${theme.spacing.spacing01}`};
  background-color: ${({ theme }) => theme.color.bgBoxLighter};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

export const StyledParagraph = styled(Paragraph)<{
  color?: any;
}>`
  font-size: ${({ theme }) => theme.fontSize.h5};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ color, theme }) =>
    color ? 'theme.color.grayDarker' : theme.color.gray};
  display: inline-flex;
`;

export const StyledDoughnutWrapper = styled.div`
  position: relative;
  width: 100px;
  margin-top: ${({ theme }) => theme.spacing.spacing04};
  align-self: center;

  canvas {
    height: 64px !important;
  }
`;

export const StyledInSpirit = styled(InSpirit)`
  color: ${({ theme }) => theme.color.ci};
  display: inline-flex;
  width: 20px;
  height: 20px;
`;

export const StyledDoughnutText = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const StyledCurrentBoost = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.color.ci};
  text-align: center;
`;

export const StyledText = styled.p<{ color?: string }>`
  color: ${({ theme, color }) => (color ? color : theme.color.grayDarker)};
  font-family: ${({ theme }) => theme.fontFamily.sans};
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSize.sm};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
  margin: 0;
`;

export const StyledTextGraph = styled(StyledText)`
  color: ${({ theme }) => theme.color.gray};
`;

export const StyledSuffix = styled(Suffix)`
  color: ${({ theme }) => theme.color.gray};
  font-size: ${({ theme }) => theme.fontSize.sm};
  svg {
    color: ${({ theme }) => theme.color.gray};
  }
`;
