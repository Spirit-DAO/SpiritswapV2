import styled from 'styled-components';

export const CloseBox = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;

  > * {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
