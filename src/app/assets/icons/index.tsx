import { Icon, IconButton, Image } from '@chakra-ui/react';
import { colors } from 'theme/base/color';
import { ReactComponent as ApeMode } from 'app/assets/images/apemode.svg';
import { ReactComponent as Bridge } from 'app/assets/images/bridge.svg';
import { ReactComponent as Question } from 'app/assets/images/question-3-circle.svg';
import { ReactComponent as ArrowDownCircle } from 'app/assets/images/arrow-down-circle.svg';
import { ReactComponent as ArrowDown } from 'app/assets/images/arrow-down.svg';
import { ReactComponent as ArrowRight } from 'app/assets/images/arrow-right.svg';
import { ReactComponent as Swap } from 'app/assets/images/swap.svg';
import { ReactComponent as Back } from 'app/assets/images/back.svg';
import { ReactComponent as Adjust } from 'app/assets/images/adjust.svg';
import { ReactComponent as Backspace } from 'app/assets/images/backspace-delete-button.svg';
import { ReactComponent as BarChart } from 'app/assets/images/bar-chart.svg';
import { ReactComponent as CaretDown } from 'app/assets/images/caret-down.svg';
import { ReactComponent as Business } from 'app/assets/images/business-product.svg';
import { ReactComponent as ChevronDown } from 'app/assets/images/chevron-down.svg';
import { ReactComponent as ChevronSide } from 'app/assets/images/chevron-side.svg';
import { ReactComponent as ChevronUp } from 'app/assets/images/chevron-up.svg';
import { ReactComponent as Close } from 'app/assets/images/close.svg';
import { ReactComponent as Coins } from 'app/assets/images/coins.svg';
import { ReactComponent as Search } from 'app/assets/images/search-loupe.svg';
import { ReactComponent as FarmsIcon } from 'app/assets/images/farm.svg';
import { ReactComponent as MoneyHand } from 'app/assets/images/money-with-hand-small.svg';
import { ReactComponent as ArrowRight1 } from 'app/assets/images/arrow-right-1.svg';
import { ReactComponent as SoulyWhite } from 'app/assets/images/souly-white.svg';
import { ReactComponent as ClockCoins } from 'app/assets/images/clock-coins.svg';
import { ReactComponent as Locking } from 'app/assets/images/locking.svg';
import { ReactComponent as Sparkles } from 'app/assets/images/sparkles.svg';
import { ReactComponent as BusinessBars } from 'app/assets/images/business-bars.svg';
import { ReactComponent as ArrowLeft } from 'app/assets/images/arrow-left.svg';
import { ReactComponent as Dashboard } from 'app/assets/images/inSPIRIT-dashboard.svg';
import { ReactComponent as inSpirit } from 'app/assets/images/menu-inspirit.svg';
import { ReactComponent as voting } from 'app/assets/images/voting.svg';
import { ReactComponent as Dolar } from 'app/assets/images/dolaricon.svg';
import { ReactComponent as Link } from 'app/assets/images/link.svg';
import { ReactComponent as SlippageSettings } from 'app/assets/images/slippageSettings.svg';
import { ReactComponent as Pending } from 'app/assets/images/pending.svg';
import { ReactComponent as Success } from 'app/assets/images/success.svg';
import { ReactComponent as Error } from 'app/assets/images/error.svg';
import { ReactComponent as Settings } from 'app/assets/images/settings.svg';
import { ReactComponent as Setting } from 'app/assets/images/setting.svg';
import { ReactComponent as Ghost } from 'app/assets/images/ghost-circle.svg';
import { ReactComponent as WalletInput } from 'app/assets/images/wallet-input.svg';
import { ReactComponent as TimerClock } from 'app/assets/images/timer-clock.svg';
import { ReactComponent as Warning } from 'app/assets/images/warning.svg';
import { ReactComponent as CircleWarning } from 'app/assets/images/circle-warning.svg';
import { ReactComponent as Checkmark } from 'app/assets/images/checkmark.svg';
import { ReactComponent as Rocket } from 'app/assets/images/rocket.svg';
import { ReactComponent as EditSquare } from 'app/assets/images/edit-square.svg';
import { ReactComponent as Cancel } from 'app/assets/images/cancel.svg';
import { ReactComponent as Positions } from 'app/assets/images/positionsIcon.svg';
import { ReactComponent as SwapToken } from 'app/assets/images/swap-token.svg';
import { ReactComponent as DotsMenu } from 'app/assets/images/dots-menu.svg';
import { ReactComponent as DotsMenuOutline } from 'app/assets/images/dots-outline.svg';
import { ReactComponent as AdjustLeverage } from 'app/assets/images/adjust.svg';
import SpiritLogo from 'app/assets/images/logos/spiritswap.png';
import { ReactComponent as MoneyArrowDown } from 'app/assets/images/money-arrow-down.svg';
import { ReactComponent as CloseIconSvg } from 'app/assets/images/closeApe.svg';
import { ReactComponent as addLiquidityToast } from 'app/assets/images/addLiquidityToast.svg';
import { ReactComponent as farmIconToast } from 'app/assets/images/farmIconToast.svg';
import { ReactComponent as CalculatorIconSvg } from 'app/assets/images/calculator.svg';
import { ReactComponent as V1 } from 'app/assets/images/v1.svg';
import { ReactComponent as MartialArtsSwordFencing } from 'app/assets/images/martial-arts-sword-fencing.svg';
import { ReactComponent as Suggestion } from 'app/assets/images/Suggestion.svg';
import { ReactComponent as TransactionFlowStart } from 'app/assets/images/transaction-flow-start.svg';
import { ReactComponent as TransactionFlowLoading } from 'app/assets/images/transaction-flow-loading.svg';
import { ReactComponent as TransactionFlowRefresh } from 'app/assets/images/transaction-flow-refresh.svg';
import { ReactComponent as TransactionFlowSuccess } from 'app/assets/images/transaction-flow-success.svg';
import { ReactComponent as TransactionFlowFailed } from 'app/assets/images/transaction-flow-failed.svg';
import { ReactComponent as TransactionFlowUpcoming } from 'app/assets/images/transaction-flow-upcoming.svg';
import { ReactComponent as WalletExit } from 'app/assets/images/wallet-exit.svg';
import { ReactComponent as PartnersIcon } from 'app/assets/images/partnersIcon.svg';
import soullyLogo from '../images/logos/soully-logo.png';
import { ReactComponent as ArrowDiagonal } from '../images/arrow-diagonal.svg';
import { ReactComponent as Analytics } from 'app/assets/images/analytics.svg';
import { ReactComponent as LendAndBorrow } from 'app/assets/images/lend-and-borrow.svg';
import { ReactComponent as DSynths } from 'app/assets/images/dSynths.svg';
import { ReactComponent as Docs } from 'app/assets/images/docs.svg';
import { ReactComponent as Governance } from 'app/assets/images/governance.svg';
import { ReactComponent as NFTs } from 'app/assets/images/nft.svg';
import { ReactComponent as BuyCrypto } from 'app/assets/images/buy-cryp.svg';
import { elementEnable } from 'theme/thememethods';
import { ReactComponent as WarningNew } from 'app/assets/images/warning-new.svg';
import { ReactComponent as PlusCircleIcon } from 'app/assets/images/your-liquidity.svg';
import { ReactComponent as CompoundIconImage } from 'app/assets/images/compound.svg';
import { ReactComponent as zokyoAudit } from 'app/assets/images/zokyoAudit.svg';
import { ReactComponent as PeckShieldAudit } from 'app/assets/images/peckShieldAudit.svg';
import { ReactComponent as ParaSwap } from 'app/assets/images/paraSwap.svg';

