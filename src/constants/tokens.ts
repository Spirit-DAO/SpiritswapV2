import { Token } from 'app/interfaces/General';

export const WFTM = {
  name: 'Wrapped Fantom',
  symbol: 'WFTM',
  address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  chainId: 250,
  decimals: 18,
};

export const MIM = {
  name: 'Magic Internet Money',
  symbol: 'MIM',
  address: '0x82f0b8b456c1a451378467398982d4834b6829c1',
  chainId: 250,
  decimals: 18,
};

export const FRAX = {
  name: 'Frax',
  symbol: 'FRAX',
  address: '0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355',
  chainId: 250,
  decimals: 18,
};

export const USDC = {
  name: 'USD Coin',
  symbol: 'USDC',
  address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  chainId: 250,
  decimals: 6,
};

export const FUSD = {
  name: 'Fantom USD',
  symbol: 'fUSD',
  address: '0xad84341756bf337f5a0164515b1f6f993d194e1f',
  chainId: 250,
  decimals: 18,
};

export const FUSDT = {
  name: 'Frapped USDT',
  symbol: 'fUSDT',
  address: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
  chainId: 250,
  decimals: 6,
};

export const DAI = {
  name: 'Dai Stablecoin',
  symbol: 'DAI',
  address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
  chainId: 250,
  decimals: 18,
};

