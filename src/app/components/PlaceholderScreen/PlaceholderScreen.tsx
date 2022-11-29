import * as React from 'react';
import { Button, Center, Flex, Text } from '@chakra-ui/react';
import { Props } from './PlaceholderScreen.d';

const PlaceholderScreen = ({ title, text, buttons, Image }: Props) => {
  const handleClick = button => button.action();
  const renderButtons = () =>
    buttons.map(button => {
      const { Icon } = button;
      return (
        <Button
          key={`error_button_${button.label.trim()}`}
          variant={button.type}
          fontWeight="800"
          marginX="5px"
          onClick={() => handleClick(button)}
        >
          {button.label}
          {Icon ? <Icon /> : null}
        </Button>
      );
    });

  return (
    <>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        overflowX="hidden"
      >
        <Flex flexDirection="column">
          <Center w="100vw">
            <Image />
          </Center>
          <Center marginTop="15px">
            <Text fontSize="24px" color="teal.200" fontWeight="800">
              {title}
            </Text>
          </Center>
          <Center>
            <Text
              textAlign="center"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </Center>
        </Flex>
        <Flex>
          <Center w="100%" marginY="30px">
            {renderButtons()}
          </Center>
        </Flex>
      </Flex>
    </>
  );
};

export default PlaceholderScreen;
