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
        isLoadingData={!spiritWarsData.length}
      />
      <Statistics
        {...spiritWarsStatistics}
        isLoadingData={!Object.keys(spiritWarsStatistics).length}
      />
    </Wrapper>
  );
};

export default SpiritWars;