export const FTM = {
  name: 'Fantom',
  symbol: 'FTM',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const USDN = {
  name: 'Neutrino USD',
  symbol: 'USDN',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const USDK = {
  name: 'USDK',
  symbol: 'USDK',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const USDT = {
  name: 'USDT',
  symbol: 'USDT',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const USDX = {
  name: 'USDX',
  symbol: 'USDX',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const AVAX = {
  name: 'Avalanche',
  symbol: 'AVAX',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const DEUS = {
  name: 'DEUS',
  symbol: 'DEUS',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const UOS = {
  name: 'Ultra',
  symbol: 'UOS',
  address: '0x0000000000000000000000000000000000000000',
  chainId: 250,
  decimals: 18,
};

export const TOKEN_EMPTY = {
  name: '',
  symbol: '',
  address: '',
  chainId: 0,
  decimals: 0,
};

export const SPIRIT = {
  name: 'SpiritSwap Token',
  symbol: 'SPIRIT',
  address: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
  chainId: 250,
  decimals: 18,
};

export const SPELL = {
  name: 'Spell Token',
  symbol: 'SPELL',
  address: '0x468003B688943977e6130F4F68F23aad939a1040',
  chainId: 250,
  decimals: 18,
};

export const ICE = {
  name: 'IceToken',
  symbol: 'ICE',
  address: '0xf16e81dce15B08F326220742020379B855B87DF9',
  chainId: 250,
  decimals: 18,
};

const CRE8R = {
  name: 'CRE8R DAO',
  symbol: 'CRE8R',
  address: '0x2ad402655243203fcfa7dcb62f8a08cc2ba88ae0',
  chainId: 250,
  decimals: 18,
};

export const wBOMB = {
  name: 'Wrapped BOMB',
  symbol: 'wBOMB',
  address: '0xC09A82aD5075B3067D80F54f05e1E22229699Cc1',
  decimals: 18,
  chainId: 250,
};

export const JEFE = {
  name: 'JEFE TOKEN',
  symbol: 'JEFE',
  address: '0x5b2AF7fd27E2Ea14945c82Dd254c79d3eD34685e',
  chainId: 250,
  decimals: 9,
};

export const tokens: Token[] = [
  FTM,
  SPIRIT,
  WFTM,
  JEFE,
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
    chainId: 250,
    decimals: 8,
  },
  {
    name: 'Wrapped ETH',
    symbol: 'WETH',
    address: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Curve DAO',
    symbol: 'CRV',
    address: '0x1E4F97b9f9F913c46F1632781732927B9019C68b',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Sushi',
    symbol: 'SUSHI',
    address: '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Synthetix Network',
    symbol: 'SNX',
    address: '0x56ee926bD8c72B2d5fa1aF4d9E4Cbb515a1E3Adc',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'ChainLink',
    symbol: 'LINK',
    address: '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'yearn.finance',
    symbol: 'YFI',
    address: '0x29b0Da86e484E1C0029B56e817912d778aC0EC69',
    chainId: 250,
    decimals: 18,
  },

  {
    name: 'IceToken',
    symbol: 'ICE',
    address: '0xf16e81dce15b08f326220742020379b855b87df9',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Frax Share',
    symbol: 'FXS',
    address: '0x7d016eec9c25232b01F23EF992D98ca97fc2AF5a',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Binance',
    symbol: 'BNB',
    address: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454',
    chainId: 250,
    decimals: 18,
  },

  {
    name: 'Binance USD',
    symbol: 'BUSD',
    address: '0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Beefy.Finance',
    symbol: 'BIFI',
    address: '0xd6070ae98b8069de6B494332d1A1a81B6179D960',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Just Yours',
    symbol: 'JUST',
    address: '0x37c045be4641328dfeb625f1dde610d061613497',
    chainId: 250,
    decimals: 10,
  },

  {
    name: 'Liquid Driver',
    symbol: 'LQDR',
    address: '0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Shade Cash',
    symbol: 'SHADE',
    address: '0x3a3841f5fa9f2c283ea567d5aeea3af022dd2262',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'UniDex',
    symbol: 'UNIDX',
    address: '0x2130d2a1e51112d349ccf78d2a1ee65843ba36e0',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Spooky Token',
    symbol: 'BOO',
    address: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Tomb',
    symbol: 'TOMB',
    address: '0x6c021ae822bea943b2e66552bde1d2696a53fbb7',
    chainId: 250,
    decimals: 18,
  },

  {
    name: 'TAROT',
    symbol: 'TAROT',
    address: '0xC5e2B037D30a390e62180970B3aa4E91868764cD',
    chainId: 250,
    decimals: 18,
  },

  {
    name: 'ginSpirit',
    symbol: 'ginSPIRIT',
    address: '0x2787bea3366335068bf8b4a253044d09ea4e1c96',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Spell',
    symbol: 'SPELL',
    address: '0x468003B688943977e6130F4F68F23aad939a1040',
    chainId: 250,
    decimals: 18,
  },

  {
    name: 'BeethovenxToken',
    symbol: 'BEETS',
    address: '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'PaintSwap Token',
    symbol: 'BRUSH',
    address: '0x85dec8c4b2680793661bca91a8f129607571863d',
    chainId: 250,
    decimals: 18,
  },

  {
    name: 'WalletNow',
    symbol: 'WNOW',
    address: '0xA9CAd0165C155f3998b0001b3eF30bCa0aa6B591',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Bison',
    symbol: 'BISON',
    address: '0xd2f38621c3C65300ECabA7020c05d1350f9C265c',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Synapse',
    symbol: 'SYN',
    address: '0xe55e19fb4f2d85af758950957714292dac1e25b2',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'YOSHI.exchange',
    symbol: 'YOSHI',
    address: '0x3dc57B391262e3aAe37a08D91241f9bA9d58b570',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'linSPIRIT',
    symbol: 'linSPIRIT',
    address: '0xc5713b6a0f26bf0fdc1c52b90cd184d950be515c',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'METRIC',
    symbol: 'METRIC',
    address: '0x44293e446d4fe519f177ee221055cb9e5dc4ac5b',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'MAI',
    symbol: 'MAI',
    address: '0xfb98b335551a418cd0737375a2ea0ded62ea213b',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'HectorDAO',
    symbol: 'HEC',
    address: '0x5C4FDfc5233f935f20D2aDbA572F770c2E377Ab0',
    chainId: 250,
    decimals: 9,
  },
  {
    name: 'Midas',
    symbol: 'MIDAS',
    address: '0xb37528da6b4d378305d000a66ad91bd88e626761',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Governance OHM',
    symbol: 'GOHM',
    address: '0x91fa20244Fb509e8289CA630E5db3E9166233FDc',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Wrapped sHEC',
    symbol: 'WSHEC',
    address: '0x94ccf60f700146bea8ef7832820800e2dfa92eda',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Jewels',
    symbol: 'JEWEL',
    address: '0xD97F9674E2597e7a252de4875985f4385B9608fB',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Comb Finance',
    symbol: 'COMB',
    address: '0xaE45a827625116d6C0C40B5D7359EcF68F8e9AFD',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'GSCARAB',
    symbol: 'GSCARAB',
    address: '0x6ab5660f0B1f174CFA84e9977c15645e4848F5D6',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'SCARAB',
    symbol: 'SCARAB',
    address: '0x2e79205648B85485731CFE3025d66cF2d3B059c4',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Multichain',
    symbol: 'MULTI',
    address: '0x9Fb9a33956351cf4fa040f65A13b835A3C8764E3',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'AllBridge',
    symbol: 'ABR',
    address: '0x543Acd673960041eEe1305500893260F1887B679',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'PlasmaGunk',
    symbol: 'PGUNK',
    address: '0xf8fc059dafdce4ef2edfc72cbbaf410d7531e610',
    chainId: 250,
    decimals: 9,
  },
  {
    name: 'DEI (OLD)',
    symbol: 'DEI',
    address: '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'DEI (NEW)',
    symbol: 'DEI',
    address: '0xDE1E704dae0B4051e80DAbB26ab6ad6c12262DA0',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'DEUS',
    symbol: 'DEUS',
    address: '0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'binSPIRIT',
    symbol: 'binSPIRIT',
    address: '0x44e314190d9e4ce6d4c0903459204f8e21ff940a',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'sinSPIRIT',
    symbol: 'sinSPIRIT',
    address: '0x749F2B95f950c4f175E17aa80aa029CC69a30f09',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'GRO',
    symbol: 'GRO',
    address: '0x91f1430833879272643658f8ed07d60257ddf321',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'GRIM EVO',
    symbol: 'GRIMEVO',
    address: '0x0a77866c01429941bfc7854c0c0675db1015218b',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Treeb',
    symbol: 'TREEB',
    address: '0xc60D7067dfBc6f2caf30523a064f416A5Af52963',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Avalanche',
    symbol: 'AVAX',
    address: '0x511D35c52a3C244E7b8bd92c0C297755FbD89212',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'MATIC',
    symbol: 'MATIC',
    address: '0x40DF1Ae6074C35047BFF66675488Aa2f9f6384F3',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'BOMB',
    symbol: 'BOMB',
    address: '0x8503eb4A136bDBeB323E37Aa6e0FA0C772228378',
    chainId: 250,
    decimals: 0,
  },
  {
    name: 'rainSPIRIT',
    symbol: 'rainSPIRIT',
    address: '0xf9c6e3C123f0494A4447100bD7dbd536F43CC33A',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Oath',
    symbol: 'OATH',
    address: '0x21Ada0D2aC28C3A5Fa3cD2eE30882dA8812279B6',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'OneRing',
    symbol: 'RING',
    address: '0x582423C10c9e83387a96d00A69bA3D11ee47B7b5',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'AlpacaToken',
    symbol: 'ALPACA',
    address: '0xaD996A45fd2373ed0B10Efa4A8eCB9de445A4302',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Hundred Finance',
    symbol: 'HND',
    address: '0x10010078a54396F62c96dF8532dc2B4847d47ED3',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'veDao',
    symbol: 'WeVE',
    address: '0x911da02C1232A3c3E1418B834A311921143B04d7',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Beefy Escrowed Fantom',
    symbol: 'beFTM',
    address: '0x7381eD41F6dE418DdE5e84B55590422a57917886',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Orbs',
    symbol: 'ORBS',
    address: '0x3E01B7E242D5AF8064cB9A8F9468aC0f8683617c',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'tinSPIRIT',
    symbol: 'tinSPIRIT',
    address: '0x6CAa3e5FebA1f83ec1d80EA2EAca37C3421C33A8',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'governanceALCX',
    symbol: 'gALCX',
    address: '0x70F9fd19f857411b089977E7916c05A0fc477Ac9',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'sFTMX',
    symbol: 'sFTMX',
    address: '0xd7028092c830b5C8FcE061Af2E593413EbbC1fc1',
    chainId: 250,
    decimals: 18,
  },
  {
    name: 'Orkan',
    symbol: 'ORKAN',
    address: '0xfB66e49e303A186a4c57414Ceeed651a7a78161a',
    chainId: 250,
    decimals: 9,
  },
  {
    name: 'Alchemix USD',
    symbol: 'alUSD',
    address: '0xB67FA6deFCe4042070Eb1ae1511Dcd6dcc6a532E',
    decimals: 18,
    chainId: 250,
  },

  {
    name: 'Wrapped PlasmaGunk',
    symbol: 'WPGUNK',
    address: '0x2B6850bF31874d96A21eD4Dc7C6415B9640BE2A4',
    decimals: 9,
    chainId: 250,
  },
  {
    name: 'Nectar',
    symbol: 'NECT',
    address: '0xcEddEC9a3134a440E77C7DcAD6F35fdF398A49Fc',
    decimals: 18,
    chainId: 250,
  },
  {
    name: 'Ankr Staked FTM',
    symbol: 'ankrFTM',
    chainId: 250,
    address: '0xCfC785741Dc0e98ad4c9F6394Bb9d43Cd1eF5179',
    decimals: 18,
  },

  wBOMB,
  MIM,
  FRAX,
  USDC,
  FUSD,
  FUSDT,
  DAI,
  CRE8R,
];

// Common tokens lists
export const FIRST_TOKEN_AMOUNT_PANEL = [FTM, USDC, FUSDT, MIM];
export const SECOND_TOKEN_AMOUNT_PANEL = [SPIRIT, FTM, USDC, FUSDT];
export const LIQUIDITY_TOKENS = [SPIRIT, FTM, USDC, FUSDT];

export default tokens;
