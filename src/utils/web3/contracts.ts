import { ethers } from 'ethers';

import { BASE_TOKEN_ADDRESS, CHAIN_ID } from 'constants/index';
import addresses from 'constants/contracts';
import {
  Contract as MulticallContract,
  Provider as MulticallProvider,
} from 'ethcall';
import multicallABI from './abis/Multicall.json';
import masterchefABI from './abis/masterchef.json';
import souschefABI from './abis/sousChef.json';
import masterChefABI2 from './abis/masterchefV2.json';
import gaugeABI from './abis/gauges.json';
import erc20ABI from './abis/erc20.json';
import erc20Bytes32ABI from './abis/erc20-bytes32.json';
import inSpiritABI from './abis/inspirit.json';
import inSpiritLPABI from './abis/inspiritLp.json';
import feeDistributorABI from './abis/feeDistributor.json';
import gaugeProxyABI from './abis/gaugeproxy.json';
import gaugeProxyV3ABI from './abis/gaugeproxyV3.json';
import stableProxyABI from './abis/stableproxy.json';
import pairABI from './abis/IUniswapV2Pair.json';
import pairV2ABI from './abis/pairV2.json';
import spiritABI from './abis/spirit.json';
import sobVaultABI from './abis/sobVault.json';
import sobPoolABI from './abis/sobPool.json';
import routerV2 from './abis/routerv2.json';
import routerV3 from './abis/routerv3.json';
import bribeABI from './abis/bribe.json';
import factoryABIV2 from './abis/factoryV2.json';
import factoryABIV3 from './abis/factoryV3.json';
import twilightFarmFactoryABI from './abis/twilightFarmFactory.json';
import twilightFarmABI from './abis/twilightFarm.json';
import olaLensABI from './abis/olaLens.json';
import WeightedPoolABI from './abis/WeightedPool.json';
import WeightedPool2TokensABI from './abis/WeightedPool.json';
import BeethovenMasterChefABI from './abis/temp/BeethovenxMasterChef.json';
import LendAndBorrowABI from './abis/lendAndBorrow.json';
import wrappedFTMABI from './abis/wrappedFTM.json';
import V3AlgebraFactoryABI from './abis/v3/algebraFactory.json';
import V3AlgebraPoolABI from './abis/v3/algebraPool.json';
import V3AlgebraQuoterABI from './abis/v3/algebraQuoter.json';
import V3NonfungiblePositionManagerABI from './abis/v3/nonfungiblePositionManager.json';
import V3SwapRouterABI from './abis/v3/swapRouter.json';
import V3EternalFarmingABI from './abis/v3/eternalFarming.json';
import V3FarmingCenterABI from './abis/v3/farmingCenter.json';
import V3MulticallABI from './abis/v3/multicall.json';
import { connect } from './connection';
import { Call, MulticallSingleResponse, Web3Provider } from './types';
import { CONNECTIONS } from 'app/connectors/EthersConnector/login';

const { mulltiCall } = addresses;

export const ABIS = {
  spirit: spiritABI,
  multicall: multicallABI,
  masterchef: masterchefABI,
  masterchef2: masterChefABI2,
  gauge: gaugeABI,
  souschef: souschefABI,
  erc20: erc20ABI,
  erc20Bytes32: erc20Bytes32ABI,
  inspirit: inSpiritABI,
  inspiritLp: inSpiritLPABI,
  feedistributor: feeDistributorABI,
  gaugeproxy: gaugeProxyABI,
  gaugeproxyV3: gaugeProxyV3ABI,
  stableproxy: stableProxyABI,
  sobVault: sobVaultABI,
  wVault: sobVaultABI,
  sobPool: sobPoolABI,
  router: routerV2,
  routerV2: routerV3,
  pair: pairABI,
  pairV2: pairV2ABI,
  bribe: bribeABI,
  factory: factoryABIV2,
  factoryV2: factoryABIV3,
  twilightFarmFactory: twilightFarmFactoryABI,
  twilightFarm: twilightFarmABI,
  olaLens: olaLensABI,
  wPool: WeightedPoolABI,
  w2tPool: WeightedPool2TokensABI,
  beetmasterchef: BeethovenMasterChefABI,
  lendAndBorrow: LendAndBorrowABI,
  wrappedFTM: wrappedFTMABI,
  v3AlgebraFactory: V3AlgebraFactoryABI,
  v3AlgebraPool: V3AlgebraPoolABI,
  v3AlgebraQuoter: V3AlgebraQuoterABI,
  v3NonfungiblePositionManager: V3NonfungiblePositionManagerABI,
  v3SwapRouter: V3SwapRouterABI,
  v3EternalFarming: V3EternalFarmingABI,
  v3FarmingCenter: V3FarmingCenterABI,
  v3Multicall: V3MulticallABI,
};

let multicallContract;

