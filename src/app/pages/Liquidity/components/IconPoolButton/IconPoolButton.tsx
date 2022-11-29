import { FC } from 'react';
import { Flex } from '@chakra-ui/react';
import { Props } from './IconPoolButton.d';
import ImageLogo from 'app/components/ImageLogo';
import { StyledButton, StyledImage, StyledSpan } from './styles';

const IconPoolButton: FC<Props> = ({
  label,
  icon,
  iconPos = 'left',
  size = 'default',
  poolItem,
  ...props
}: Props) => {
  const iconOnly = !label && !!icon;
  const poolSymbols = poolItem?.tokens.map(token => {
    return token.symbol;
  });

  return (
    <StyledButton iconOnly={iconOnly} iconPos={iconPos} size={size} {...props}>
      <Flex>
        <StyledSpan>{`${poolItem?.name}`}</StyledSpan>
      </Flex>
      <Flex flexWrap="wrap" marginLeft="auto">
        {poolSymbols?.map(tokenSymbol => {
          return (
            <ImageLogo
              key={`il-${tokenSymbol}`}
              symbol={tokenSymbol}
              size="32px"
              margin="0 4px 5px 0"
            />
          );
        })}
      </Flex>
      <Flex>
        {icon && (
          <StyledImage iconOnly={iconOnly} iconPos={iconPos} size={size}>
            {icon}
          </StyledImage>
        )}
      </Flex>
    </StyledButton>
  );
};

export default IconPoolButton;
