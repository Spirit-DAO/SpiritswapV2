import styled, { keyframes, css } from 'styled-components';
import { Heading } from 'app/components/Typography';
import { IconButton } from 'app/components/IconButton';

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledH3 = styled(Heading)`
  text-transform: uppercase;
  line-height: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.color?.gray};
  margin-bottom: ${({ theme }) => theme.space.spacing03};
`;

export const StyledWrapper = styled.div`
  h2,
  h3 {
    color: ${({ theme }) => theme.color?.white};
  }
`;

export const StyledIconButton = styled(IconButton)`
  svg {
    color: ${({ theme }) => theme.color?.ci};
  }
`;
const concentratedAnimation = keyframes`
  0% {
        transform: scale(1);
      }
  50% {
        transform: scale(1.2);
      }
  100% {
        transform: scale(1);
      }  
`;

export const TypeText = styled.div<{
  text: string;
  disabledAnimation?: boolean;
}>`
  padding: 0.25rem 0.75rem;
  position: relative;
  border-radius: 3px;
  margin-left: 4px;

  &:before {
    content: ${({ text }) => `'${text}'`};
    position: absolute;
    items-align: center;
    top: -12px;
    left: calc(-1 * 3px);
    padding: 5px 8px;
    color: white;
    background: ${({ disabledAnimation }) =>
      disabledAnimation
        ? '#1d9384'
        : css`linear-gradient(100deg, #60e6c5, #1d9384, #000315)`};
    linear-gradient(100deg, #60e6c5, #1d9384, #000315);
    border-radius: 8px;
    animation: ${({ disabledAnimation }) =>
      disabledAnimation
        ? css``
        : css`
            ${concentratedAnimation} 2.5s infinite;
          `} 
    background-size: 300% 300%;
  }
`;
