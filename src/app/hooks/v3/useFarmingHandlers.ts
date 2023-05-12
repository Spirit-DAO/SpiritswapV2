import NonfungiblePositionManagerABI from 'utils/web3/abis/v3/nonfungiblePositionManager.json';
import FarmingCenterABI from 'utils/web3/abis/v3/farmingCenter.json';

import { Interface } from 'ethers/lib/utils';
import { useCallback, useState } from 'react';
import contracts from 'constants/contracts';
// import { useTransactionAdder } from "../../state/transactions/hooks"
import JSBI from 'jsbi';
import { toHex } from '../../../v3-sdk';
import { TransactionResponse } from '@ethersproject/providers';

import useWallets from '../useWallets';
import { getProvider } from 'app/connectors/EthersConnector/login';
import {
  useV3FarmingCenterContract,
  useV3NFTPositionManagerContract,
} from './useV3Contracts';
import { CHAIN_ID } from 'constants/index';
import { transactionResponse } from 'utils/web3';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { Contract } from '@ethersproject/contracts';

export enum FarmingType {
  ETERNAL = 0,
  LIMIT = 1,
}

export function useFarmingHandlers() {
  const { account, wallet } = useWallets();

  const provider = getProvider();

  const { addToQueue } = Web3Monitoring();

  const farmingCenterInterface = new Interface(FarmingCenterABI);

  const nonfungiblePositionManagerContract = new Contract(
    contracts.v3NonfungiblePositionManager[CHAIN_ID],
    NonfungiblePositionManagerABI,
  );
  const farmingCenterContract = new Contract(
    contracts.v3FarmingCenter[CHAIN_ID],
    FarmingCenterABI,
  );

  const [approvedHash, setApproved] = useState<any | string>({
    hash: null,
    id: null,
  });
  const [transferedHash, setTransfered] = useState<any | string>({
    hash: null,
    id: null,
  });
  const [farmedHash, setFarmed] = useState<any | string>({
    hash: null,
    id: null,
  });
  const [getRewardsHash, setGetRewards] = useState<any | string>({
    hash: null,
    id: null,
    farmingType: null,
  });
  const [eternalCollectRewardHash, setEternalCollectReward] = useState<
    any | string
  >({ hash: null, id: null });
  const [withdrawnHash, setWithdrawn] = useState<any | string>({
    hash: null,
    id: null,
  });
  const [claimRewardHash, setClaimReward] = useState<any | string>({
    hash: null,
    id: null,
    farmingType: null,
  });
  const [sendNFTL2Hash, setSendNFTL2] = useState<any | string>({
    hash: null,
    id: null,
  });
  const [claimHash, setClaimHash] = useState<any | string>({
    hash: null,
    id: null,
    error: null,
  });

  //exit from basic farming and claim than
  const claimRewardsHandler = useCallback(
    async (
      token,
      {
        limitRewardToken,
        limitBonusRewardToken,
        pool,
        limitStartTime,
        limitEndTime,
        eternalRewardToken,
        eternalBonusRewardToken,
        eternalStartTime,
        eternalEndTime,
        eternalBonusEarned,
        eternalEarned,
        limitBonusEarned,
        limitEarned,
      },
      farmingType,
    ) => {
      if (!account || !provider) return;

      setClaimReward({ hash: null, id: null, farmingType: null });

      const MaxUint128 = toHex(
        JSBI.subtract(
          JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
          JSBI.BigInt(1),
        ),
      );

      try {
        const farmingCenterInterface = new Interface(FarmingCenterABI);

        let callDatas: string[], result: TransactionResponse;

        if (farmingType === FarmingType.ETERNAL) {
          callDatas = [
            farmingCenterInterface.encodeFunctionData('exitFarming', [
              [
                eternalRewardToken.id,
                eternalBonusRewardToken.id,
                pool.id,
                +eternalStartTime,
                +eternalEndTime,
              ],
              +token,
              false,
            ]),
          ];

          if (Boolean(+eternalEarned)) {
            callDatas.push(
              farmingCenterInterface.encodeFunctionData('claimReward', [
                eternalRewardToken.id,
                account,
                0,
                MaxUint128,
              ]),
            );
          }

          if (Boolean(+eternalBonusEarned)) {
            callDatas.push(
              farmingCenterInterface.encodeFunctionData('claimReward', [
                eternalBonusRewardToken.id,
                account,
                0,
                MaxUint128,
              ]),
            );
          }

          result = await farmingCenterContract.multicall(callDatas);
        } else {
          callDatas = [
            farmingCenterInterface.encodeFunctionData('exitFarming', [
              [
                limitRewardToken.id,
                limitBonusRewardToken.id,
                pool.id,
                +limitStartTime,
                +limitEndTime,
              ],
              +token,
              true,
            ]),
          ];

          if (Boolean(+limitEarned)) {
            callDatas.push(
              farmingCenterInterface.encodeFunctionData('claimReward', [
                limitRewardToken.id,
                account,
                MaxUint128,
                0,
              ]),
            );
          }

          if (Boolean(+limitBonusEarned)) {
            callDatas.push(
              farmingCenterInterface.encodeFunctionData('claimReward', [
                limitBonusRewardToken.id,
                account,
                MaxUint128,
                0,
              ]),
            );
          }

          result = await farmingCenterContract.multicall(callDatas);
        }

        const tx = transactionResponse('Claim Reward', {
          tx: result,
        });

        addToQueue(tx);

        setClaimReward({
          hash: result.hash,
          id: token,
          error: null,
          farmingType: farmingType === FarmingType.ETERNAL ? 0 : 1,
        });
      } catch (err: any) {
        setClaimReward('failed');
        if (err.code !== 4001) {
          throw new Error('Claiming rewards ' + err.message);
        }
      }
    },
    [account],
  );

  //collect rewards and claim than
  const eternalCollectRewardHandler = useCallback(
    async (
      token,
      {
        pool,
        eternalRewardToken,
        eternalBonusRewardToken,
        eternalStartTime,
        eternalEndTime,
      },
    ) => {
      if (!account || !provider) return;

      const farmingCenterInterface = new Interface(FarmingCenterABI);

      setEternalCollectReward({ hash: null, id: null });

      try {
        const MaxUint128 = toHex(
          JSBI.subtract(
            JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
            JSBI.BigInt(1),
          ),
        );

        const collectRewards = farmingCenterInterface.encodeFunctionData(
          'collectRewards',
          [
            [
              eternalRewardToken.id,
              eternalBonusRewardToken.id,
              pool.id,
              +eternalStartTime,
              +eternalEndTime,
            ],
            +token,
          ],
        );
        const claimReward1 = farmingCenterInterface.encodeFunctionData(
          'claimReward',
          [eternalRewardToken.id, account, 0, MaxUint128],
        );
        const claimReward2 = farmingCenterInterface.encodeFunctionData(
          'claimReward',
          [eternalBonusRewardToken.id, account, 0, MaxUint128],
        );

        let result: TransactionResponse;

        if (
          eternalRewardToken.id.toLowerCase() !==
          eternalBonusRewardToken.id.toLowerCase()
        ) {
          result = await farmingCenterContract.multicall([
            collectRewards,
            claimReward1,
            claimReward2,
          ]);
        } else {
          result = await farmingCenterContract.multicall([
            collectRewards,
            claimReward1,
          ]);
        }

        const tx = transactionResponse('Claiming Reward', {
          tx: result,
        });

        addToQueue(tx);

        setEternalCollectReward({ hash: result.hash, id: token });
      } catch (err) {
        setEternalCollectReward('failed');
        if (err instanceof Error) {
          throw new Error('Claiming rewards ' + err.message);
        }
      }
    },
    [account],
  );

  const claimReward = useCallback(
    async tokenReward => {
      try {
        if (!account || !provider) return;

        const MaxUint128 = toHex(
          JSBI.subtract(
            JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
            JSBI.BigInt(1),
          ),
        );

        const result: TransactionResponse =
          await farmingCenterContract.claimReward(
            tokenReward,
            account,
            MaxUint128,
            MaxUint128,
          );

        setClaimHash({ hash: result.hash, id: tokenReward });

        const tx = transactionResponse('Claiming Reward', {
          tx: result,
        });

        addToQueue(tx);
      } catch (e) {
        setClaimHash('failed');
        if (e instanceof Error) {
          throw new Error('Claim rewards ' + e.message);
        }
      }
    },
    [account],
  );

  //exit from basic farming before the start
  const exitHandler = useCallback(
    async (
      token,
      {
        limitRewardToken,
        limitBonusRewardToken,
        pool,
        limitStartTime,
        limitEndTime,
      },
      eventType,
    ) => {
      if (!account || !provider) return;

      setGetRewards({ hash: null, id: null, farmingType: null });

      try {
        const result: TransactionResponse =
          await farmingCenterContract.exitFarming(
            [
              limitRewardToken.id,
              limitBonusRewardToken.id,
              pool.id,
              +limitStartTime,
              +limitEndTime,
            ],
            +token,
          );

        const tx = transactionResponse('Rewards were claimed', {
          tx: result,
        });

        addToQueue(tx);

        setGetRewards({ hash: result.hash, id: token, farmingType: eventType });
      } catch (err) {
        setGetRewards('failed');
        if (err instanceof Error) {
          throw new Error('Getting rewards ' + err.message);
        }
      }
    },
    [account],
  );

  const withdrawHandler = useCallback(
    async token => {
      if (!account || !provider) return;

      setWithdrawn({ hash: null, id: null });

      try {
        const result = await farmingCenterContract.withdrawToken(
          token,
          account,
          0x0,
        );

        const tx = transactionResponse(`NFT #${token} was withdrawn!`, {
          tx: result,
        });

        addToQueue(tx);

        setWithdrawn({ hash: result.hash, id: token });
      } catch (err) {
        setWithdrawn('failed');
        if (err instanceof Error) {
          throw new Error('Withdrawing ' + err);
        }
      }
    },
    [account],
  );

  const farmHandler = useCallback(
    async (
      selectedNFT,
      { rewardToken, bonusRewardToken, pool, startTime, endTime },
      selectedTier,
    ) => {
      if (!account || !provider) return;

      setFarmed({ hash: null, id: null });

      let current;

      try {
        if (selectedNFT.onFarmingCenter) {
          current = selectedNFT.id;

          const result = await farmingCenterContract.enterFarming(
            [rewardToken, bonusRewardToken, pool, startTime, endTime],
            +selectedNFT.id,
            selectedTier,
            false,
          );

          const tx = transactionResponse(
            `NFT #${selectedNFT.id} was deposited!`,
            {
              tx: result,
            },
          );

          addToQueue(tx);

          setFarmed({ hash: result.hash, id: selectedNFT.id });
        }
      } catch (err) {
        setFarmed('failed');
        if (err instanceof Error) {
          throw new Error('Farming ' + current + ' ' + err.message);
        }
      }
    },
    [account],
  );

  const transferHandler = useCallback(
    async selectedNFT => {
      if (!account || !provider) return;

      setTransfered({ hash: null, id: null });

      let current;

      try {
        if (selectedNFT.approved) {
          current = selectedNFT.id;

          const result = await nonfungiblePositionManagerContract[
            'safeTransferFrom(address,address,uint256)'
          ](account, contracts.v3FarmingCenter[CHAIN_ID], selectedNFT.id);

          const tx = transactionResponse(
            `NFT #${selectedNFT.id} was transferred!`,
            {
              tx: result,
            },
          );

          addToQueue(tx);

          setTransfered({ hash: result.hash, id: selectedNFT.id });
        }
      } catch (err) {
        setTransfered('failed');
        if (err instanceof Error) {
          throw new Error('Farming ' + current + ' ' + err.message);
        }
      }
    },
    [account],
  );

  const approveHandler = useCallback(
    async selectedNFT => {
      if (!account || !provider) return;

      setApproved({ hash: null, id: null });

      let current;

      try {
        const nonFunPosManInterface = new Interface(
          NonfungiblePositionManagerABI,
        );

        if (!selectedNFT.onFarmingCenter) {
          current = selectedNFT.id;

          const transferData = nonFunPosManInterface.encodeFunctionData(
            'safeTransferFrom(address,address,uint256)',
            [
              account,
              contracts.v3NonfungiblePositionManager[CHAIN_ID],
              selectedNFT.id,
            ],
          );

          const result = await nonfungiblePositionManagerContract.multicall([
            transferData,
          ]);

          const tx = transactionResponse(
            `NFT #${selectedNFT.id} was approved!`,
            {
              tx: result,
            },
          );

          addToQueue(tx);

          setApproved({ hash: result.hash, id: selectedNFT.id });
        }
      } catch (err) {
        setApproved('failed');
        if (err instanceof Error) {
          throw new Error('Approving NFT ' + current + ' ' + err.message);
        }
      }
    },
    [account],
  );

  const sendNFTL2Handler = useCallback(
    async (recipient: string, l2TokenId: string) => {
      if (!account || !provider) return;

      setSendNFTL2({ hash: null, id: null });

      try {
        const approveData = farmingCenterInterface.encodeFunctionData(
          'approve',
          [recipient, l2TokenId],
        );

        const sendData = farmingCenterInterface.encodeFunctionData(
          'safeTransferFrom(address,address,uint256)',
          [account, recipient, l2TokenId],
        );

        const result = await farmingCenterContract.multicall([
          approveData,
          sendData,
        ]);

        const tx = transactionResponse(`NFT #${l2TokenId} was sent!`, {
          tx: result,
        });

        addToQueue(tx);

        setSendNFTL2({ hash: result.hash, id: l2TokenId });
      } catch (err) {
        setSendNFTL2('failed');
        if (err instanceof Error) {
          throw new Error('Send NFT L2 ' + err.message);
        }
      }
    },
    [account],
  );

  return {
    approveHandler,
    approvedHash,
    transferHandler,
    transferedHash,
    farmHandler,
    farmedHash,
    exitHandler,
    getRewardsHash,
    withdrawHandler,
    withdrawnHash,
    claimRewardsHandler,
    claimRewardHash,
    sendNFTL2Handler,
    sendNFTL2Hash,
    eternalCollectRewardHandler,
    eternalCollectRewardHash,
    claimReward,
    claimHash,
  };
}
