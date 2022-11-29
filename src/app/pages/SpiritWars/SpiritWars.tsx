import { Wrapper } from './style';
import { SpiritWarsList } from './components/SpiritWarsList';
import { Statistics } from './components/Statistics';
import { useAppSelector } from 'store/hooks';
import {
  selectSpiritWarsData,
  selectSpiritWarsStatistics,
} from 'store/general/selectors';

const SpiritWars = () => {
  const spiritWarsData = useAppSelector(selectSpiritWarsData);
  const spiritWarsStatistics = useAppSelector(selectSpiritWarsStatistics);

  return (
    <Wrapper>
      <SpiritWarsList
        tokens={spiritWarsData}
        isLoadingData={spiritWarsData.length === 0}
      />
      <Statistics
        {...spiritWarsStatistics}
        isLoadingData={Object.keys(spiritWarsStatistics).length === 0}
      />
    </Wrapper>
  );
};

export default SpiritWars;
