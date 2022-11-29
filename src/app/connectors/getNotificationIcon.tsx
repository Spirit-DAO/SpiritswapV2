import {
  AddLiquidityNotification,
  BridgeIcon,
  FarmIconNotification,
  ArrowRightIcon,
} from 'app/assets/icons';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'LIQUIDITY':
      return <AddLiquidityNotification />;
    case 'BRIDGE':
      return <BridgeIcon color="grayDarker" />;
    case 'FARM':
      return <FarmIconNotification />;
    case 'SWAP':
      return <ArrowRightIcon color="grayDarker" />;
    default:
      return <></>;
  }
};

export default getNotificationIcon;
