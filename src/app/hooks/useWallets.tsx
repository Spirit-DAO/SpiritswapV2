import { useEffect, useState } from 'react';
import useLogin from 'app/connectors/EthersConnector/login';
import { useAppSelector } from 'store/hooks';
import {
  selectAddress,
  selectConcentratedLiquidityWallet,
  selectedWeightedLiquidityWallet,
  selectIsLoggedIn,
  selectLiquidity,
  selectLiquidityWallet,
  selectPortfolioValue,
  selectSobLiquidityWallet,
  selectTokens,
  selectWallet,
} from 'store/user/selectors';
import { ethers } from 'ethers';
import { checkAddress } from 'app/utils';
import { CRIMINAL_LIST } from 'constants/blacklist';

const useWallets = () => {
  const [isConnected, setIsConnected] = useState<boolean | undefined>(
    undefined,
  );
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAddress);
  const { handleLogin } = useLogin();
  const tokens = useAppSelector(selectTokens);
  const liquidity = useAppSelector(selectLiquidity);
  const walletLiquidity = useAppSelector(selectLiquidityWallet);
  const sobWalletLiquidity = useAppSelector(selectSobLiquidityWallet);
  const weightedWalletLiquidity = useAppSelector(
    selectedWeightedLiquidityWallet,
  );
  const concentratedLiqudiity = useAppSelector(
    selectConcentratedLiquidityWallet,
  );

  useEffect(() => {
    const checkConnected = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any,
        );
        const wallets = await provider.listAccounts();
        if (wallets.length) {
          const criminalAddress = CRIMINAL_LIST.find(address =>
            checkAddress(address, wallets[0]),
          );
          if (criminalAddress) {
            setIsConnected(false);
          } else {
            setIsConnected(true);
          }
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        setIsConnected(false);
      }
    };
    checkConnected();
  }, [account]);

  const portfolioAmountValue = useAppSelector(selectPortfolioValue);
  return {
    account: isConnected ? account : '',
    wallet,
    isLoggedIn:
      isConnected === undefined ? isLoggedIn : isConnected && isLoggedIn,
    tokens,
    liquidity,
    walletLiquidity,
    concentratedLiqudiity,
    sobWalletLiquidity,
    weightedWalletLiquidity,
    portfolioAmountValue,
    staked: walletLiquidity,
    login: handleLogin,
  };
};

export default useWallets;