const { ci, grayDarker, danger, warning } = colors;
const iconSize = {
  xs: '12px',
  sm: '16px',
  md: '24px',
  lg: '50px',
};

const { md } = iconSize;

export const ZokyoAuditLogo = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={zokyoAudit} color={color} w={w} h={h} />;
};

export const PeckShiledAuditLogo = ({
  w = md,
  h = md,
  color = ci,
  ...rest
}) => {
  return <Icon {...rest} as={PeckShieldAudit} color={color} w={w} h={h} />;
};
export const ParaSwapLogo = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ParaSwap} color={color} w={w} h={h} />;
};

export const SuggestionIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Suggestion} color={color} w={w} h={h} />;
};

export const PartnersTitleIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={PartnersIcon} color={color} w={w} h={h} />;
};

export const TFStart = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={TransactionFlowStart} color={color} w={w} h={h} />;
};

export const TFLoading = ({ w = md, h = md, color = ci, ...rest }) => {
  return (
    <Icon {...rest} as={TransactionFlowLoading} color={color} w={w} h={h} />
  );
};
export const TFSuccess = ({ w = md, h = md, color = ci, ...rest }) => {
  return (
    <Icon {...rest} as={TransactionFlowSuccess} color={color} w={w} h={h} />
  );
};
export const TFFailed = ({ w = md, h = md, color = ci, ...rest }) => {
  return (
    <Icon {...rest} as={TransactionFlowFailed} color={color} w={w} h={h} />
  );
};
export const TFUpcoming = ({ w = md, h = md, color = ci, ...rest }) => {
  return (
    <Icon {...rest} as={TransactionFlowUpcoming} color={color} w={w} h={h} />
  );
};
export const TFRefresh = ({ w = md, h = md, color = ci, ...rest }) => {
  return (
    <Icon {...rest} as={TransactionFlowRefresh} color={color} w={w} h={h} />
  );
};