export async function Contract(
  _address: string,
  _abi: string = 'erc20',
  _connectionUrl: Web3Provider | string = 'rpc',
  _network = CHAIN_ID,
  _provider: any = null,
  isSigner: boolean = false,
) {
  let provider;
  let signer;

  if (typeof _connectionUrl === 'object' && _connectionUrl.connection) {
    provider = _connectionUrl;
  } else {
    ({ provider, signer } = await connect({
      _connection: _connectionUrl,
      _chainId: _network,
    }));
  }

  if (isSigner) {
    provider = _provider;
  }

  const instance = new ethers.Contract(
    _address,
    ABIS[_abi],
    _provider
      ? _provider
      : CONNECTIONS().includes(_connectionUrl)
      ? signer
      : provider,
  );

  return instance;
}

export async function Multicall(
  _calls: Call[],
  _connectABI: string,
  _network = CHAIN_ID,
  _rpc: Web3Provider | string | undefined = 'rpc',
  _provider: any = null,
) {
  if (!multicallContract) {
    multicallContract = await Contract(
      mulltiCall[_network],
      'multicall',
      _rpc,
      _network,
      _provider,
    );
  }

  const formattedCalls = _calls?.map(_call => {
    const call = _call;

    if (!call.address) {
      call.address = addresses[_connectABI][_network];
    }

    return call;
  });

  const itf = new ethers.utils.Interface(ABIS[_connectABI]);

  const calls = formattedCalls?.map(_call => {
    return [_call.address, itf.encodeFunctionData(_call.name, _call.params)];
  });

  const fulldata = await multicallContract.callStatic.aggregate(calls);
  const { returnData } = fulldata;

  const response: Array<MulticallSingleResponse> = returnData.map(
    (_call, i) => {
      const decoding = itf.decodeFunctionResult(_calls[i].name, _call);
      const res: MulticallSingleResponse = {
        response: decoding,
        call: _call,
      };
      return res;
    },
  );

  return response;
}

export async function MultiCallArray(
  _callsArray: Call[][],
  _connectABIs: string[],
  _network = CHAIN_ID,
  _rpc: Web3Provider | string | undefined = 'rpc',
  _provider: any = null,
) {
  if (!multicallContract) {
    multicallContract = await Contract(
      mulltiCall[_network],
      'multicall',
      _rpc,
      _network,
      _provider,
    );
  }

  let allCalls: (string | undefined)[][] = [];
  let allABIInterfaces: {
    interface: ethers.utils.Interface;
    callName: string;
  }[] = [];
  let callLengths: number[] = [];

  for (let i = 0; i < _callsArray.length; i++) {
    const _calls = _callsArray[i];
    const _connectABI = _connectABIs[i];

    const formattedCalls = _calls.map(_call => {
      const call = _call;
      if (!call.address) {
        call.address = addresses[_connectABI][_network];
      }
      return call;
    });

    const itf = new ethers.utils.Interface(ABIS[_connectABI]);
    const calls = formattedCalls.map(_call => {
      return [_call.address, itf.encodeFunctionData(_call.name, _call.params)];
    });

    allCalls.push(...calls);
    allABIInterfaces.push(
      ...formattedCalls.map(_call => ({
        interface: itf,
        callName: _call.name,
      })),
    );
    callLengths.push(calls.length);
  }

  const fulldata = await multicallContract.callStatic.aggregate(allCalls);
  const { returnData } = fulldata;

  let responses: Array<MulticallSingleResponse>[] = [];
  let startIndex = 0;

  for (let i = 0; i < callLengths.length; i++) {
    let endIndex = startIndex + callLengths[i];
    let callResponses = returnData
      .slice(startIndex, endIndex)
      // eslint-disable-next-line no-loop-func
      .map((_call, j) => {
        const decoding = allABIInterfaces[
          startIndex + j
        ].interface.decodeFunctionResult(
          allABIInterfaces[startIndex + j].callName,
          _call,
        );
        const res: MulticallSingleResponse = {
          response: decoding,
          call: _call,
        };
        return res;
      });

    responses.push(callResponses);
    startIndex = endIndex;
  }

  return responses;
}

export async function MulticallV2(
  _calls: Call[],
  _connectABI: string,
  _network = CHAIN_ID,
  _rpc = 'rpc',
) {
  const { provider } = await connect({});
  const ethCallProvider = new MulticallProvider();
  ethCallProvider.init(provider);

  const formattedCalls = _calls.map(_call => {
    const call = _call;

    if (!call.address) {
      call.address = addresses[_connectABI][_network];
    }

    return call;
  });

  const finalCalls: any[] = [];

  formattedCalls.forEach(call => {
    let action;
    if (
      call.name === 'balanceOf' &&
      call.address === BASE_TOKEN_ADDRESS &&
      call.params
    ) {
      action = ethCallProvider.getEthBalance(call.params[0]);
    } else {
      const targetContract = new MulticallContract(
        `${call.address}`,
        ABIS[_connectABI],
      );
      if (call.params) {
        const isArray = Array.isArray(call.params[0]);
        if (isArray) {
          action = targetContract[call.name](...call.params[0]);
        } else {
          action = targetContract[call.name](call.params[0]);
        }
      }
    }
    finalCalls.push(action);
  });

  const data = await ethCallProvider.tryAll(finalCalls);

  return data;
}
