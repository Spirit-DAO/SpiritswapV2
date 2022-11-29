import { Props } from './CardHeader.d';
import { Button, Flex } from '@chakra-ui/react';

import {
  ApeIcon,
  BusinessIcon,
  FarmIcon,
  BridgeIcon,
  MoneyHandIcon,
  QuestionIcon,
  BarChartIcon,
  DashBoardIcon,
  MenuInspirit,
  VotingInSpirit,
  EditIcon,
  PositionsIcon,
  BackIcon,
  SwapTokenIcon,
  CoinsIcon,
  MoneyArrowDownIcon,
  CalculatorIcon,
  MartialArtsSwordFencingIcon,
} from 'app/assets/icons';

import { StyledIcon } from './styles';
import { QuestionHelper } from '../QuestionHelper';
import { Heading } from '../Typography';
import {
  APE,
  POSITIONS,
  ARROWBACK,
  SWAP,
  FARMS,
  BRIDGE,
  LIQUIDITY,
  CHART,
  STATS,
  DASHBOARD,
  INSPIRIT,
  VOTING,
  EDITING,
  TOKENS,
  BRIBE,
  CALCULATOR,
  SPIRITWARS,
} from 'constants/icons';

const CardHeader = ({
  id,
  title,
  hidebackground,
  hideQuestionIcon,
  helperContent,
  onIconClick,
  ...props
}: Props) => {
  const Icon = () => {
    switch (id) {
      case APE:
        return <ApeIcon />;
      case POSITIONS:
        return <PositionsIcon />;
      case ARROWBACK:
        return <BackIcon />;
      case SWAP:
        return <SwapTokenIcon />;
      case FARMS:
        return <FarmIcon />;
      case BRIDGE:
        return <BridgeIcon />;
      case LIQUIDITY:
        return <MoneyHandIcon />;
      case STATS:
        return <BarChartIcon />;
      case DASHBOARD:
        return <DashBoardIcon />;
      case INSPIRIT:
        return <MenuInspirit />;
      case VOTING:
        return <VotingInSpirit />;
      case CHART:
        return <BusinessIcon />;
      case EDITING:
        return <EditIcon />;
      case TOKENS:
        return <CoinsIcon />;
      case BRIBE:
        return <MoneyArrowDownIcon />;
      case CALCULATOR:
        return <CalculatorIcon />;
      case SPIRITWARS:
        return <MartialArtsSwordFencingIcon />;
      default:
        return <QuestionIcon />;
    }
  };
  return (
    <Flex align="center" sx={{ gap: '0.3rem' }}>
      {id !== '' && (
        <Button
          background="none"
          _active={{ border: 'none' }}
          border="none"
          p="0"
          minW="0"
          outline="none"
          onClick={onIconClick}
          cursor="default"
          _hover={{ background: 'none' }}
        >
          {!!onIconClick ? (
            <StyledIcon
              icon={Icon()}
              size="xl"
              hideBackground={hidebackground}
              clickable={!!onIconClick}
            />
          ) : (
            Icon()
          )}
        </Button>
      )}
      <Heading level={2}>{title}</Heading>
      {!hideQuestionIcon && (
        <div>
          <QuestionHelper
            title={helperContent?.title || ''}
            text={helperContent?.text || ''}
            importantText={helperContent?.importantText}
            showDocs={helperContent?.showDocs}
          />
        </div>
      )}
    </Flex>
  );
};
export default CardHeader;