export const AddLiquidityNotification = ({
  w = md,
  h = md,
  color = ci,
  ...rest
}) => {
  return <Icon {...rest} as={addLiquidityToast} color={color} w={w} h={h} />;
};

export const FarmIconNotification = ({
  w = md,
  h = md,
  color = grayDarker,
  ...rest
}) => {
  return <Icon {...rest} as={farmIconToast} color={color} w={w} h={h} />;
};

export const CancelIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Cancel} color={color} w={w} h={h} />;
};

export const GhostIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Ghost} color={color} w={w} h={h} />;
};

export const SettingsIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Settings} color={color} w={w} h={h} />;
};
export const SettingIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Setting} color={color} w={w} h={h} />;
};

export const WalletIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={WalletInput} color={color} w={w} h={h} />;
};

export const WalletExitIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={WalletExit} w={w} h={h} color={color} />;
};

export const VotingInSpirit = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={voting} color={color} w={w} h={h} />;
};

export const MenuInspirit = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={inSpirit} color={color} w={w} h={h} />;
};

export const DashBoardIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Dashboard} color={color} w={w} h={h} />;
};

export const MoneyHandIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={MoneyHand} color={color} w={w} h={h} />;
};

export const FarmIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={FarmsIcon} color={color} w={w} h={h} />;
};

export const ApeIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ApeMode} color={color} w={w} h={h} />;
};

export const CoinsIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Coins} color={color} w={w} h={h} />;
};

export const ChevronDownIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ChevronDown} color={color} w={w} h={h} />;
};

export const ChevronSideIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ChevronSide} color={color} w={w} h={h} />;
};

export const ChevronUpIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ChevronUp} color={color} w={w} h={h} />;
};

export const AdjustIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Adjust} color={color} w={w} h={h} />;
};

export const SlippageIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={SlippageSettings} color={color} w={w} h={h} />;
};

export const CaretDownIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={CaretDown} color={color} w={w} h={h} />;
};

export const BusinessIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Business} color={color} w={w} h={h} />;
};

export const BarChartIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={BarChart} color={color} w={w} h={h} />;
};

export const BridgeIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Bridge} color={color} w={w} h={h} />;
};

export const EditIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={EditSquare} color={color} w={w} h={h} />;
};
export const CloseIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={CloseIconSvg} color={color} w={w} h={h} />;
};
export const CalculatorIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={CalculatorIconSvg} color={color} w={w} h={h} />;
};

export const QuestionIcon = ({
  w = md,
  h = md,
  color = grayDarker,
  ...rest
}) => {
  return <Icon {...rest} as={Question} color={color} w={w} h={h} />;
};

