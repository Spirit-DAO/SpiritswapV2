import { Flex, HStack, Text } from '@chakra-ui/react';
import { Token } from 'app/interfaces/General';
import { useTranslation } from 'react-i18next';
import { CommonTokensProps } from '.';
import ImageLogo from '../ImageLogo';

const CommonTokens = ({
  tokensToShow,
  tokenSelected,
  onClose,
  onSelectToken,
  showCommonTokens = true,
}: CommonTokensProps) => {
  const { t } = useTranslation();
  const traslationPath = 'common.tokenModal';

  const isSelected = (token: Token) => {
    return tokenSelected.symbol === token.symbol;
  };

  const handleSelectToken = (token: Token) => {
    if (onSelectToken && !isSelected(token))
      return onSelectToken(token, onClose);
  };

  const onHoverStyle = (token: Token) => {
    return {
      cursor: !isSelected(token) && 'pointer',
      opacity: isSelected(token) ? 'none' : '0.8',
    };
  };
  return tokensToShow && tokensToShow.length ? (
    <>
      {showCommonTokens ? (
        <Flex w="full" direction="column" mb="spacing05">
          <Text
            color="gray"
            mb="spacing01"
            fontWeight="400"
            ml="spacing03"
            fontSize="sm"
          >
            {t(`${traslationPath}.commomTokens`)}
          </Text>
          <HStack spacing="4px">
            {tokensToShow?.map(token => (
              <Flex
                opacity={isSelected(token) ? '0.6' : 1}
                _hover={onHoverStyle(token)}
                onClick={() => handleSelectToken(token)}
                key={token.address}
                borderRadius="4px"
                alignItems="center"
                justifyContent="center"
                w="100%"
                p="spacing02"
                bg="bgBoxLighter"
              >
                <ImageLogo symbol={token.symbol} size="24px" />
                <Text fontSize="sm">{token.symbol}</Text>
              </Flex>
            ))}
          </HStack>
        </Flex>
      ) : null}
    </>
  ) : null;
};

export default CommonTokens;
