import { BigNumber as BigNum } from '@ethersproject/bignumber';
import { MaxUint256 } from '@ethersproject/constants';
import { CHAIN_ID } from 'constants/index';
import { Contract } from '../contracts';
import addresses from 'constants/contracts';
import { connect } from '../connection';
import { formatEther } from 'ethers/lib/utils';
import { getProvider } from 'app/connectors/EthersConnector/login';
import { BigNumber } from 'ethers';

export const DEFAULT_GAS_LIMIT = 5000000;

export const transaction = async (
  txHash: string,
  networkId: string | number | undefined = CHAIN_ID,
) => {
  const external = await connect('rpc', () => null, Number(networkId));

  const externalCheck = await external.provider.getTransactionReceipt(txHash);

  return { internal: false, external: externalCheck };
};

export const approve = async (
  _contractAddress: string, // Address of the token you are going to transfer
  _allowanceTarget: string, // Address that would receive the token amount
  _approvedAmount: BigNum | 'max' = 'max', // Amount to approve
  _contract: string = 'erc20', // name of the ABI you are using. See the web3/contracts ABIS constant. Default is erc20
  _chainId = CHAIN_ID, // Chain you are working with
) => {
  const _connector = getProvider(); // Approvals require signers and by default they are metamask

  let amount = _approvedAmount;

  if (amount === 'max') {
    amount = MaxUint256;
  }

  const instance = await Contract(
    _contractAddress,
    _contract,
    _connector,
    _chainId,
  );

  try {
    const tx = await instance.approve(_allowanceTarget, amount);
    return tx;
  } catch (error) {}
};

// General allowance checking method. Works with erc20 based tokens
export const checkAllowance = async (
  _userAddress: string,
  _currencyAddress: string,
  _allowanceTarget: string,
  _contract = 'erc20',
  _chainId = CHAIN_ID,
  _provider: any = null,
) => {
  const currencyContract = await Contract(
    _currencyAddress,
    _contract,
    'rpc',
    _chainId,
    _provider,
  );

  if (!_userAddress) {
    return BigNumber.from('0');
  }

  const allowance = await currencyContract.allowance(
    _userAddress || undefined,
    _allowanceTarget,
  );

  return allowance;
};

export const checkSpiritAllowance = async (
  _userAddress: string,
  _allowanceTarget: string,
  _chainId = CHAIN_ID,
  _provider: any = null,
) => {
  const allowance = await checkAllowance(
    _userAddress,
    addresses.spirit[_chainId],
    _allowanceTarget,
    'spirit',
    _chainId,
    _provider,
  );

  return allowance;
};

export const getNativeTokenBalance = async (
  _address: string,
  _chainId = CHAIN_ID,
) => {
  const { provider } = await connect('rpc', undefined, _chainId);
  const balance = await provider.getBalance(_address);

  return formatEther(balance);
};

export const signMessage = async (tx, account) => {
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [tx, account],
  });
  return signature;
};
