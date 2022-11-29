import styled from 'styled-components';
import { Heading, Paragraph } from 'app/components/Typography';

export const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.color.bgInput};
  gap: ${({ theme }) => theme.spacing.spacing04};
`;

export const StyledTokensValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.spacing01};
`;

export const StyledTokensNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const StyledTokenValueWrapper = styled.div`
  display: flex;
  height: 2.5rem;
  align-items: center;
`;

export const StyledTokensName = styled(Heading)`
  display: flex;
  align-items: center;
  line-height: 1;
  text-align: right;
  word-break: normal;
`;

export const StyledValueWrapper = styled.div`
  display: flex;
  text-align: right;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  height: 2.5rem;
`;

export const StyledMaxValueWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  button {
    background: transparent;
    padding: 0;
    border: none;
    color: ${({ theme }) => theme.color.ci};
    margin: auto;

    &:active {
      border: none;
    }
  }
`;

export const StyledSubLabel = styled(Paragraph)<{ alignment: string }>`
  text-align: ${({ alignment }) => alignment};
  font-size: 14px;
`;
