export interface Props {
  dataLabels?: {
    titleLabel: string;
    totalSpiritLockedLabel: string;
    totalDistributionLabel: string;
    averageUnlockTimeLabel: string;
    aprLabel: string;
    spiritPerInspiritLabel: string;
    nextDistributionLabel: string;
    selectLabels: string[];
  };
  dataValues?: { [key: string]: string };
}
