import { FC } from 'react';
import { Heading, Text, Button, VStack, ButtonGroup } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Props } from './Help.d';
import { ReactComponent as QuestionIcon } from 'app/assets/images/question-circle.svg';
import { Suffix } from 'app/components/Suffix';
import { StyledListItem, StyledTitleWrapper } from './styles';
import {
  LockingIcon,
  ClockCoinsIcon,
  SparklesIcon,
  BusinessBarsIcon,
  MenuInspirit,
} from 'app/assets/icons';
import { LightBoxModal } from 'app/components/LightBoxModal';

const Help: FC<Props> = ({ onGenerate }: Props) => {
  const { t } = useTranslation();
  const translationPath = 'inSpirit.help';

  return (
    <VStack align="start" spacing="spacing06">
      <StyledListItem>
        <MenuInspirit w="32px" h="32px" />
        <StyledTitleWrapper>
          <Suffix suffix={<QuestionIcon />}>
            <Heading as="h2" fontSize="xl" lineHeight="40px">
              {t(`${translationPath}.inspirit`)}
            </Heading>
          </Suffix>
        </StyledTitleWrapper>
      </StyledListItem>

      <StyledListItem>
        <ClockCoinsIcon
          w="32px"
          h="32px"
          p="4px"
          bgColor="ciTrans15"
          borderRadius="md"
        />
        <div>
          <Heading as="h4" fontSize="base" lineHeight="23px">
            {t(`${translationPath}.inspiritQuestion`)}
          </Heading>
          <Text fontSize="xs" lineHeight="17px">
            {t(`${translationPath}.inspiritExplanation`)}
          </Text>
        </div>
      </StyledListItem>

      <StyledListItem>
        <LockingIcon
          w="32px"
          h="32px"
          p="4px"
          bgColor="ciTrans15"
          borderRadius="md"
        />
        <div>
          <Heading as="h4" fontSize="base" lineHeight="23px">
            {t(`${translationPath}.voteLockingQuestion`)}
          </Heading>
          <Text fontSize="xs" lineHeight="17px">
            {t(`${translationPath}.votelockingExplanation`)}
          </Text>
        </div>
      </StyledListItem>

      <StyledListItem>
        <SparklesIcon
          w="32px"
          h="32px"
          p="4px"
          color="ci"
          bgColor="ciTrans15"
          borderRadius="md"
        />
        <div>
          <Heading as="h4" fontSize="base" lineHeight="23px">
            {t(`${translationPath}.lockSpiritQuestion`)}
          </Heading>
          <Text fontSize="xs" lineHeight="17px">
            {t(`${translationPath}.lockspiritExplanation`)}
          </Text>
        </div>
      </StyledListItem>

      <StyledListItem>
        <BusinessBarsIcon
          w="32px"
          h="32px"
          p="4px"
          bgColor="ciTrans15"
          borderRadius="md"
        />
        <div>
          <Heading as="h4" fontSize="base" lineHeight="23px">
            {t(`${translationPath}.endPeriodQuestion`)}
          </Heading>
          <Text fontSize="xs" lineHeight="17px">
            {t(`${translationPath}.endPeriodExplanation`)}
          </Text>
        </div>
      </StyledListItem>
      <ButtonGroup mt="spacing06" w="full">
        {/* LightBoxModal is a button that open up slider/carousel modal */}
        <LightBoxModal id={'inSpirit'} width={'50%'} variant={'secondary'} />

        <Button w="50%" onClick={onGenerate}>
          {t(`${translationPath}.generateInspirit`)}
        </Button>
      </ButtonGroup>
    </VStack>
  );
};

export default Help;