export const ArrowDownCircleIcon = ({
  w = md,
  h = md,
  color = ci,
  ...rest
}) => {
  return <Icon {...rest} as={ArrowDownCircle} color={color} w={w} h={h} />;
};

export const ArrowDownIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ArrowDown} color={color} w={w} h={h} />;
};
export const ArrowRightIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ArrowRight} color={color} w={w} h={h} />;
};

export const ArrowRightIcon1 = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ArrowRight1} color={color} w={w} h={h} />;
};

export const ArrowLeftIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ArrowLeft} color={color} w={w} h={h} />;
};

export const LinkIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Link} color={color} w={w} h={h} />;
};

export const SearchIcon = ({ w = md, h = md, color = grayDarker, ...rest }) => {
  return <Icon {...rest} as={Search} color={color} w={w} h={h} />;
};

export const DolarIcon = ({ w = md, h = md, color = grayDarker, ...rest }) => {
  return <Icon {...rest} as={Dolar} color={color} w={w} h={h} />;
};

export const SuccessIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Success} color={color} w={w} h={h} />;
};

export const PendingIcon = ({ w = md, h = md, color = warning, ...rest }) => {
  return <Icon {...rest} as={Pending} color={color} w={w} h={h} />;
};

export const ErrorIcon = ({ w = md, h = md, color = danger, ...rest }) => {
  return <Icon {...rest} as={Error} color={color} w={w} h={h} />;
};
export const MartialArtsSwordFencingIcon = ({
  w = md,
  h = md,
  color = ci,
  ...rest
}) => {
  return (
    <Icon {...rest} as={MartialArtsSwordFencing} color={color} w={w} h={h} />
  );
};

export const AdjustLeverageIcon = ({
  w = md,
  h = md,
  color = danger,
  ...rest
}) => {
  return <Icon {...rest} as={AdjustLeverage} color={color} w={w} h={h} />;
};

export const SwapIconButton = ({
  horizontalRotateOnMdScreenSize = true,
  showConfirmModal = false,
  ...rest
}) => {
  const transformStyle = horizontalRotateOnMdScreenSize
    ? { base: 'rotate(90deg)', md: 'rotate(0deg)' }
    : { base: 'rotate(90deg)' };

  return (
    <IconButton
      {...rest}
      variant="iconButton"
      icon={<Swap />}
      color="ci"
      aria-label="Swap token"
      transform={transformStyle}
      _hover={elementEnable(!showConfirmModal)}
    />
  );
};

export const BackIconButton = ({ ...rest }) => {
  return (
    <IconButton
      {...rest}
      variant="iconButton"
      color="grayDarker"
      icon={<Back />}
      aria-label="Back"
    />
  );
};

export const BackspaceIconButton = ({ ...rest }) => {
  return (
    <IconButton
      {...rest}
      variant="iconButton"
      icon={<Backspace />}
      color="grayDarker"
      aria-label="Delete"
    />
  );
};

export const SettingsIconButton = ({ ...rest }) => {
  return (
    <IconButton
      {...rest}
      variant="iconButton"
      icon={<Settings />}
      color="ci"
      aria-label="settings"
    />
  );
};

export const CloseIconButton = ({ ...rest }) => {
  return (
    <IconButton
      {...rest}
      variant="iconButton"
      icon={<Close width="20px" height="20px" />}
      color="grayDarker"
      aria-label="Close"
    />
  );
};

export const ChartIconButton = ({ ...rest }) => {
  return (
    <IconButton
      {...rest}
      variant="iconButton"
      icon={<Business />}
      color="ci"
      aria-label="ChartIconButton"
    />
  );
};
export const QuestionIconButton = ({ ...rest }) => {
  return (
    <IconButton
      {...rest}
      variant="iconButton"
      icon={<Question />}
      color="grayDarker"
      aria-label="Tooltip"
    />
  );
};

export const SoulyWhiteIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={SoulyWhite} color={color} w={w} h={h} />;
};

export const ClockCoinsIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={ClockCoins} color={color} w={w} h={h} />;
};

export const LockingIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Locking} color={color} w={w} h={h} />;
};

