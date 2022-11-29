import PlusLogoGreen from 'app/pages/Liquidity/components/PlusLogoGreen';
import { TokenAmountPanel } from 'app/components/NewTokenAmountPanel';
import { TotalTrading } from 'app/pages/Liquidity/components/Trading';
import { Token } from 'app/interfaces/General';

const StablePanel = ({
  lpTokenValue,
  children,
  firstToken,
  secondToken,
  handleChangeInput,
  handleChangeToken,
  liquidityTrade,
  ipLoading,
  opLoading,
  errorMessage,
  setCanApproveFunds,
  canApproveFunds,
}) => {
  return (
    <>
      <TokenAmountPanel
        key="tokenA"
        onSelect={(item: Token, onClose) => handleChangeToken(item, 0, onClose)}
        token={firstToken?.tokenSelected}
        inputValue={firstToken.value || ''}
        showPercentage
        context="token"
        onChange={({ value }) => handleChangeInput(value, 0)}
        isLoading={ipLoading}
        errorMessage={
          (canApproveFunds.relevantTokens &&
            canApproveFunds.relevantTokens.includes(
              firstToken.tokenSelected.symbol,
            )) ||
          canApproveFunds.relevantTokens.length === 0
            ? errorMessage
            : ''
        }
        setErrorMessage={setCanApproveFunds}
        canApproveFunds={canApproveFunds.canApprove}
      />
      <PlusLogoGreen />
      <TokenAmountPanel
        key="tokenB"
        onSelect={(item: Token, onClose) => handleChangeToken(item, 1, onClose)}
        token={secondToken?.tokenSelected}
        inputValue={secondToken.value || ''}
        showPercentage
        context="token"
        onChange={({ value }) => handleChangeInput(value, 1)}
        isLoading={opLoading}
        errorMessage={
          (canApproveFunds.relevantTokens &&
            canApproveFunds.relevantTokens.includes(
              secondToken.tokenSelected.symbol,
            )) ||
          canApproveFunds.relevantTokens.length === 0
            ? errorMessage
            : ''
        }
        setErrorMessage={setCanApproveFunds}
        canApproveFunds={canApproveFunds.canApprove}
      />
      {liquidityTrade ? (
        <TotalTrading
          liquidityTradeEstimate={`${liquidityTrade?.liquidity} ${liquidityTrade?.lpSymbol}`}
          liquidityTradeEstimateUSD={`≈ $${lpTokenValue}`}
        />
      ) : null}
      {children}
    </>
  );
};

export default StablePanel;
