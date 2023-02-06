import { ONE_HOUR, SPIRIT } from 'constants/index';
import _ from 'lodash';
import moment from 'moment';

export const initialPegChartProps = {
  '': [
    {
      datapointAt: '',
      date: '',
      fromToken: '',
      pegPercentage: '',
    },
  ],
};
export interface HistoricalPegProps {
  [key: string]: {
    datapointAt: string;
    date: any;
    fromToken: string;
    pegPercentage: string;
  }[];
}

export const getHistoricalPegForWinSpirits = async (
  listOfAddresses: string[] = [],
) => {
  const makeUrl = (address: string) =>
    `https://www.defiwars.xyz/api/peg-history?fromToken=${address}&toToken=${SPIRIT.address}`;

  const results = await Promise.all(
    listOfAddresses.map(async address => {
      const { dataPoints } = await handleSpiritWarsCache(
        makeUrl(address),
        ONE_HOUR,
      ); // 1 hour

      return dataPoints;
    }),
  );

  let historicalData: HistoricalPegProps = {};

  for (const array of results) {
    let tokenAddress = '';
    const dataPointsArray = array?.map(dataPoint => {
      const { datapointAt, fromToken, pegPercentage } = dataPoint;
      tokenAddress = fromToken;

      return {
        datapointAt,
        fromToken,
        pegPercentage,
        date: moment(datapointAt).format('DD MM YYYY'),
      };
    });

    const filteredArrayPerEachDay = _.uniqBy(
      dataPointsArray,
      (item: { datapointAt: ''; date: ''; fromToken: ''; pegPercentage: '' }) =>
        item.date,
    );

    historicalData[tokenAddress] = filteredArrayPerEachDay;
  }

  return historicalData;
};

export const handleSpiritWarsCache = async (url: string, time: number) => {
  const cache = await caches.open('spirit-cache');
  const match: any = await cache.match(url);
  time = 0;

  const [isValid, parsed] = await isValidCache(match, time);

  if (isValid) {
    return parsed;
  }

  const response = await fetch(url);
  const data = await response.json();
  await cache.put(
    url,
    new Response(JSON.stringify({ ...data, cacheTime: Date.now() })),
  );
  return data;
};

export const isValidCache = async (data: Response, time: number) => {
  if (!data) return [false, null];

  const parsed = await data.json();
  if (!parsed) return [false, null];

  if (!parsed.cacheTime || Date.now() - parsed.cacheTime > time)
    return [false, null];

  return [true, parsed];
};
