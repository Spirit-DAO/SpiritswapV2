import React, { FC } from 'react';
import type { Props } from './TokenIcon.d';
import { StyledWrapperDiv } from './styles';
import { TokensSvgMap } from './TokenSvgMapping';

const TokenIcon: FC<Props> = ({
  size = 'big',
  svgColor = 'default',
  token,
  ...props
}: Props) => {
  const mappedTokenSvg = TokensSvgMap[token] || TokensSvgMap['UNKNOWN'];

  return (
    <StyledWrapperDiv
      {...props}
      size={size}
      svgColor={svgColor}
      dangerouslySetInnerHTML={{ __html: mappedTokenSvg?.svg || '' }}
    />
  );
};

export default TokenIcon;
