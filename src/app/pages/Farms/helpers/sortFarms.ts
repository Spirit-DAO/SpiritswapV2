import { IFarm } from 'app/interfaces/Farm';

export const sortFarms = (
  farms: IFarm[],
  sortBy: number,
  rewards,
  farmsStaked,
) => {
  switch (sortBy) {
    case 1:
      return farms.sort((first, second) => {
        const lowerLpOne = first.lpAddress.toLowerCase();
        const lowerLpTwo = second.lpAddress.toLowerCase();
        const firstSpiritEarned = parseFloat(
          rewards[lowerLpOne] ? rewards[lowerLpOne].earned : 0,
        );
        const secondSpiritEarned = parseFloat(
          rewards[lowerLpTwo] ? rewards[lowerLpTwo].earned : 0,
        );

        if (secondSpiritEarned > firstSpiritEarned) {
          return 1;
        }

        if (firstSpiritEarned > secondSpiritEarned) {
          return -1;
        }

        return 0;
      });
    case 2:
      return farms.sort((first, second) => {
        if (second.totalLiquidity > first.totalLiquidity) {
          return 1;
        }

        if (first.totalLiquidity > second.totalLiquidity) {
          return -1;
        }

        return 0;
      });
    case 3:
      return farms.sort((first, second) => {
        const firstEmissions = parseFloat(
          first.votingWeight ? first.votingWeight.replace('%', '') : '0',
        );
        const secondEmissions = parseFloat(
          second.votingWeight ? second.votingWeight.replace('%', '') : '0',
        );

        if (secondEmissions > firstEmissions) {
          return 1;
        }

        if (firstEmissions > secondEmissions) {
          return -1;
        }

        return 0;
      });
    default:
      //Also for 0
      return farms.sort((first, second) => {
        const lowerLpOne = first.lpAddress?.toLowerCase();
        const lowerLpTwo = second.lpAddress?.toLowerCase();
        const firstLpTokens = parseFloat(
          farmsStaked[lowerLpOne] ? farmsStaked[lowerLpOne].amount : '0',
        );
        const secondLpTokens = parseFloat(
          farmsStaked[lowerLpTwo] ? farmsStaked[lowerLpTwo].amount : '0',
        );

        const firstApr = parseFloat(first.apr!.replaceAll(',', ''));
        const secondApr = parseFloat(second.apr!.replaceAll(',', ''));

        // By default, show a user's staked farms first
        if (secondLpTokens > firstLpTokens) {
          return 1;
        }

        if (firstLpTokens > secondLpTokens) {
          return -1;
        }

        if (secondApr > firstApr) {
          return 1;
        }

        if (firstApr > secondApr) {
          return -1;
        }

        return 0;
      });
  }
};
