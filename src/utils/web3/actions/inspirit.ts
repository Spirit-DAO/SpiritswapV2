import addresses from 'constants/contracts';
import { BigNumber, utils } from 'ethers';
import { BigNumber as BigNum } from '@ethersproject/bignumber';
import { CHAIN_ID } from 'constants/index';
import { DEFAULT_GAS_LIMIT, approve } from './general';
import { Contract } from '../contracts';
import { gaugeContractProxy } from './farm';
import { transactionResponse } from './utils';
import { wallet } from 'utils/web3';
import { isPossibleToVote } from 'utils/data';
import { ERROR_NOT_SUM_100 } from 'constants/errors';
import { getProvider } from 'app/connectors/EthersConnector/login';
import { BoostedFarm } from 'app/interfaces/Inspirit';
import moment from 'moment';

export const getGaugeV2Contract = async (_provider = null) => {
  const gaugeV2Address = addresses.gaugeV3[CHAIN_ID];

  if (!_provider) {
    const provider = getProvider();
    return await Contract(gaugeV2Address, 'gaugeproxyV3', provider);
  }

  return await Contract(
    gaugeV2Address,
    'gaugeproxyV3',
    undefined,
    undefined,
    _provider,
  );
};
export const getGaugeStableContract = async (_provider = null) => {
  const gaugeStableAddress = addresses.stableProxy[CHAIN_ID];
  if (!_provider) {
    const provider = getProvider();
    return await Contract(gaugeStableAddress, 'stableproxy', provider);
  }

  return await Contract(
    gaugeStableAddress,
    'stableproxy',
    undefined,
    undefined,
    _provider,
  );
};

export const getBribeContract = async (
  bribeAddress: string,
  provider: any = null,
) => {
  return await Contract(
    bribeAddress,
    'bribe',
    undefined,
    undefined,
    provider,
    true,
  );
};

export const getGaugeV2Address = async (
  lpAddress: string,
  version: number,
  provider: any = null,
) => {
  if (version === 3) {
    const gaugeStableContract = await getGaugeStableContract(provider);
    return await gaugeStableContract.getGauge(lpAddress);
  }
  const gaugeV2Contract = await getGaugeV2Contract(provider);
  return await gaugeV2Contract.getGauge(lpAddress);
};

export const getBribeAddress = async (
  gaugeAddress: string,
  version: number,
  provider: any = null,
) => {
  try {
    if (version === 3) {
      const gaugeStableContract = await getGaugeStableContract(provider);
      return await gaugeStableContract.bribes(gaugeAddress);
    }
    const gaugeV2Contract = await getGaugeV2Contract(provider);
    return await gaugeV2Contract.bribes(gaugeAddress);
  } catch (error) {}
};

export const getBribeContractByLpAddress = async (
  lpAddress: string,
  version: number,
  provider: any = null,
) => {
  const gaugeAddress = await getGaugeV2Address(lpAddress, version, provider);
  const bribeAddress = await getBribeAddress(gaugeAddress, version, provider);
  const bribeContract = await getBribeContract(bribeAddress, provider);
  return bribeContract;
};

export const submitBribe = async (
  bribeAddress: string,
  tokenAddress: string,
  amount: BigNumber,
) => {
  const connector = getProvider();
  const { signer } = await wallet(connector);
  const bribeContract = await getBribeContract(bribeAddress, signer);
  return await bribeContract.notifyRewardAmount(tokenAddress, amount, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });
};

export const claimBribes = async (
  bribes: string[],
  userAddress: string,
  version,
) => {
  if (version === 0) {
    const gaugeStableContract = await getGaugeStableContract();
    return await gaugeStableContract.claimBribes(bribes, userAddress, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
  }
  const gaugeV2Contract = await getGaugeV2Contract();

  return await gaugeV2Contract.claimBribes(bribes, userAddress, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });
};

export const feeDistributorContract = async () => {
  const _connector = getProvider();
  const feeDistributorContract = await Contract(
    addresses.feedistributor[CHAIN_ID],
    'feedistributor',
    _connector,
    CHAIN_ID,
  );

  return feeDistributorContract;
};

export const inspiritContract = async () => {
  const _connector = getProvider();
  const inspiritContract = await Contract(
    addresses.inspirit[CHAIN_ID],
    'inspirit',
    _connector,
    CHAIN_ID,
  );

  return inspiritContract;
};

export const approveSpirit = async (
  _address: string,
  _allowableAmount: string,
  _callback?: Function | undefined,
  _chainId = CHAIN_ID,
) => {
  if (!_allowableAmount) {
    throw new Error('Allowable amount needs to be provided');
  }
  const lockAmount = utils.parseEther(`${_allowableAmount}`);

  const tx = await approve(
    addresses.spirit[_chainId],
    _address,
    lockAmount,
    'spirit',
    _chainId,
  );

  return transactionResponse('inspirit.allowance', {
    tx: tx,
    uniqueMessage: { text: 'Approving', secondText: 'SPIRIT' },
    update: 'allowances',
    updateTarget: 'user',
  });
};

