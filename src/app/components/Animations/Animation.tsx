import React from 'react';
import styled from '@emotion/styled';

const StyledVideo = styled.video<{ height: string; width: string }>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  max-height: 450px;

  animation: fadeIn 4s;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Animation = (
  src,
  poster: string,
  width: string = '100%',
  height: string = '100%',
) => {
  return (
    <StyledVideo
      width={width}
      height={height}
      poster={poster}
      preload="auto"
      autoPlay
      loop
      muted
    >
      <source src={src} type="video/webm" />
    </StyledVideo>
  );
};
export default Animation;
