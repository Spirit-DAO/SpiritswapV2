import { Heading } from 'app/components/Typography';
import { ReactComponent as BarChart } from 'app/assets/images/bar-chart.svg';
import { ReactComponent as Calculator } from 'app/assets/images/calculator.svg';
import { Props } from './TokenList.d';
import { StyledHeader, StyledWrapper, StyledIconButton } from './styles';
import ImageLogo from 'app/components/ImageLogo';
import { Flex } from '@chakra-ui/react';
import { ROICalculatorModal } from '../ROICalculatorModal';
import { useDisclosure } from '@chakra-ui/react';
import { openInNewTab } from 'app/utils/redirectTab';
import { V2IconBadge, V3IconBadge, X2IconBadge } from 'app/assets/icons';

const TokenList = ({
  tokens,
  title,
  hideTypeTitle,
  hideTypeIcons,
  invertTitleOrder,
  titleSmall,
  farmType,
  apr,
  type,
  rewardToken,
  lpAddress,
}: Props) => {
  const roiCalculatorDisclosure = useDisclosure();

  const onCalculatorClick = () => {
    roiCalculatorDisclosure.onOpen();
  };

  if (tokens?.length < 1 || tokens.length > 8) {
    return null;
  }

  const link = `https://analytics.spiritswap.finance/pair/${lpAddress}`;

  const tokenSymbols = title.split('+');

  const Version = () => {
    if (type === 'concentrated') {
      return <V3IconBadge w="42px" h="100%" />;
    } else {
      return <V2IconBadge w="35px" h="100%" />;
    }
  };

  return (
    <>
      <StyledWrapper
        style={{
          display: 'flex',
          flexDirection: invertTitleOrder ? 'column-reverse' : 'column',
          gap: '5px',
        }}
      >
        <StyledHeader>
          <Flex direction="row" justifyContent="space-between" w="full">
            <Flex gap="5px" h="35px" w="100%" alignItems="center">
              <Heading
                style={{
                  fontSize: titleSmall ? '17px' : '20px',
                  lineHeight: invertTitleOrder ? 1 : 'inherit',
                  marginRight: '5px',
                }}
                level={3}
              >
                {title}{' '}
              </Heading>
              {type === 'concentrated' &&
              lpAddress === '0xcfc1cbe6d81675719341c3175a34e6762548f79d' ? (
                <X2IconBadge w="35px" h="100%" />
              ) : null}
              <Version />
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
