import {
  ReactNode,
  useCallback,
  useState,
  ChangeEvent,
  useReducer,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import { checkAddress, getSign } from 'app/utils';
import { TokenOptions } from 'app/utils/tokenOptions';
import { Heading, Paragraph } from 'app/components/Typography';
import { PercentBadge } from 'app/components/PercentBadge';
import { Suffix } from 'app/components/Suffix';
import { CardHeader } from 'app/components/CardHeader';
import { LIQUIDITY } from 'constants/icons';
import { ListLiquidityItem } from '../ListLiquidityItem';
import { farms, farmsV2 } from 'constants/farms';
import { ALLOW_V1_V2_MIGRATION } from 'constants/index';
import _ from 'lodash';
import type { FarmData } from './LiquidityPanel.d';
import {
  StyledPanel,
  StyledHeader,
  StyledFooter,
  StyledContent,
  StyledIconToInput,
  StyledNoFarmsBody,
  StyledNoFarmsMessage,
  StyledFarmCount,
  StyledGrayParagraph,
  StyledDescription,
  StyledSubtitle,
} from './styles';
import { useNavigate } from 'app/hooks/Routing';
import { List, Flex } from '@chakra-ui/react';
import { MigratePanel } from '../MigratePanel';
import { CHAIN_ID } from 'constants/index';
import { MigrationManager } from '../MigrationManager';
import { SparklesIcon } from 'app/assets/icons';
import { IconButton } from 'app/components/IconButton';
import { HarvestManager } from '../HarvestManager';
import { useAppSelector } from 'store/hooks';
import { selectFarmRewards } from 'store/user/selectors';
import { balanceReturnData } from 'utils/data';
import { selectLpPrices } from 'store/general/selectors';
import { LIQUIDITY as LIQUIDITY_ROUTE, FARMS } from 'app/router/routes';
import { ListConcentratedLiquidityItem } from '../ListConcentratedLiquidityItem';
import { useEternalFarmingRewards } from 'app/hooks/v3/useEternalFarmingsRewards';

const LiquidityPanel = ({
  liquidityData,
}: {
  liquidityData: balanceReturnData;
}) => {
  const {
    farmList = [],
    stakeList = [],
    v3LiquidityList = [],
    totalValue,
    diffAmount,
    diffPercent,
  } = liquidityData;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const translationPath = 'portfolio.liquidityPanel';
  const commonTranslationPath = 'portfolio.common';
  const farmsTranslationPath = 'farms.common';
  const farmsWithRewards = useAppSelector(selectFarmRewards);
  const [openMigration, setOpenMigration] = useState(false);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const [migrateIndex, setMigrateIndex] = useState<number>(0);
  const [migrateSubIndex, setMigrateSubIndex] = useState<number>(-1);
  const lpTokensPrices = useAppSelector(selectLpPrices);
  const [query, setQuery] = useState<string>('');

  const [concentratedTotalValue, updateConcentratedTotalValue] = useReducer(
    (acc, { tokenId, value }: { tokenId: number; value: number }) => ({
      ...acc,
      [tokenId]: value,
    }),
    {},
  );

  const isLoading =
    liquidityData.farmList !== null && !liquidityData.farmList?.length;

  // const { positionsOnFarming } = useEternalFarmingRewards();

  const onSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  let hasV1Tokens: boolean[] = [false, false];

  const lpAddressesV1: string[] = farms.map(farm => farm.lpAddresses[CHAIN_ID]);
  const farmsLpAdressesV1: string[] = farmsV2
    .filter(farm => farm.gaugeAddress)
    .map(farm => farm.lpAddresses[CHAIN_ID]);

  const farmData = farmList ? farmList : [];
  const stakeData = stakeList ? stakeList : [];
  const concentratedData = v3LiquidityList ? v3LiquidityList : [];

  const farmListWV1 = [...farmData, ...stakeData].map(farm => {
    let rate = lpTokensPrices[farm.address.toLowerCase()];

    const usd = (parseFloat(farm.amount) * parseFloat(rate)).toFixed(2);
    let newFarm;
    if (farm.address) {
      if (lpAddressesV1.includes(farm.address)) {
        newFarm = {
          ...farm,
          isRouterV2: farm.isRouterV2 ?? false,
          rate,
          usd,
        };
        hasV1Tokens[0] = true;
      } else if (farmsLpAdressesV1.includes(farm.address)) {
        newFarm = {
          ...farm,
          isRouterV2: farm.isRouterV2 ?? false,
          rate,
          usd,
        };
        hasV1Tokens[1] = true;
      } else {
        newFarm = {
          ...farm,
          isRouterV2: farm.isRouterV2 ?? true,
          rate,
          usd,
        };
      }
    } else {
      newFarm = {
        ...farm,
        isRouterV2: farm.isRouterV2 ?? true,
        rate,
        usd,
      };
    }
    return newFarm;
  });

  const subFarmLists = [
    _.orderBy(
      farmListWV1.filter(farm => farm.staked),
      ['isRouterV2', 'usd'],
      ['desc'],
    ),
    _.orderBy(
      farmListWV1.filter(farm => !farm.staked),
      ['isRouterV2', 'usd'],
      ['desc'],
    ),
    _.orderBy(
      concentratedData.filter(position => !position.onFarmingCenter),
      ['liquidity'],
      ['desc'],
    ),
    _.orderBy(
      concentratedData.filter(position => position.onFarmingCenter),
      ['liquidity'],
      ['desc'],
    ),
  ];

  const openMigrationManager = index => {
    setMigrateIndex(index);
    setMigrateSubIndex(-1);
    setOpenMigration(true);
  };

  const openHarvestManager = () => {
    onOpen();
  };

  const renderHeader = (): ReactNode => (
    <StyledHeader>
      <CardHeader
        id={LIQUIDITY}
        title={t(`${translationPath}.sub.0.title`)}
        helperContent={{
          title: t(`${translationPath}.sub.0.title`),
          text: [
            t(`${translationPath}.sub.0.helper1`),
            t(`${translationPath}.sub.0.helper2`),
          ],
          showDocs: true,
        }}
      />
      <StyledIconToInput onChange={onSearch} />
    </StyledHeader>
  );

  const renderFooter = (): ReactNode => (
    <StyledFooter>
      <IconButton
        size="small"
        variant="inverted"
        label={t(`${farmsTranslationPath}.claimRewards`)}
        icon={<SparklesIcon />}
        disabled={
          !farmsWithRewards || !farmsWithRewards.length
          // && (!positionsOnFarming || !positionsOnFarming.length)
        }
        onClick={openHarvestManager}
      />
      <Button
        variant="secondary"
        onClick={() => navigate(LIQUIDITY_ROUTE.path)}
      >
        {t(`${translationPath}.footer.add`)}
      </Button>
    </StyledFooter>
  );

  const renderNoFarms = (index: number): ReactNode => (
    <>
      <StyledSubtitle>
        0 {t(`${translationPath}.sub.${index}.unit`)}
      </StyledSubtitle>
      <StyledNoFarmsBody>
        <StyledNoFarmsMessage>
          {t(`${translationPath}.noFarms.${index}.message`)}
        </StyledNoFarmsMessage>
        <Button
          onClick={() => navigate(!index ? LIQUIDITY_ROUTE.path : FARMS.path)}
        >
          {t(`${translationPath}.noFarms.${index}.action`)}
        </Button>
      </StyledNoFarmsBody>
    </>
  );

  const renderFarmList = (list: FarmData[], isFarm: boolean): ReactNode => (
    <>
      {!!list.length && (
        <List
          display="inline-grid"
          gap=" 0.25rem"
          maxH="170px"
          w="full"
          gridAutoFlow="row"
          overflowY="scroll"
          overflowX="hidden"
          css={{
            '&::-webkit-scrollbar': {
              backgroundColor: '#0D1321',
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              boxShadow: 'none',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#374151',
              borderRadius: '4px',
            },
          }}
        >
          {list.map((farm: any, index) =>
            farm.isConcentrated ? (
              <ListConcentratedLiquidityItem
                key={`concentrated-list-${index}`}
                positionDetails={farm}
                handleConcentratedPositionTotalValue={
                  updateConcentratedTotalValue
                }
                options={TokenOptions(
                  farm.eternalAvailable ?? '',
                  farm.eternalFarming ? true : false,
                  'concentrated-liquidity',
                  {
                    tokens: farm.name,
                    positionId: farm.tokenId,
                  },
                )}
              />
            ) : (
              <ListLiquidityItem
                key={`farm-list-${farm.address}-${farm.name}`}
                farmData={farm}
                isV2={farm.isRouterV2}
                isFarm={isFarm}
                subindex={index}
                options={TokenOptions(
                  farm.farmAddress ?? '',
                  farm.staked ? true : false,
                  'liquidity',
                )}
                setOpen={setOpenMigration}
                setMigrateIndex={setMigrateIndex}
                setMigrateSubIndex={setMigrateSubIndex}
              />
            ),
          )}
        </List>
      )}
    </>
  );

  const renderStatus = (): ReactNode => {
    if (isLoading) return null;

    let currentTotal =
      Number(totalValue.replace('$', '')) +
      Object.values<number>(concentratedTotalValue).reduce(
        (acc, v) => acc + v,
        0,
      );

    if (currentTotal === 0) {
      let newTotal = 0;
      farmListWV1.forEach(lp => {
        newTotal += parseFloat(lp.usd) || 0;
      });
      currentTotal = newTotal;
    }

    return (
      <>
        {totalValue && (
          <Flex justifyContent="space-between" mt="12px">
            <Heading level={4}>
              {t(`${commonTranslationPath}.totalValue`)}
            </Heading>
            <Heading level={2}>${currentTotal.toFixed(2)}</Heading>
          </Flex>
        )}
        {(diffAmount || diffPercent !== undefined) && (
          <StyledDescription>
            <Paragraph sub>
              {t(`${commonTranslationPath}.lastChange`)}
            </Paragraph>
            <Suffix
              suffix={
                diffPercent !== undefined ? (
                  <PercentBadge
                    amount={diffPercent}
                    sign={getSign(diffPercent)}
                  />
                ) : null
              }
            >
              {diffAmount && (
                <StyledGrayParagraph>{diffAmount}</StyledGrayParagraph>
              )}
            </Suffix>
          </StyledDescription>
        )}
      </>
    );
  };

  const renderSubFarms = (index: number, list?: FarmData[]): ReactNode => {
    return (
      <>
        <StyledFarmCount level={5}>
          {(list || subFarmLists[index]).length}{' '}
          {t(`${translationPath}.sub.${index}.unit`)}
        </StyledFarmCount>
        {renderFarmList(list || subFarmLists[index], index !== 0)}
        {ALLOW_V1_V2_MIGRATION && hasV1Tokens[index] && (
          <MigratePanel onClick={() => openMigrationManager(index)} />
        )}
      </>
    );
  };

  const renderNotFound = (index: number): ReactNode => (
    <StyledNoFarmsBody>
      <StyledNoFarmsMessage>
        {t(`${translationPath}.noResults.${index}`)}
      </StyledNoFarmsMessage>
      <Button>{t(`${translationPath}.noFarms.${index}.action`)}</Button>
    </StyledNoFarmsBody>
  );

  const renderLiquidityList = (list: FarmData[], index: number): ReactNode => {
    if (isLoading) {
      return (
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          w="full"
          h="170px"
          mb="spacing05"
        />
      );
    }

    if (!list.length) {
      return renderNoFarms(index);
    }

    if (query) {
      const filteredList =
        subFarmLists[index]?.filter((farm: FarmData) =>
          `${farm.name}`.toLowerCase().includes(query.toLowerCase()),
        ) || [];

      return (
        <>
          {renderSubFarms(index, filteredList)}
          {!filteredList.length && renderNotFound(index)}
        </>
      );
    }

    return renderSubFarms(index);
  };

  const renderMigrationManager = (migrateList): ReactNode => {
    if (migrateSubIndex > -1) {
      migrateList = [migrateList[migrateSubIndex]];
    }
    return (
      <MigrationManager
        farmDataArray={migrateList}
        isFarm={migrateIndex === 1}
        isOpen={openMigration}
        setOpen={setOpenMigration}
      />
    );
  };

  const renderHarvestManager = (farms): ReactNode => {
    const farmsWithRewards = farms.filter(farm => +farm.earned > 0);

    return (
      <HarvestManager
        // farmsWithRewards={farmsWithRewards.concat(positionsOnFarming)}
        farmsWithRewards={farmsWithRewards}
        isOpen={isOpen}
        onClose={onClose}
      />
    );
  };

  return (
    <StyledPanel footer={renderFooter()}>
      <StyledContent>
        {renderHeader()}
        {subFarmLists.map((list, index: number) => (
          <div key={`liquidity-panel-sub-${index}`}>
            {renderLiquidityList(list, index)}
            {index === subFarmLists.length - 1 ? renderStatus() : null}
          </div>
        ))}
        {ALLOW_V1_V2_MIGRATION &&
          renderMigrationManager(subFarmLists[migrateIndex])}
        {isOpen && renderHarvestManager(farmsWithRewards)}
      </StyledContent>
    </StyledPanel>
  );
};

export default LiquidityPanel;
