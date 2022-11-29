import styled from 'styled-components';
import { Heading, Paragraph } from 'app/components/Typography';
import { ReactComponent as InSpirit } from 'app/assets/images/menu-inspirit.svg';
import { Suffix } from 'app/components/Suffix';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) =>
    `${theme.spacing.spacing03} ${theme.spacing.spacing04}`};
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
  letter-spacing: 1;
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.spacing.spacing02};
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
  margin-right: ${({ theme }) => theme.spacing.spacing03};
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

export const StyledText = styled(Paragraph)`
  // font size of boost factor here
  font-size: ${({ theme }) => theme.fontSize.s};
  color: ${({ theme }) => theme.color.grayDarker};

  > strong {
    color: white;
  }
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
