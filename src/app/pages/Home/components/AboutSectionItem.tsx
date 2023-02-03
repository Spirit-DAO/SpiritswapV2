import { ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { onClickUrl, openInSelfTab } from 'app/utils/redirectTab';
import { Button } from 'app/components/Button';
import {
  AboutSectionContentWrapper,
  AboutSectionTitleWrapper,
  AboutSectionTitleIcon,
  AboutSectionTitleSpan,
  AboutSectionButtonWrapper,
  AboutSectionImageWrapper,
} from './styles';
import { useNavigate } from 'app/hooks/Routing';
import { LightBoxModal } from 'app/components/LightBoxModal';
import { StyledWalletDescription } from '../styles';
import { Box, Flex } from '@chakra-ui/react';
import browser from 'browser-detect';
import { Animation } from 'app/components/Animations';
import useMobile from 'utils/isMobile';
export interface AboutSectionImageWrapperProps {
  index: number;
}

interface ItemProps {
  id: string;
  index: number;
  titleIcon: ReactNode;
  translationPath: string;
  buttonNavPath: { path: string; targetSelf?: boolean };
  image: string;
  animation: JSX.Element;
}

const AboutSectionItem = ({
  id,
  index,
  titleIcon,
  translationPath,
  buttonNavPath,
  image,
  animation,
}: ItemProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useMobile();
  const { name: browserName } = browser();
  const isSafariBrowser = browserName === 'safari';

  const navigateToPath = () => {
    if (buttonNavPath?.targetSelf) {
      openInSelfTab(buttonNavPath?.path);
    }
    buttonNavPath?.path.includes('http')
      ? onClickUrl(buttonNavPath?.path)
      : navigate(buttonNavPath?.path);
  };

  const imageToShow = () => {
    if (isMobile || isSafariBrowser) {
      return (
        <AboutSectionImageWrapper
          index={index}
          src={image}
          alt={`about-image-${index}`}
        />
      );
    }

    return Animation(animation, image);
  };

  const Wrapper = useCallback(
    ({ children }) => {
      if (isMobile) {
        return (
          <Flex flexDirection="column-reverse" gap="40px" mt="96px">
            {children}
          </Flex>
        );
      }

      return (
        <Box
          display="inline-grid"
          gridTemplateColumns="repeat(2, 1fr)"
          alignItems="center"
          gap="16px"
          mt="96px"
        >
          {children}
        </Box>
      );
    },
    [isMobile],
  );

  return (
    <Wrapper>
      {!isMobile && index % 2 !== 0 && imageToShow()}
      <AboutSectionContentWrapper>
        <AboutSectionTitleWrapper>
          <AboutSectionTitleIcon
            size={isMobile ? 24 : 40}
            icon={titleIcon}
            clickable={false}
          />
          <AboutSectionTitleSpan>
            {t(`${translationPath}.title`)}
          </AboutSectionTitleSpan>
        </AboutSectionTitleWrapper>
        <StyledWalletDescription
          style={{ fontWeight: '400', lineHeight: '23.12px' }}
          level={isMobile ? 5 : 4}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: t(`${translationPath}.description`),
            }}
          />
        </StyledWalletDescription>
        <AboutSectionButtonWrapper>
          <Button variant="primary" size="small" onClick={navigateToPath}>
            {t(`${translationPath}.button`)}
          </Button>
          <LightBoxModal id={id} width={'auto'} variant={'inverted'} />
        </AboutSectionButtonWrapper>
      </AboutSectionContentWrapper>
      {isMobile ? imageToShow() : index % 2 === 0 && imageToShow()}
    </Wrapper>
  );
};

export default AboutSectionItem;
