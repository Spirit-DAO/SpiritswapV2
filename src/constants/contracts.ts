const contracts = {
  factory: {
    42161: '0xEF45d134b73241eDa7703fa787148D9C9F4950b0',
  },
  factoryV2: {
    42161: '0x9d3591719038752db0c8bEEe2040FfcC3B2c6B9c',
  },
  twilight_farm_factory: {
    42161: '0xce7415170c47afe3837b67b6b352a55367a2489a',
  },
  distributor: {
    42161: '0xc07bC04720A37AA9d8DAd18635620d86c4a37d97',
  },
  router: {
    42161: '0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52',
  },
  routerV2: {
    42161: '0x09855B4ef0b9df961ED097EF50172be3e6F13665',
  },
  bonusDistributor: {
    42161: '0x7628316ECD43fD870692Ef6e52c580d4A3a092C1',
  },
  liquidityGenerator: {
    42161: '0x68Ca0F3c4fDf440F54801DAe6B67C8594044D257',
  },
  gauge: {
    42161: '0x420b17f69618610DE18caCd1499460EFb29e1d8f',
  },
  gaugeV2: {
    42161: '0x5b3e653c0832e24a86413b1dc03926319e6f8d52',
  },
  gaugeV3: {
    42161: '0xfe1C8A68351B52E391e10106BD3bf2d0759AFf4e',
  },
  variableProxy: {
    42161: '0xfe1C8A68351B52E391e10106BD3bf2d0759AFf4e',
  },
  stableProxy: {
    42161: '0xad29B1060Dded121F4596b09F13Fa44c9d62BB49',
  },
  adminProxy: {
    42161: '0x41AC759D04f51736F0f71da8b029aAC17267a1BB',
  },
  feedistributor: {
    42161: '0x19F236eaADa7b47C1bCCD5CC6671fC247bffcC21',
    // TODO: Review below contract. It's causing error
    // 42161: '0xD5A2a2d1d35724396bBB547554AD73b52C0f4993',
  },
  masterChefEcosystem: {
    42161: '0xcF58A57B60914f07ce48FC09CF8Ab734d6D6e918',
  },
  masterchef: {
    42161: '0x9083EA3756BDE6Ee6f27a6e996806FBD37F6F093',
  },
  masterchef2: {
    42161: '0xb3bf8AAabAd162f6f4F7A19f769c6ad2ddaC0418',
  },
  sobVault: {
    // 42161: '0x8951B163a2CFfa4A19d4285d5293203C0ca3dC54', // -- spirit
    42161: '0x20dd72ed959b6147912c2e529f0a0c651c33c9ce', // beeth
  },
  wVault: {
    42161: '0x20dd72ed959b6147912c2e529f0a0c651c33c9ce', // beeth
  },
  spirit: {
    42161: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
  },
  inspirit: {
    42161: '0x2FBFf41a9efAEAE77538bd63f1ea489494acdc08',
  },
  inspiritLp: {
    42161: '0xd687dd4b2dca486ab4aafed87990ecef4b28c5a1',
  },
  mInSpirit: {
    42161: '0x3554f3369a3530ABC031D938d2f717006Fe01fA1',
  },
  binSpirit: {
    42161: '0x44e314190d9e4ce6d4c0903459204f8e21ff940a',
  },
  sinSpirit: {
    42161: '0x749F2B95f950c4f175E17aa80aa029CC69a30f09',
  },
  tinSPIRIT: {
    42161: '0x6CAa3e5FebA1f83ec1d80EA2EAca37C3421C33A8',
    421611: '',
  },
  spiritTest: {
    42161: '0x94324f88f41F64266bbf7Cb477F3A7c5785cff73',
  },
  mulltiCall: {
    1: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    10: '0xcA11bde05977b3631167028862bE2a173976CA11',
    56: '0xC50F4c1E81c873B2204D7eFf7069Ffec6Fbe136D',
    100: '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
    137: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
    250: '0x7f1AAcF8c4D33983d1460Da7ff55aE4e64eCb651',
    1285: '0xaeF00A0Cf402D9DEdd54092D9cA179Be6F9E5cE3',
    42161: '0x7a7443f8c577d537f1d8cd4a629d40a3148dd7ee',
    43114: '0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4',
  },
  wftm: {
    42161: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  },
  fusd: {
    42161: '0xad84341756bf337f5a0164515b1f6f993d194e1f',
  },
  feth: {
    42161: '0x658b0c7613e890ee50b8c4bc6a3f41ef411208ad',
  },
  fbtc: {
    42161: '0xe1146b9ac456fcbb60644c36fd3f868a9072fc6e',
  },
  usdc: {
    42161: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  },
  wbtc: {
    42161: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
  },
  weth: {
    42161: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
  },
  cover: {
    42161: '0xB01E8419d842beebf1b70A7b5f7142abbaf7159D',
  },
  cream: {
    42161: '0x657A1861c15A3deD9AF0B6799a195a249ebdCbc6',
  },
  crv: {
    42161: '0x1E4F97b9f9F913c46F1632781732927B9019C68b',
  },
  dai: {
    42161: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
  },
  sfi: {
    42161: '0x924828a9Fb17d47D0eb64b57271D10706699Ff11',
  },
  sushi: {
    42161: '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC',
  },
  snx: {
    42161: '0x56ee926bD8c72B2d5fa1aF4d9E4Cbb515a1E3Adc',
  },
  link: {
    42161: '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8',
  },
  yfi: {
    42161: '0x29b0Da86e484E1C0029B56e817912d778aC0EC69',
  },
  sftm: {
    42161: '0x69c744d3444202d35a2783929a0f930f2fbb05ad',
  },
  zoo: {
    42161: '0x09e145a1d53c0045f41aeef25d8ff982ae74dd56',
  },
  ice: {
    42161: '0xf16e81dce15b08f326220742020379b855b87df9',
  },
  frax: {
    42161: '0xaf319E5789945197e365E7f7fbFc56B130523B33',
  },
  bitb: {
    42161: '0xbac5d43a56696e5d0cb631609e85798f564b513b',
  },
  fxs: {
    42161: '0x82F8Cb20c14F134fe6Ebf7aC3B903B2117aAfa62',
  },
  fusdt: {
    42161: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
  },
  any: {
    42161: '0xdDcb3fFD12750B45d32E084887fdf1aABAb34239',
  },
  cztears: {
    42161: '0x907f1A48918Bb5DE07c12443CAB0e6EEfCC611BC',
  },
  bnb: {
    42161: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454',
  },
  woofy: {
    42161: '0xD0660cD418a64a1d44E9214ad8e459324D8157f1',
  },
  supra: {
    42161: '0xee90fAF3216dFAE5E8aC1f3F48f10527f38fFf78',
  },
  mm: {
    42161: '0xbFaf328Fe059c53D936876141f38089df0D1503D',
  },
  gton: {
    42161: '0xc1be9a4d5d45beeacae296a7bd5fadbfc14602c4',
  },
  busd: {
    42161: '0xc931f61b1534eb21d8c11b24f3f5ab2471d4ab50',
  },
  steak: {
    42161: '0x05848B832E872d9eDd84AC5718D58f21fD9c9649',
  },
  ifusd: {
    42161: '0x9fC071cE771c7B27b7d9A57C32c0a84c18200F8a',
  },
  bifi: {
    42161: '0xad260f380c9a30b1d60e4548a75010ede630b665',
  },
  mim: {
    42161: '0x82f0b8b456c1a451378467398982d4834b6829c1',
  },
  lqdr: {
    42161: '0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9',
  },
  dis: {
    42161: '0x0e121961DD741C9D49C9A04379da944A9D2FAc7a',
  },
  tosdis: {
    42161: '0x0e121961dd741c9d49c9a04379da944a9d2fac7a',
  },
  grim: {
    42161: '0x7ec94c4327dc757601b4273cd67014d7760be97e',
  },
  shade: {
    42161: '0x3A3841f5fa9f2c283EA567d5Aeea3Af022dD2262',
  },
  reaper: {
    42161: '0x117dB78176C8eDe4F12fCd29d85Cd96b91A4cbBb',
  },
  elk: {
    42161: '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c',
  },
  xsteak: {
    42161: '0xb632c5d42bd4a44a617608ad1c7d38f597e22e3c',
  },
  just: {
    42161: '0x37c045be4641328dfeb625f1dde610d061613497',
  },
  casper: {
    42161: '0xc30d1b0ce932c3dd3373a2c23ada4e9608caf345',
  },
  unidx: {
    42161: '0x2130d2a1e51112d349ccf78d2a1ee65843ba36e0',
  },
  rai: {
    42161: '0xa71353bb71dda105d383b02fc2dd172c4d39ef8b',
  },
  nips: {
    42161: '0x667afbb7d558c3dfd20fabd295d31221dab9dbc2',
  },
  start: {
    42161: '0x8ca2ecbce34c322fcea6db912d9dbfd2dda5920d',
  },
  ginspirit: {
    42161: '0x2787bea3366335068bf8b4a253044d09ea4e1c96',
  },
  atri: {
    42161: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
  },
  death: {
    42161: '0xeaF45B62d9d0Bdc1D763baF306af5eDD7C0d7e55',
  },
  rndm: {
    42161: '0x49ac072c793fb9523f0688a0d863aadfbfb5d475',
  },
  ele: {
    42161: '0xAcD7B3D9c10e97d0efA418903C0c7669E702E4C0',
  },
  spell: {
    42161: '0x468003B688943977e6130F4F68F23aad939a1040',
  },
  papr: {
    42161: '0xc5e7a99a20941cbf56e0d4de608332cdb792e23e',
  },
  tarot: {
    42161: '0xc5e2b037d30a390e62180970b3aa4e91868764cd',
  },
  tomb: {
    42161: '0x6c021ae822bea943b2e66552bde1d2696a53fbb7',
  },
  wmemo: {
    42161: '0xddc0385169797937066bbd8ef409b5b3c0dfeb52',
  },
  linspirit: {
    42161: '0xc5713b6a0f26bf0fdc1c52b90cd184d950be515c',
  },
  yoshi: {
    42161: '0x3dc57B391262e3aAe37a08D91241f9bA9d58b570',
  },
  sspell: {
    42161: '0xbB29D2A58d880Af8AA5859e30470134dEAf84F2B',
  },
  fang: {
    42161: '0x49894fcc07233957c35462cfc3418ef0cc26129f',
  },
  olaLens: {
    42161: '0xd392114c8587AAE97d48A9fe14eD680440A0a05c',
  },
  pills: {
    42161: '0xB66b5D38E183De42F21e92aBcAF3c712dd5d6286',
  },
  gohm: {
    42161: '0x91fa20244Fb509e8289CA630E5db3E9166233FDc',
  },
  cyber: {
    42161: '0xB2d65f66B69BF3ac78ad2396d6356F4F0e1036B7',
  },
  dei: {
    42161: '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3',
  },
  deus: {
    42161: '0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44',
  },
  spiritSwapBuner: {
    42161: '0x0BF34815D05f0f6cC91a6Fccb3CeAcD4a1254Ea1',
  },
  olaLensContract: {
    42161: '0x0BF34815D05f0f6cC91a6Fccb3CeAcD4a1254Ea1',
  },
  beets: {
    42161: '0xF24Bcf4d1e507740041C9cFd2DddB29585aDCe1e',
  },
  dope: {
    42161: '0x9F3c6e1bD483cd977DF9B36734E1cD684f1Be621',
  },
  wssquid: {
    42161: '0xb280458B3cf0FAcC33671D52FB0E894447C2539A',
  },
  gphm: {
    42161: '0x354e0bc93d29bb1e48cf4714e1eda6dca4aa8828',
  },
  atlas: {
    42161: '0x92df3eabf7c1c2a6b3d5793f6d53778ea78c48b2',
  },
  rainspirit: {
    42161: '0xf9c6e3c123f0494a4447100bd7dbd536f43cc33a',
  },
  ink: {
    42161: '0xffabb85adb5c25d57343547a8b32b62f03814b12',
  },
  scarab: {
    42161: '0x2e79205648B85485731CFE3025d66cF2d3B059c4',
    421611: '',
  },
  olaLendingLend: {
    42161: '0xAD4AB7130e3bE6D4d02A33b339A9000e8F442617',
  },
};

export default contracts;
