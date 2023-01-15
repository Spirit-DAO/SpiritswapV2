import React from 'react';
import { Suggestion } from './Suggestion';
import { Button, ToastId, useToast } from '@chakra-ui/react';
import { useSuggestionsProps, SuggestionsTypes } from './Suggestion';
import {
  FARMS,
  HOME,
  INSPIRIT,
  LIQUIDITY,
  SWAP,
  resolveRoutePath,
} from 'app/router/routes';
import { openInSelfTab } from 'app/utils/redirectTab';
import { useAppSelector } from 'store/hooks';
import { selectUserSettings } from 'store/settings/selectors';
import { useDispatch } from 'react-redux';
import { setKeepSuggestions, setUserSuggestions } from 'store/settings';
import {
  BRIDGE_TEXTS,
  DISCLAIMER_TEXTS,
  FARMS_TEXTS,
  INSPIRIT_TEXTS,
  LIQUIDITY_TEXTS,
  SWAP_TEXTS,
} from './suggestionsTexts';
import { useTranslation } from 'react-i18next';

const DISCLAIMER_TOAST_ID = 0;

export function useSuggestion() {
  const toast = useToast();
  const dispatch = useDispatch();
  const { suggestions, keepSuggestions } = useAppSelector(selectUserSettings);

  const closeSuggestion = (id: ToastId) => {
    toast.close(id);
  };

  const turnOffSuggestions = id => {
    dispatch(
      setUserSuggestions({
        suggestions: false,
      }),
    );
    closeSuggestion(id);
  };

  const handleKeepOnSuggestions = id => {
    if (!keepSuggestions) {
      dispatch(
        setKeepSuggestions({
          keepSuggestions: true,
        }),
      );
    }
    closeSuggestion(id);
  };

  const onCloseFirstSuggestion = () => {
    if (!keepSuggestions) {
      showSuggestion({
        id: DISCLAIMER_TOAST_ID,
        type: SuggestionsTypes.CLOSING_ONCE,
        data: {},
      });
    }
  };

  const { t } = useTranslation();
  const translationPath = 'suggestions';
  const farmButton = (lpAddress?: string) => (
    <Button
      onClick={() =>
        openInSelfTab(
          lpAddress
            ? `${resolveRoutePath(FARMS.path)}/${lpAddress}`
            : resolveRoutePath(LIQUIDITY.path),
        )
      }
    >
      {t(`${translationPath}.buttons.farms`)}
    </Button>
  );

  const portfolioButton = (
    <Button onClick={() => openInSelfTab(resolveRoutePath(HOME.path))}>
      {t(`${translationPath}.buttons.portfolio`)}
    </Button>
  );

  // Commented until apeMode release in v2
  // const apeModeButton = (
  //   <Button onClick={() => openInNewTab(APEMODE_V1.url)}>
  //     {t(`${translationPath}.buttons.apeMode`)}
  //   </Button>
  // );

  const swapButton = (
    <Button onClick={() => openInSelfTab(resolveRoutePath(SWAP.path))}>
      {t(`${translationPath}.buttons.swap`)}
    </Button>
  );

  const inSpiritButton = (textContent: string) => {
    return (
      <Button
        onClick={() => {
          if (textContent === 'vote') {
            const element = document.getElementById('voting_section');
            return element?.scrollIntoView({
              behavior: 'smooth',
              inline: 'nearest',
              block: 'end',
            });
          }
          openInSelfTab(resolveRoutePath(INSPIRIT.path));
        }}
      >
        {t(`${translationPath}.buttons.${textContent}`)}
      </Button>
    );
  };

  const addLiquidityButton = (tokenA?: string, tokenB?: string) => (
    <Button
      onClick={() =>
        openInSelfTab(
          tokenA && tokenB
            ? `${resolveRoutePath(LIQUIDITY.path)}/${tokenA}/${tokenB}`
            : resolveRoutePath(LIQUIDITY.path),
        )
      }
    >
      {t(`${translationPath}.buttons.liquidity`)}
    </Button>
  );

  const showSuggestion = ({ id, type, data }: useSuggestionsProps) => {
    const getTitle = (type: string, data) => {
      switch (type) {
        case SuggestionsTypes.BRIDGE:
          if (
            data.bridgeToFantom &&
            (data.bridgeWhitelistedTokens || data.moreThanOneTokenInWallet)
          )
            return t(BRIDGE_TEXTS[1]);

          if (data.bridgeToFantom) return t(BRIDGE_TEXTS[2]);
          else return t(BRIDGE_TEXTS[3]);
        case SuggestionsTypes.FARMS:
          if (data.harvestSpirit) return t(FARMS_TEXTS[1]);
          if (data.harvestAnyToken) return t(FARMS_TEXTS[2]);
          if (data.depositLp) return t(FARMS_TEXTS[3]);
          else return t(FARMS_TEXTS[3]);
        case SuggestionsTypes.INSPIRIT:
          if (data.claimSpirit) return t(INSPIRIT_TEXTS[1]);
          if (data.lockSpirit) return t(INSPIRIT_TEXTS[2]);
          else return '';
        case SuggestionsTypes.LIQUIDITY:
          if (data.farmExist) return t(LIQUIDITY_TEXTS[1]);
          else return t(LIQUIDITY_TEXTS[2]);
        case SuggestionsTypes.SWAP:
          if (data.swappingToSpirit) return t(SWAP_TEXTS[1]);
          else {
            if (data.tokensToLink) {
              return `${t(SWAP_TEXTS[2])} ${data.tokensToLink.tokenB}. ${t(
                SWAP_TEXTS[3],
              )}`;
            }
            return '';
          }
        default:
          return '';
      }
    };

    const createButtons = (
      children1: JSX.Element,
      children2?: JSX.Element,
      children3?: JSX.Element,
    ) => {
      return (
        <>
          {children1}
          {children2}
          {children3}
        </>
      );
    };

    const getButtonsGroup = (type: string, data) => {
      let tokenA = '';
      let tokenB = '';

      if (data.tokensToLink) {
        tokenA = data.tokensToLink.tokenA;
        tokenB = data.tokensToLink.tokenB;
      }
      switch (type) {
        case SuggestionsTypes.BRIDGE:
          if (
            data.bridgeToFantom &&
            data.moreThanOneTokenInWallet &&
            data.bridgeWhitelistedTokens
          )
            return createButtons(swapButton, addLiquidityButton());

          if (data.bridgeToFantom && data.moreThanOneTokenInWallet)
            return createButtons(swapButton, addLiquidityButton());

          if (data.bridgeToFantom) return createButtons(swapButton);
          else return <></>;
        case SuggestionsTypes.FARMS:
          if (data.harvestSpirit)
            return createButtons(
              inSpiritButton('LockSpirit'),
              addLiquidityButton(tokenA, tokenB),
            );

          if (data.harvestAnyToken) return createButtons(swapButton);
          else return createButtons(portfolioButton);
        case SuggestionsTypes.INSPIRIT:
          if (data.claimSpirit)
            return createButtons(
              inSpiritButton('LockSpirit'),
              addLiquidityButton(tokenA, tokenB),
            );
          else return createButtons(inSpiritButton('vote'));
        case SuggestionsTypes.LIQUIDITY:
          if (data.farmExist)
            return createButtons(farmButton(data.lpAddress), portfolioButton);
          else return createButtons(portfolioButton);
        case SuggestionsTypes.SWAP:
          if (data.swappingWhitelistedTokens && !data.swappingToSpirit)
            return createButtons(addLiquidityButton(tokenA, tokenB));

          if (data.swappingToSpirit)
            return createButtons(
              inSpiritButton('inSpirit'),
              addLiquidityButton(tokenA, tokenB),
            );
          else return createButtons(addLiquidityButton(tokenA, tokenB));
        default:
          return <></>;
      }
    };

    const suggestionConfig = (
      data,
    ): { body: string; buttons: JSX.Element; title?: string } => {
      switch (type) {
        case SuggestionsTypes.BRIDGE:
          return {
            body: getTitle(SuggestionsTypes.BRIDGE, data),
            buttons: getButtonsGroup(SuggestionsTypes.BRIDGE, data),
          };
        case SuggestionsTypes.FARMS:
          return {
            body: getTitle(SuggestionsTypes.FARMS, data),
            buttons: getButtonsGroup(SuggestionsTypes.FARMS, data),
          };
        case SuggestionsTypes.INSPIRIT:
          return {
            body: getTitle(SuggestionsTypes.INSPIRIT, data),
            buttons: getButtonsGroup(SuggestionsTypes.INSPIRIT, data),
          };
        case SuggestionsTypes.LIQUIDITY:
          return {
            body: getTitle(SuggestionsTypes.LIQUIDITY, data),
            buttons: getButtonsGroup(SuggestionsTypes.LIQUIDITY, data),
          };
        case SuggestionsTypes.SWAP:
          return {
            body: getTitle(SuggestionsTypes.SWAP, data),
            buttons: getButtonsGroup(SuggestionsTypes.SWAP, data),
          };
        case SuggestionsTypes.CLOSING_ONCE:
          return {
            body: t(DISCLAIMER_TEXTS[1]),
            title: t(DISCLAIMER_TEXTS[2]),
            buttons: (
              <>
                <Button onClick={() => handleKeepOnSuggestions(id)}>
                  {t(`${translationPath}.buttons.disclaimer.1`)}
                </Button>
                <Button
                  variant="secondary"
                  bg="bgBoxDarker"
                  onClick={() => turnOffSuggestions(id)}
                >
                  {t(`${translationPath}.buttons.disclaimer.2`)}
                </Button>
              </>
            ),
          };
        default:
          return {
            body: '',
            title: '',
            buttons: <></>,
          };
      }
    };

    const { title, body, buttons } = suggestionConfig(data);

    const buttonsAmount = !buttons.props.children?.length
      ? 0
      : buttons.props.children.filter(child => child).length;

    if (suggestions && !toast.isActive(id)) {
      return toast({
        id: id,
        position: 'top-right',
        duration: 10000,
        onCloseComplete:
          id !== DISCLAIMER_TOAST_ID ? onCloseFirstSuggestion : undefined,
        render: () => (
          <Suggestion
            body={body}
            title={title}
            buttons={buttons}
            buttonsAmount={buttonsAmount}
            id={id}
            closeSuggestion={closeSuggestion}
          />
        ),
      });
    }
  };

  return { showSuggestion, closeSuggestion };
}
