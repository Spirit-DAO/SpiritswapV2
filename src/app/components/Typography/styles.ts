import styled from '@emotion/styled';
import HeadingBase from './HeadingBase';
import type { Props as HeadingProps } from './Heading.d';
import type { Props as PargraphProps } from './Paragraph.d';
import { Text } from '@chakra-ui/react';

export const StyledHeading = styled(HeadingBase)<HeadingProps>`
  color: ${({ theme }) => theme.colors.white};
  color: ${props => props.color};
  font-family: ${({ theme }) => theme.fontFamily.sans};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme, level }) => theme.fontSizes[`h${level}`]};
  line-height: ${({ theme, level }) => theme.lineHeights[`h${level}`]};
  letter-spacing: ${({ theme, level }) =>
    theme.letterSpacings[level === 1 ? 'normal' : 'tight']};
  margin: 0;
`;

export const StyledParagraph = styled(Text)<PargraphProps>`
  color: ${({ theme, sub, variant }) =>
    variant === 'warning'
      ? theme.colors.warning
      : sub
      ? theme.colors.grayDarker
      : theme.colors.white};
  font-family: ${({ theme }) => theme.fontFamily.sans};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme, sub }) =>
    sub ? theme.lineHeights.sub : theme.lineHeights.sm};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  margin: 0;
`;
