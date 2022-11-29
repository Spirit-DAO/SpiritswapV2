import web3Listener from './_web3Listener';
import { getUserBalances, reconciliateBalances } from 'utils/data';
import {
  setBridgeWalletFrom,
  setBridgeWalletTo,
  setNewBalanceUpdates,
} from 'store/user';
import { safeExecuteNotAsync as safeExecute } from 'utils/safeExecute';
import { BalanceUpdate } from 'utils/web3';

/**
 * Helper method - Updates portfolio related data
 *  - userWalletAddress: Address of user in the blockchain
 *  - dispatch: callback hook method that allows update of app state
 */
export const updateBridgeBalance = async (
  userWalletAddress,
  trackedTokens,
  chainId,
  index,
  dispatch,
) => {
  const updateMethod = !index ? setBridgeWalletFrom : setBridgeWalletTo;

  const covalentRawData = await getUserBalances(userWalletAddress, chainId);

  if (!covalentRawData) {
    return null;
  }

  // Verifies tracked tokens are part of the portfolio data from covalent
  // Also multicalls blockchain for balances
  const portfolio = await reconciliateBalances(
    userWalletAddress,
    covalentRawData,
    trackedTokens,
    chainId,
  );

  const { tokens } = portfolio;
  dispatch(updateMethod(tokens.tokenList));
};

export const addToBridgeQueue = (
  type,
  block,
  origin,
  dispatch,
  bridgeIndex,
  chainId,
  force = false,
) => {
  const timeNow = Date.now();
  const target = `${bridgeIndex}` === '1' ? 'toBridge' : 'fromBridge';

  const bridgeUpdateRecord: BalanceUpdate = {
    id: `${timeNow}${block}`,
    type,
    block: Number(block),
    origin,
    chainId,
    bridge: target,
    force,
    timestamp: timeNow, // Used to prevent balance requests too close together
  };

  return dispatch(setNewBalanceUpdates(bridgeUpdateRecord));
};

/**
 * Main Method - Sets up connection to rpc server and callback functions meant to update state of app
 *  - userWalletAddress: Address of user in the blockchain
 *  - dispatch: callback hook method that allows update of app state
 */
export const bridgeListener = (userWalletAddress, chainId, index, dispatch) => {
  const updateCallback = (
    eventName: string,
    block?: number,
    origin?: string,
  ) => {
    const queue = () =>
      addToBridgeQueue(eventName, block, origin, dispatch, index, chainId);

    safeExecute(
      // Initial Attempt to execute balance listener methods immediately
      queue,
      // onFail function
      () => {
        setTimeout(queue, 5000);
      },
    );
  };

  return web3Listener({
    id: 'BridgeListener',
    address: userWalletAddress,
    update: updateCallback,
    chainId,
  });
};

export default bridgeListener;
