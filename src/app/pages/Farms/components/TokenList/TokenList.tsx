import { useTranslation } from 'react-i18next';
import { Heading } from 'app/components/Typography';
import { ReactComponent as BarChart } from 'app/assets/images/bar-chart.svg';
import { ReactComponent as Calculator } from 'app/assets/images/calculator.svg';
import { Props } from './TokenList.d';
import {
  StyledHeader,
  StyledWrapper,
  StyledH3,
  StyledIconButton,
} from './styles';
import ImageLogo from 'app/components/ImageLogo';
import { Flex } from '@chakra-ui/react';
import { ROICalculatorModal } from '../ROICalculatorModal';
import { useDisclosure } from '@chakra-ui/react';
import { openInNewTab } from 'app/utils/redirectTab';

const TokenList = ({
  tokens,
  boosted,
  title,
  ecosystem,
  hideTypeTitle,
  hideTypeIcons,
  invertTitleOrder,
  titleSmall,
  apr,
  type,
  rewardToken,
  farmType,
  lpAddress,
}: Props) => {
  const { t } = useTranslation();
  const roiCalculatorDisclosure = useDisclosure();

  const onCalculatorClick = () => {
    roiCalculatorDisclosure.onOpen();
  };

  if (tokens?.length < 1 || tokens.length > 8) {
    return null;
  }

  const link = `https://analytics.spiritswap.finance/pair/${lpAddress}`;

  const tokenSymbols = title.split('+');

  return (
    <>
      <StyledWrapper
        style={{
          display: 'flex',
          flexDirection: invertTitleOrder ? 'column-reverse' : 'column',
          gap: '5px',
          padding: '5px',
        }}
      >
        <StyledHeader>
          <Flex direction="row" justifyContent="space-between" w="full">
            <Flex direction="column">
              {!hideTypeTitle && <StyledH3 level={4}>{type}</StyledH3>}
              <Heading
                style={{
                  fontSize: titleSmall ? '17px' : '20px',
                  lineHeight: invertTitleOrder ? 1 : 'inherit',
                }}
                level={2}
              >
                {title}
              </Heading>
            </Flex>
            {!hideTypeIcons && (
              <Flex>
                <StyledIconButton
                  variant="transparent"
                  icon={<Calculator />}
                  onClick={onCalculatorClick}
                />
                <StyledIconButton
                  variant="transparent"
                  icon={<BarChart />}
                  onClick={() => openInNewTab(link)}
                />
              </Flex>
            )}
          </Flex>
        </StyledHeader>
        <Flex>
          {tokenSymbols.map(symbol => (
            <ImageLogo
              size="32px"
              symbol={symbol.trim()}
              key={`farmLogo-${symbol}`}
            />
          ))}
        </Flex>
      </StyledWrapper>

      {roiCalculatorDisclosure.isOpen && (
        <ROICalculatorModal
          farmName={title}
          apr={parseFloat(apr?.toString().replaceAll(',', '') ?? '0')}
          rewardTokenSymbol={rewardToken}
          {...roiCalculatorDisclosure}
        />
      )}
    </>
  );
};

export default TokenList;
