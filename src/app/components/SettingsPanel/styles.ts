import styled from '@emotion/styled';
import { Panel } from 'app/components/Panel';
import { Icon } from 'app/components/Icon';
import { Paragraph } from 'app/components/Typography';

export const StyledContent = styled.div`
  display: flex;
  padding: 0.25rem 0;
`;

export const StyledPanel = styled(Panel)`
  padding: 1.5rem;
  width: 445px;
  margin: 0 auto;
`;

export const StyledIcon = styled(Icon)`
  transform: rotate(180deg);
  color: ${({ theme }) => theme.colors.ci};
  margin-right: 0.5rem;
  width: 2rem;
  height: 2rem;
`;

export const StyledTimerIcon = styled(Icon)`
  margin-top: 0.5rem;
`;

export const StyledOptionBox = styled(StyledContent)`
  height: 2.5rem;
  padding: 0 0.25rem;
  margin-left: auto;
`;

export const StyledTimerBox = styled(StyledOptionBox)`
  background-color: ${({ theme }) => theme.colors.ciTrans15};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const StyledTimerValue = styled.div`
  margin: 0.5rem;
  color: ${({ theme }) => theme.colors.ci};
  align-self: center;
  font-size: 0.9rem;
`;

export const StyledBody = styled(StyledContent)`
  flex-direction: column;
  padding: 0.5rem;
`;

const StyledMessage = styled(Paragraph)`
  display: flex;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.gray};
`;

export const StyledToleranceLabel = styled(StyledMessage)`
  margin: 0.5rem 0;
`;

export const StyledLabel = styled(StyledMessage)`
  margin-bottom: 0.5rem;
  margin-top: 0.625rem;
`;

export const StyledSlippageTolerance = styled.div`
  margin-bottom: 1rem;
`;

export const StyledSelectedValue = styled(StyledContent)`
  align-items: center;
  font-size: 0.9rem;
  margin-left: auto;
`;

export const StyledBackButton = styled(StyledContent)`
  align-items: center;
  flex-grow: 1;
  font-size: 1.2rem;
`;
