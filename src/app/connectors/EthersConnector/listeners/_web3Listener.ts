// RPC LISTENER - Allows real time updates from RPC node via websocket
import { BLOCK_UPDATE_INTERVAL } from 'constants/index';
import { web3Socket } from 'utils/web3';

const { log, error } = console;

export interface web3ListenerParams {
  id?: string; // Identifier for the listener
  address?: string;
  update: Function; // General callback method executed by the event listener. Is passed the event name as param;
  blockDivider?: number; // Determines when updates take place. blockHeight % blockDivider === 0 determine its;
  extendListener?: Function; // extends functions provided in template below, would provide socket variable as param
  lastUpdate?: number; // If provided, it keeps track of when the last update was made
  monitor?: any[]; // Array containing transactions to monitor
  onMonitor?: Function;
  chainId?: number;
  onBalanceChange?: Function;
}

/**
 * Base method - Sets up a websocket connection and executes functions related to
 *  event listeners based on configuration provided by socketConfig
 *  - socketconfig: Contains callback methods meant to execute when certain blockchain events take place
 */
export const web3Listener = (socketConfig: web3ListenerParams) => {
  try {
    const {
      id,
      update,
      blockDivider,
      monitor,
      onMonitor,
      chainId,
      lastUpdate,
    } = socketConfig;

    const socket = web3Socket(chainId);

    let firstBlockDetected = 0;

    // Shorthand definition for functions that need to be executed when events take place
    // event is used to indicate to which event the update is responding to
    const divider = blockDivider || BLOCK_UPDATE_INTERVAL;

    const conditionalUpdate = (block: number, updateReason: string) => {
      // We update only if within the update interval, this helps preventing calls during rerendering
      if (lastUpdate && block - lastUpdate >= divider) {
        update(updateReason, block, id);
      } else if (!lastUpdate) {
        update(updateReason, block, id);
      }
    };

    // Runs an update when block number leaves no decimal when divided by BLOCK_UPDATE_INTERVAL
    socket.on('block', block => {
      if (firstBlockDetected === 0) {
        firstBlockDetected = block;
        update('initial', `${block}`, id, true); // We force a balance update because block 0 means first load
      }
      // Customized times for specific chains
      const chainIntervals = {
        1: 1,
        10: 2,
        56: 10,
        250: 25,
        137: 10,
        1285: 1,
        42161: 30,
        43114: 20,
      };

      if (
        chainId &&
        chainIntervals[chainId] &&
        block % chainIntervals[chainId] === 0
      ) {
        conditionalUpdate(block, 'update');
      } else if (block % divider === 0) {
        conditionalUpdate(block, 'block');
      }

      if (block % 3 === 0 && monitor && monitor.length > 0) {
        // Verify if transactions
        if (onMonitor) {
          onMonitor();
        }
      }
    });

    // Logs error when error is made when connecting to websocket
    socket.on('error', error => {
      log('Error connecting to websocket', error);
      console.error(error);
    });

    return socket;
  } catch (e) {
    error('Error setting socketing');
    console.error(e);
    error(e);
  }
};

export default web3Listener;
