export const SuggestionsTypes = {
  BRIDGE: 'BRIDGE',
  SWAP: 'SWAP',
  LIQUIDITY: 'LIQUIDITY',
  FARMS: 'FARMS',
  INSPIRIT: 'INSPIRIT',
  CLOSING_ONCE: 'CLOSING_ONCE',
};
export interface useSuggestionsProps {
  type: SuggestionsTypes;
  data:
    | BridgeSuggestionInfo
    | SwapSuggestionInfo
    | LiquiditySuggestionInfo
    | FarmsSuggestionInfo
    | InSpiritSuggestionInfo;
  id: ToastId;
}

interface BridgeSuggestionInfo {
  bridgeToFantom?: boolean;
  moreThanOneTokenInWallet?: boolean;
  bridgeWhitelistedTokens?: boolean;
}
interface SwapSuggestionInfo {
  swappingToSpirit?: boolean;
  swappingWhitelistedTokens?: boolean;
  tokensToLink?: DataToLink;
}
interface LiquiditySuggestionInfo {
  farmExist?: boolean;
  lpAddress?: DataToLink;
}
interface FarmsSuggestionInfo {
  harvestSpirit?: boolean;
  harvestAnyToken?: boolean;
  depositLp?: boolean;
}

interface DataToLink {
  tokenA?: string;
  tokenB?: string;
  lpAddress?: string;
}

interface InSpiritSuggestionInfo {
  claimSpirit?: boolean;
  lockSpirit?: boolean;
  tokensToLink?: DataToLink;
}

export interface SuggestionsProps {
  id: number;
  buttonsAmount: number;
  body: string;
  closeSuggestion: (id) => void;
  title?: string;
  buttons: JSX.Element;
}
