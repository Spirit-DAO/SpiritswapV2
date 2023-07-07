import { Box, List, useRadioGroup } from '@chakra-ui/react';
import { IConcentratedFarm, IWalletV3 } from 'app/interfaces/Farm';
import { useMemo } from 'react';
import { FarmTransactionType } from '../../enums/farmTransaction';
import { ConcentratedPositionsPanelItem } from '../ConcentratedPositionsPanelItem';

export default function ConcentratedPositionsPanel({
  wallet,
  farm,
  type,
  preselectedPosition,
  onChange,
}: {
  wallet: IWalletV3 | undefined;
  farm: IConcentratedFarm | undefined;
  type: FarmTransactionType;
  onChange: (value: string) => void;
  preselectedPosition?: string;
}) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'position',
    onChange: onChange,
    defaultValue: String(preselectedPosition),
  });

  const group = getRootProps();

  const positions = useMemo(() => {
    if (!wallet || !farm) return;

    const positionsForFarming = wallet.filter(position => {
      if (type === FarmTransactionType.DEPOSIT) {
        return (
          Number(position.rangeLength) >= farm.rangeLength &&
          !position.eternalFarming &&
          position.eternalAvailable === farm.id &&
          !position.isRemoved
        );
      } else {
        return (
          position.onFarmingCenter &&
          position.pool?.toLowerCase() === farm.pool.id.toLowerCase()
        );
      }
    });

    if (positionsForFarming.length === 0) return [];

    return positionsForFarming;
  }, [wallet, farm, type]);

  return positions ? (
    positions.length === 0 ? (
      <Box p={4} pl={0}>
        No positions for this farming
      </Box>
    ) : (
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
        {...group}
      >
        {positions.map(position => {
          const value = String(position.tokenId);
          const radio = getRadioProps({ value });

          return (
            <ConcentratedPositionsPanelItem
              position={position}
              key={value}
              radio={radio}
            />
          );
        })}
      </List>
    )
  ) : (
    <div>Loading</div>
  );
}