// lockEnd = milliseconds in unixTime
export const createInspiritLock = async (
  _userAddress: string,
  _lockAmount: number | string,
  _lockEnd: number | undefined, // timestamp
) => {
  if (!_lockEnd) {
    throw new Error('Invalid lock time selected');
  }

  if (!_lockAmount) {
    throw new Error('Invalid lock amount');
  }
  const contract = await inspiritContract();

  // Check the current amount locked
  const lockedAmount = await contract.locked(_userAddress, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  if (!lockedAmount.amount.eq(0)) {
    throw new Error('Existing lock already tied to account');
  }

  const tx = await contract.create_lock(
    utils.parseEther(`${_lockAmount}`),
    _lockEnd,
    {
      gasLimit: DEFAULT_GAS_LIMIT,
    },
  );

  return transactionResponse('inspirit.lock', {
    tx: tx,
    inputSymbol: 'SPIRIT',
    inputValue: _lockAmount.toString(),
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const increaseLockAmount = async (
  _address: string,
  _amount: number | string,
) => {
  if (!_amount) {
    throw new Error('Invalid additional amount to lock');
  }

  const contract = await inspiritContract();

  // Check the current amount locked
  const lockedAmount = await contract.locked(_address, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  if (lockedAmount.amount.eq(0)) {
    throw new Error('Address does not have existing lock amount');
  }

  const lockAmount = utils.parseEther(`${_amount}`);

  const tx = await contract.increase_amount(lockAmount, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  return transactionResponse('inspirit.lock', {
    tx: tx,
    inputSymbol: 'SPIRIT',
    inputValue: _amount.toString(),
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const increaseLockTime = async (
  _userAddress: string,
  _newTimeStamp: number | undefined,
) => {
  if (!_newTimeStamp) {
    throw new Error('Invalid lock time');
  }

  const nextLockedDate = moment.unix(_newTimeStamp).utc().format('Do MMM YYYY');

  const contract = await inspiritContract();

  // Check the current amount locked
  const lockedAmount = await contract.locked(_userAddress, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  if (lockedAmount.amount.eq(0)) {
    throw new Error('Address does not have existing lock amount');
  }

  const tx = await contract.increase_unlock_time(_newTimeStamp, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  return transactionResponse('inspirit.extend', {
    tx: tx,
    uniqueMessage: { text: `Locking until ${nextLockedDate}` },
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const unlockInspirit = async (amount: string) => {
  const contract = await inspiritContract();
  const tx = await contract.withdraw({
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  return transactionResponse('inspirit.unlock', {
    tx: tx,
    inputSymbol: 'SPIRIT',
    inputValue: amount,
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const claimSpirit = async (claimableSpiritRewards: string) => {
  const contract = await feeDistributorContract();

  const tx = await contract['claim()']();

  return transactionResponse('inspirit.claim', {
    tx: tx,
    uniqueMessage: {
      text: `Claiming ${parseFloat(claimableSpiritRewards).toPrecision(4)}`,
      secondText: 'SPIRIT',
    },
    update: 'portfolio',
    updateTarget: 'user',
  });
};

export const voteForBoostedDistributions = async ({
  vaults,
  version = 1,
}: {
  vaults: BoostedFarm[];
  version?: number;
}) => {
  const tokenList: string[] = [];
  const valueList: BigNum[] = [];
  let votingWeight = 0;

  vaults.forEach(vault => {
    const { value, fulldata } = vault;
    const address = fulldata.farmAddress;
    const weight = parseFloat(`${value}`.replace(' %', ''));

    if (weight && address) {
      tokenList.push(address);
      valueList.push(utils.parseEther(`${weight}`));
      votingWeight += weight;
    }
  });

  if (votingWeight !== 100 || tokenList.length !== valueList.length) {
    throw new Error(ERROR_NOT_SUM_100);
  }

  const contract = await gaugeContractProxy({ version });

  const tx = await contract.vote(tokenList, valueList, {
    gasLimit: DEFAULT_GAS_LIMIT,
  });

  return transactionResponse('inspirit.vote', {
    tx: tx,
    uniqueMessage: { text: 'Voting for boosted farms ' },
    update: 'inspirit',
    updateTarget: 'user',
  });
};

export const checkLastVotes = async (
  userAddress: string,
  versionId: number,
): Promise<boolean> => {
  const contract = await gaugeContractProxy({ version: versionId });
  const lastVotes = await contract.lastVote(userAddress);
  const lastVotesNumber = Number(lastVotes.toString());
  const checkLastVote = isPossibleToVote(lastVotesNumber);

  return checkLastVote;
};
