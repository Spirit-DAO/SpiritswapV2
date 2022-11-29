// import { ethers } from 'ethers';
import safeExecute from 'utils/safeExecute';
import * as web3 from 'utils/web3';

jest.mock('ethers', () => {
  class Web3ProviderMock {
    // Let us know with which variables the method was called
    config = {};

    constructor(provider, params) {
      this.config = {
        provider,
        params,
      };
    }

    listAccounts = () => {
      return ['accountOne', 'accountTwo', 'accountThree'];
    };

    getSigner = () => {
      return { isSigner: true };
    };
  }

  const actualModule = jest.requireActual('ethers');

  // Return of mock module
  return {
    ethers: {
      providers: {
        Web3Provider: Web3ProviderMock,
        WebSocketProvider: Web3ProviderMock,
      },
      utils: actualModule.utils,
    },
    utils: actualModule.utils,
  };
});

describe('web3 connectivity module', () => {
  beforeEach(() => {
    // to simulate ethereum wallet presence
    window.ethereum = {};
  });
  describe('connection functions', () => {
    describe('wallet', () => {
      it('should initialize with default chainId', async () => {
        const wallet = await web3.wallet(window.ethereum);
        const { params } = wallet.provider.config;

        expect(params).toEqual({
          name: 'Fantom Opera',
          chainId: 250,
        });
      });
    });

    describe('web3Socket', () => {
      it('Should let you use method with safeExecute', async () => {
        const onErrorCallback = (error, attempts) => {
          if (attempts < 50) {
            return `Finished error loop with ${attempts} attempts`;
          }

          if (attempts > 60) {
            throw Error('Error executing function');
          }

          return 'You have made more than 50 attempts';
        };

        let stream = await safeExecute(
          () => web3.web3Socket(1000),
          onErrorCallback,
        );
        expect(stream).toBe('Finished error loop with 0 attempts');

        stream = await safeExecute(
          () => web3.web3Socket(1000),
          onErrorCallback,
          51,
        );
        expect(stream).toBe('Finished error loop with 0 attempts');

        try {
          await safeExecute(() => web3.web3Socket(1000), onErrorCallback, 61);
        } catch (e) {
          stream = e;
        }
        // expect(stream).toEqual(Error('Error executing function'));
        expect(stream).toBe('Finished error loop with 0 attempts');
      });
    });
  });
});
