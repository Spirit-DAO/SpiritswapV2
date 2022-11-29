import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { IBribeFarm } from 'app/interfaces/BribeFarm';
import { transactionResponse } from 'utils/web3/actions/utils';
import { BigNumber, utils } from 'ethers';
import { approve, submitBribe } from 'utils/web3';

export const useBribe = () => {
  const { addToQueue } = Web3Monitoring();

  const createNewBribe = async ({
    token,
    tokenValue,
    bribeAddress,
  }: IBribeFarm) => {
    const amountParsed: BigNumber = utils.parseUnits(
      tokenValue,
      token.decimals,
    );

    try {
      const txApprove = await approve(
        token.address,
        bribeAddress,
        amountParsed,
      );
      await txApprove.wait();

      const tx = await submitBribe(bribeAddress, token.address, amountParsed);
      addToQueue(
        transactionResponse('inspirit.bribe', {
          tx,
          operation: 'BRIBE',
          uniqueMessage: {
            text: 'Submitting bribe',
          },
          update: 'bribes',
          updateTarget: 'user',
        }),
      );
      await tx.wait();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    createNewBribe,
  };
};
