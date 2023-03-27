const gauges = [
  {
    pid: 1,
    isPsc: true,
    lpSymbol: 'SPIRIT-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x30748322B6E34545DBe0788C421886AEB5297789',
    },
    gaugeAddress: '0xEFe02cB895b6E061FA227de683C04F3Ce19f3A62',
  },
  {
    pid: 2,
    isPsc: true,
    lpSymbol: 'WBTC-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x279b2c897737a50405ED2091694F225D83F2D3bA',
    },
    gaugeAddress: '0xDccAFCE93E6e57f0464b4639d4aFD7B9Ad006F61',
  },
  {
    pid: 3,
    isPsc: true,
    lpSymbol: 'WETH-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x613BF4E46b4817015c01c6Bb31C7ae9edAadc26e',
    },
    gaugeAddress: '0xE86CeE843a5CE2F40575544B1fFc43CB1701D9ae',
  },
  {
    pid: 4,
    isPsc: true,
    lpSymbol: 'gOHM-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xae9BBa22E87866e48ccAcFf0689AFaa41eB94995',
    },
    gaugeAddress: '0xb3AfA9CB6c53d061bC2263cE15357A691D0D60d4',
  },
  {
    pid: 5,
    isPsc: true,
    lpSymbol: 'FRAX-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x7ed0cdDB9BB6c6dfEa6fB63E117c8305479B8D7D',
    },
    gaugeAddress: '0x805f756d7B2592637725a1b797088c29c9D6A1F8',
  },
  {
    pid: 6,
    isPsc: true,
    lpSymbol: 'wsHEC-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xE1fd274Ef08D50C3ecdaEe90c322b6c2342AE5DE',
    },
    gaugeAddress: '0xaAdd9A7155Dbd447c62C1EB574E2FE3967af2E81',
  },
  {
    pid: 7,
    isPsc: true,
    lpSymbol: 'MIM-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xB32b31DfAfbD53E310390F641C7119b5B9Ea0488',
    },
    gaugeAddress: '0x0B905475bEa057060D066f3D1F85E6902Ae62557',
  },
  {
    pid: 8,
    isPsc: true,
    lpSymbol: 'MAI-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x51Eb93ECfEFFbB2f6fE6106c4491B5a0B944E8bd',
    },
    gaugeAddress: '0x27Dc7cc7175F8Ac26dc7421a3a92DAcdc1a9EF0D',
  },
  {
    pid: 9,
    isPsc: true,
    lpSymbol: 'JEWEL-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x782b3e90d85b72fDD3A15dE534fD0DC9D5Ae46E7',
    },
    gaugeAddress: '0xF399D101fB4D3466f70e2eC25467721eaEC8b460',
  },
  {
    pid: 10,
    isPsc: true,
    lpSymbol: 'ICE-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x936D23C83c2469f6a14B9f5bEaec13879598A5aC',
    },
    gaugeAddress: '0xA6A6f26426FB5FE15b33fAe65d1335B02dC54372',
  },
  {
    pid: 11,
    isPsc: true,
    lpSymbol: 'LQDR-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x4Fe6f19031239F105F753D1DF8A0d24857D0cAA2',
    },
    gaugeAddress: '0x717BDE1AA46a0Fcd937af339f95361331412C74C',
  },
  {
    pid: 12,
    isPsc: true,
    lpSymbol: 'USDC-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xe7E90f5a767406efF87Fdad7EB07ef407922EC1D',
    },
    gaugeAddress: '0xa3C6D55397Dcddaf9f600B082F7a6A918f2F4A5C',
  },
  {
    pid: 13,
    isPsc: true,
    lpSymbol: 'fUSDT-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xd14Dd3c56D9bc306322d4cEa0E1C49e9dDf045D4',
    },
    gaugeAddress: '0xED912897138f8aF455B8F95F75850B11979806D8',
  },

  {
    pid: 14,
    isPsc: true,
    lpSymbol: 'DAI-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xdbc490b47508D31c9EC44aFB6e132AD01C61A02c',
    },
    gaugeAddress: '0x1B6cA59BF8A911eE56e58Eb5E5A97F69356EC6C3',
  },

  {
    pid: 15,
    isPsc: true,
    lpSymbol: 'SPELL-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x19d4092635740699B6E4735701742740e235165A',
    },
    gaugeAddress: '0x02ADc9b582E39dc4Cb727a64d8584830CF1bb9bC',
  },

  {
    pid: 16,
    isPsc: true,
    lpSymbol: 'YFI-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x4fc38a2735C7da1d71ccAbf6DeC235a7DA4Ec52C',
    },
    gaugeAddress: '0x237E7E20bf10a61C8DeD780398AA0D5e69DdfF9c',
  },

  {
    pid: 17,
    isPsc: true,
    lpSymbol: 'SUSHI-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x9Fe4c0CE5F533e96C2b72d852f190961AD5a7bB3',
    },
    gaugeAddress: '0x3FD04eEb74204F8FAa5ea539cd5275EC1a3Aa70C',
  },
  {
    pid: 18,
    isPsc: true,
    lpSymbol: 'LINK-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xd061c6586670792331E14a80f3b3Bb267189C681',
    },
    gaugeAddress: '0x1360E082C01C897339B82eF098ab4e8B271252C8',
  },
  {
    pid: 19,
    isPsc: true,
    lpSymbol: 'CRV-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x374C8ACb146407Ef0AE8F82BaAFcF8f4EC1708CF',
    },
    gaugeAddress: '0x73eCAaD4Fff43619f31D47D66d841dE41A933488',
  },
  {
    pid: 20,
    isPsc: true,
    lpSymbol: 'MULTI-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x15aFDbDb27767d58A58459ae159814b6bBe6f506',
    },
    gaugeAddress: '0xfF1E257F9b482567dE88fcE9788502CbD4cC95F2',
  },
  {
    pid: 21,
    isPsc: true,
    lpSymbol: 'wsSQUID-gOHM LP',
    lpAddresses: {
      421611: '',
      42161: '0x292e3CF358C40c38156F874ac4Fc726F72543E92',
    },
    gaugeAddress: '0x0ccb407510C529EfF71F02348E57E26a406Ac0E1',
  },

  {
    pid: 22,
    isPsc: true,
    lpSymbol: 'JUST-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x0133660D0578Bf9D085033Ea753a27F5Aa2b9de1',
    },
    gaugeAddress: '0x8A500EB01085776918F90438555d45E35fE863C9',
  },
  {
    pid: 23,
    isPsc: true,
    lpSymbol: 'FANG-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x871DD566AB3De61E5Cc8fb16fEE82595b17e9cc6',
    },
    gaugeAddress: '0x3020F2A9d7003923377dE267ac0d6A7F8748e541',
  },
  {
    pid: 24,
    isPsc: true,
    lpSymbol: 'PILLS-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x9C775D3D66167685B2A3F4567B548567D2875350',
    },
    gaugeAddress: '0x3A514Ce911E86164064F30Bf9134085Ae0E514aC',
  },
  {
    pid: 25,
    isPsc: true,
    lpSymbol: 'ZOO-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xDF18DD2631f02D930071DF7d6FF89bbc3718C62F',
    },
    gaugeAddress: '0xd8b503F5Bb44166194B6fB3438918F50341aD63E',
  },
  {
    pid: 26,
    isPsc: true,
    lpSymbol: 'GRIM-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x2c18c39622b90318B0124eCFd6d4aC81efcC51db',
    },
    gaugeAddress: '0x6f45A990D727bdBb447078422CfDD8B53c765741',
  },
  {
    pid: 27,
    isPsc: true,
    lpSymbol: 'TAROT-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xF050133847bb537C7476D054B8bE6e30253Fbd05',
    },
    gaugeAddress: '0xF7d3dE134c9d09998f94a3de5E0D7F3317Dd97be',
  },
  {
    pid: 28,
    isPsc: true,
    lpSymbol: 'wMEMO-MIM LP',
    lpAddresses: {
      421611: '',
      42161: '0xC9B98e4A4e306DFc24bc5b5F66e271e19Fd74c5A',
    },
    gaugeAddress: '0x86762289Ffb97F8DB441a4fAf5ecd335165e8E08',
  },
  {
    pid: 29,
    isPsc: true,
    lpSymbol: 'YOSHI-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x9D2489d0DA3436445a0a5ef8515Dc10B2D8b4eaA',
    },
    gaugeAddress: '0xc1AE6EdBf55214B3FA690Cc376838785cDb6D8FB',
  },
  {
    pid: 30,
    isPsc: true,
    lpSymbol: 'DEUS-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x2599Eba5fD1e49F294C76D034557948034d6C96E',
    },
    gaugeAddress: '0x7a91957097e85bb933828d4cC7db287F573D0B2f',
  },
  {
    pid: 31,
    isPsc: true,
    lpSymbol: 'DEI-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x8eFD36aA4Afa9F4E157bec759F1744A7FeBaEA0e',
    },
    gaugeAddress: '0x6cb0CA6635027623684Ebd3387A6F5188fE90ea2',
  },
  {
    pid: 32,
    isPsc: true,
    lpSymbol: 'PHM-FRAX LP',
    lpAddresses: {
      421611: '',
      42161: '0xbd1e1007825602ceC3266d4EF9Ca493b6FFb4D69',
    },
    gaugeAddress: '0x1b20237B043537B2e56fAbf20E186116703760EC',
  },
  {
    pid: 33,
    isPsc: true,
    lpSymbol: 'CRE8R-FTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x459e7c947E04d73687e786E4A48815005dFBd49A',
    },
    gaugeAddress: '0xDcD990038d9CBe98B84a6aD9dBc880e3d4b06599',
  },
  {
    pid: 34,
    isPsc: true,
    lpSymbol: 'GSCARAB-SCARAB LP',
    lpAddresses: {
      421611: '',
      42161: '0x8e38543d4c764DBd8f8b98C73407457a3D3b4999',
    },
    gaugeAddress: '0x9d0f4A1165dDB957a855A6C64e4e4730272f0399',
  },
  {
    pid: 35,
    isPsc: true,
    lpSymbol: 'gPHM-FRAX LP',
    lpAddresses: {
      421611: '',
      42161: '0x0785e2D14954759a73FeaBae4600e2b451A23dDE',
    },
    gaugeAddress: '0x3079c0AeC6bD47FCbC82E1A3CbA67956D53ca506',
  },
  {
    pid: 36,
    isPsc: true,
    lpSymbol: 'GRIM EVO-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x1e886FEBc93A5ad833e683d044c6B08D622aF8A7',
    },
    gaugeAddress: '0x5852f0EA1941a24c281aA7ABa286AfecC0aC7feD',
  },
  {
    pid: 37,
    isPsc: true,
    lpSymbol: 'ATLAS-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xFFcF183126dF14EC4E59409bAb431885ccEEb1C2',
    },
    gaugeAddress: '0x0680938Dc66DcEb3B1D791172d640e2449Db1D1A',
  },
  {
    pid: 38,
    isPsc: true,
    lpSymbol: 'TREEB-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x2cEfF1982591c8B0a73b36D2A6C2A6964Da0E869',
    },
    gaugeAddress: '0x27829EAaB2972fD49eE753abFc67cC3EaC9c7397',
  },
  {
    pid: 39,
    isPsc: true,
    lpSymbol: 'AVAX-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x058F7F3Eece0Ad064DE27c1d7188E1baB4E5AA1c',
    },
    gaugeAddress: '0x70dFcc39aB4e7718Fff8bC7012bf3b2AB96b9876',
  },
  {
    pid: 40,
    isPsc: true,
    lpSymbol: 'MATIC-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x1a5CB3948dAf3130f37cbD4C2EBD36b7B315Bb5b',
    },
    gaugeAddress: '0x12229A41f878952F6e41feb922BF92986C470a5f',
  },
  {
    pid: 41,
    isPsc: true,
    lpSymbol: 'BOMB-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x11d7fD8Deb7F37EA97218F70550E03fe6683df3D',
    },
    gaugeAddress: '0x567A35E2CC409753a4e261CF4073D297aDb800D9',
  },
  {
    pid: 42,
    isPsc: true,
    lpSymbol: 'BIFI-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xc28cf9aeBfe1A07A27B3A4d722C841310e504Fe3',
    },
    gaugeAddress: '0x356169Bea8c58C3B59e83C650A1608FC54D0c44A',
  },
  {
    pid: 43,
    isPsc: true,
    lpSymbol: 'MIDAS-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xede32b76302CB71cc0467C4B42DAbFfa6b091Dd1',
    },
    gaugeAddress: '0x6d717dDdF5d97AC7cC7e3ea6524cA61233A9460D',
  },
  {
    pid: 44,
    isPsc: true,
    lpSymbol: 'RING-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x33B25FA6EbA0FCf6c7CEF56Fef41Be21B87a2162',
    },
    gaugeAddress: '0x1741b224344e4c12a44EBABF80e5fb9D2E07A363',
  },
  {
    pid: 45,
    isPsc: true,
    lpSymbol: 'GRO-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xF5F20491aF9e7C5D94714faF160EC81387F50579',
    },
    gaugeAddress: '0xf022a9f642373d793a97cA58e08aF7D82459F38A',
  },
  {
    pid: 46,
    isPsc: true,
    lpSymbol: 'ALPACA-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x7a412A09eaBa0CbE20345d8611d937Fb74CFE535',
    },
    gaugeAddress: '0x8523165332daD24A9C0234B46Afd660A5f530E7D',
  },
  {
    pid: 47,
    isPsc: true,
    lpSymbol: 'HND-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x03dE4A4897941712BeBE5362729181257dC9E8B6',
    },
    gaugeAddress: '0xA04887B5C773B76D5c5825D909Fdfbd99e5Ed42e',
  },
  {
    pid: 48,
    isPsc: true,
    lpSymbol: 'beFTM-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xE3D4C22d0543E050a8b3F713899854Ed792fc1bD',
    },
    gaugeAddress: '0xaB9F86eFd519eb9B110542FAF984780e3D99E697',
  },
  {
    pid: 49,
    isPsc: true,
    lpSymbol: 'OATH-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xD0891213C87D68773477428aC800B5F7eECF641e',
    },
    gaugeAddress: '0xfF7956858Ed2A9bC40DAB69CB30521B7576e9136',
  },

  {
    pid: 50,
    isPsc: true,
    lpSymbol: 'COMB-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x95297492B1fAA6047D1D8CE982A0F5cDEB0e9482',
    },
    gaugeAddress: '0xD07395045F1ee27F1662548a5c6185b1E3Cd1dd5',
  },
  {
    pid: 51,
    isPsc: true,
    lpSymbol: 'PGUNK-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x98f70fc717ADcAdE6B0A24df54c49EAbDc5EFC46',
    },
    gaugeAddress: '0x59266B46d0f4821804b66Aa34B39b6B645Ef0B2a',
  },
  {
    pid: 52,
    isPsc: true,
    lpSymbol: 'UNIDX-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x38655f2e859960f3Cc10848777982faBA3451Ec7',
    },
    gaugeAddress: '0x7a00Dd84829299A9dec10Ac7732fCFccD9273063',
  },
  {
    pid: 53,
    isPsc: true,
    lpSymbol: 'UST-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0xFA84CED3DC4bFFAF93d21B9E3A4750F5C2A42886',
    },
    gaugeAddress: '0xb1bC9455Db839655b1a3c1c128E6aB094190b724',
  },
  {
    pid: 54,
    isPsc: true,
    lpSymbol: 'ORKAN-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x5A6880d3e9d715BEf5848c9749cea5F23a982A75',
    },
    gaugeAddress: '0xca05DC1Ab089173F8DeDD89f39dC48ddE36479d5',
  },
  {
    pid: 55,
    isPsc: true,
    lpSymbol: 'ORBS-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x1F0700387Dfe4Aec7b8C99fbf54cdCDbBB5603B5',
    },
    gaugeAddress: '0xd0F5846B411Bd71012b27b061aeD04602D062897',
  },
  {
    pid: 56,
    isPsc: true,
    lpSymbol: 'sFTMX-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x72133BBff5072616E165237e69b3F4c87C1a94e8',
    },
    gaugeAddress: '0x3A3C0449FDd642Dd9Bb714B5B8F90D7f198A0024',
  },
  {
    pid: 57,
    isPsc: true,
    lpSymbol: 'gALCX-WFTM LP',
    lpAddresses: {
      421611: '',
      42161: '0x633EFedFC7F1742A7e70f5Bcb9FA22B15204e56B',
    },
    gaugeAddress: '0xDc2C4dC72dBB3870C537037AA794fddda18ac190',
  },
];

export default gauges;