export const SparklesIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Sparkles} color={color} w={w} h={h} />;
};

export const BusinessBarsIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={BusinessBars} color={color} w={w} h={h} />;
};

export const TimerClockIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={TimerClock} color={color} w={w} h={h} />;
};

export const WarningIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Warning} color={color} w={w} h={h} />;
};

export const CircleWarningIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={CircleWarning} color={color} w={w} h={h} />;
};

export const CheckmarkIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Checkmark} color={color} w={w} h={h} />;
};

export const RocketIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Rocket} color={color} w={w} h={h} />;
};

export const PositionsIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Positions} color={color} w={w} h={h} />;
};

export const BackIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={Back} color={color} w={w} h={h} />;
};

export const SwapTokenIcon = ({ w = md, h = md, color = ci, ...rest }) => {
  return <Icon {...rest} as={SwapToken} color={color} w={w} h={h} />;
};

export const DotIcon = ({ w = md, h = md, color = grayDarker, ...rest }) => {
  return <Icon {...rest} as={DotsMenu} color={color} w={w} h={h} />;
};
export const DotOutlineIcon = ({
  w = md,
  h = md,
  color = grayDarker,
  ...rest
}) => {
  return <Icon {...rest} as={DotsMenuOutline} color={color} w={w} h={h} />;
};

export const SpiritDesktopIcon = ({ w = md, h = md, ...rest }) => {
  return <Image src={SpiritLogo} w="50px" ml="15px" />;
};

export const SpiritMobileIcon = ({ ...rest }) => {
  return <Image src={SpiritLogo} w="38px" ml="10px" py="10px" />;
};

export const WarningNewIcon = ({ w = md, h = md, ...rest }) => {
  return <Icon {...rest} as={WarningNew} w={w} h={h} />;
};
export const MoneyArrowDownIcon = ({ ...rest }) => {
  return <Icon {...rest} as={MoneyArrowDown} w="full" h="full" />;
};

export const SoullyIcon = ({ size = '24px' }) => {
  return <Image src={soullyLogo} w={size} h={size} />;
};

export const V1Icon = ({ ...rest }) => {
  return <Icon {...rest} as={V1} w="full" h="full" />;
};
export const ArrowDiagonalIcon = ({ w = md, h = md, ...rest }) => {
  return <Icon {...rest} as={ArrowDiagonal} w={w} h={h} />;
};

export const AnalyticsIcon = ({ w = md, h = md, color = 'ci', ...rest }) => {
  return <Icon {...rest} as={Analytics} w={w} h={h} color={color} />;
};
export const LendAndBorrowIcon = ({
  w = md,
  h = md,
  color = 'ci',
  ...rest
}) => {
  return <Icon {...rest} as={LendAndBorrow} w={w} h={h} color={color} />;
};
export const DSynthsIcon = ({ w = md, h = md, color = 'ci', ...rest }) => {
  return <Icon {...rest} as={DSynths} w={w} h={h} color={color} />;
};
export const DocsIcon = ({ w = md, h = md, color = 'ci', ...rest }) => {
  return <Icon {...rest} as={Docs} w={w} h={h} color={color} />;
};
export const GovernanceIcon = ({ w = md, h = md, color = 'ci', ...rest }) => {
  return <Icon {...rest} as={Governance} w={w} h={h} color={color} />;
};
export const NFTIcon = ({ w = md, h = md, color = 'ci', ...rest }) => {
  return <Icon {...rest} as={NFTs} w={w} h={h} color={color} />;
};
export const BuyCryptoIcon = ({ w = md, h = md, color = 'ci', ...rest }) => {
  return <Icon {...rest} as={BuyCrypto} w={w} h={h} color={color} />;
};
export const CompoundIcon = ({ w = md, h = md, color = 'ci', ...rest }) => {
  return <Icon {...rest} as={CompoundIconImage} w={w} h={h} color={color} />;
};
export const PlusIcon = ({
  w = '28px',
  h = '28px',
  color = 'white',
  ...rest
}) => {
  return <Icon {...rest} as={PlusCircleIcon} w={w} h={h} color={color} />;
};
