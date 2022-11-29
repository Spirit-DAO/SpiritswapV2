import { useTranslation } from 'react-i18next';
import { Button, Collapse, Flex, Image } from '@chakra-ui/react';
import { AboutSectionTitleSpan } from './styles';
import { Grid, GridItem } from '@chakra-ui/react';
import { PartnersWrapper } from './styles';
import { PartnersTitleIcon } from 'app/assets/icons';
import { useState } from 'react';
import { Link } from '@chakra-ui/react';

interface PartnerItem {
  icon: string;
  url: string;
}

interface PartnersProps {
  isMobile: boolean;
  partnerItems: PartnerItem[];
}

const PartnersSection = ({ isMobile, partnerItems }: PartnersProps) => {
  const { t } = useTranslation();
  const translationPath = 'home.partner';
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  const buttonText = show
    ? t(`${translationPath}.showLess`)
    : t(`${translationPath}.showMore`);

  return (
    <PartnersWrapper>
      <Flex justifyContent="center" align="center" mb="spacing09">
        <PartnersTitleIcon
          h={isMobile ? '24px' : '40xp'}
          w={isMobile ? '24px' : '40xp'}
          mr="spacing04"
        />
        <AboutSectionTitleSpan>
          {t(`${translationPath}.partners`)}
        </AboutSectionTitleSpan>
      </Flex>

      <Collapse startingHeight={isMobile ? 272 : 208} in={show} animateOpacity>
        <Grid
          templateRows={isMobile ? 'repeat(3, 1fr)' : 'repeat(auto, 1fr)'}
          templateColumns={isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)'}
          rowGap="spacing10"
          justifyContent="center"
        >
          {partnerItems.map(item => {
            return (
              <GridItem key={item.icon}>
                <Flex justifyContent="center">
                  <Link href={item.url} target="_blank">
                    <Image
                      _hover={{ opacity: '75%', cursor: 'pointer' }}
                      h={isMobile ? '48px' : '72px'}
                      w={isMobile ? '48px' : '72px'}
                      src={item.icon}
                    />
                  </Link>
                </Flex>
              </GridItem>
            );
          })}
        </Grid>
      </Collapse>

      <Flex justifyContent="center" mt="spacing09">
        <Button variant="inverted" onClick={handleToggle}>
          {buttonText}
        </Button>
      </Flex>
    </PartnersWrapper>
  );
};

export default PartnersSection;
