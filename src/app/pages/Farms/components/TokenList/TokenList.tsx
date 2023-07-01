import { Heading } from 'app/components/Typography';
import { ReactComponent as BarChart } from 'app/assets/images/bar-chart.svg';
import { ReactComponent as Calculator } from 'app/assets/images/calculator.svg';
import { Props } from './TokenList.d';
import {
  StyledHeader,
  StyledWrapper,
  StyledIconButton,
  TypeText,
} from './styles';
import ImageLogo from 'app/components/ImageLogo';
import { Flex } from '@chakra-ui/react';
import { ROICalculatorModal } from '../ROICalculatorModal';
import { useDisclosure } from '@chakra-ui/react';
import { openInNewTab } from 'app/utils/redirectTab';

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
    const title = type === 'concentrated' ? 'V3' : 'V2';
    const color = type === 'concentrated' ? '#1D9384' : 'white';

    if (type === 'concentrated') {
      return <TypeText text={title} />;
    } else {
      return (
        <span
          style={{
            color: color,
            fontSize: '18px',
            fontWeight: 500,
          }}
        >
          {title}
        </span>
      );
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
            <Flex gap="8px" w="100%" alignItems="center">
              <Heading
                style={{
                  fontSize: titleSmall ? '17px' : '20px',
                  lineHeight: invertTitleOrder ? 1 : 'inherit',
                }}
                level={2}
              >
                {title}{' '}
              </Heading>
              {type === 'concentrated' &&
              lpAddress === '0xcfc1cbe6d81675719341c3175a34e6762548f79d' ? (
                <TypeText
                  text="X2"
                  disabledAnimation
                  style={{
                    marginRight: '10px',
                  }}
                />
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
