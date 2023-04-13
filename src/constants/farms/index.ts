import farmsList from './farms';
import farmsV2List from './farmsV2';
import farmsRouterV2List from './farmsRouterV2';

export { default as unsupportedFarms } from './unsupportedFarms';

export const farms = farmsList;

export const farmsV2 = farmsV2List;

export const farmsRouterV2 = farmsRouterV2List;

export const allV1farms = farms.concat(farmsV2);

export const inactiveFarms = [
  'SPIRIT-sinSPIRIT',
  'SCARAB-GSCARAB',
  'WFTM-GOHM',
];
export const inactiveInspirit = ['WFTM GOHM', 'SCARAB GSCARAB'];
const allFarms = allV1farms.concat(farmsRouterV2);

export default allFarms;
