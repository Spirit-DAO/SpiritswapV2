import { colors } from 'theme/base/color';
import { InSpiritIcon } from 'app/layouts/TopBar/styles';
import { IconButton } from 'app/components/IconButton';
import { Text, Flex } from '@chakra-ui/react';
import { GreeBoxProps } from '..';
import { useNavigate } from 'react-router-dom';

const GreenBox = ({ title, buttonTitle, navigateTo }: GreeBoxProps) => {
  const navigate = useNavigate();
  return (
    <Flex
      bg="ciTrans15"
      w="full"
      justifyContent="space-between"
      align="center"
      p="spacing03"
      border={`1px solid ${colors.ci}`}
      borderRadius="8px"
    >
      <Text fontSize="xl">{title}</Text>

      <IconButton
        icon={<InSpiritIcon />}
        label={buttonTitle}
        variant="inverted"
        onClick={() => navigate(navigateTo)}
      />
    </Flex>
  );
};

export default GreenBox;
