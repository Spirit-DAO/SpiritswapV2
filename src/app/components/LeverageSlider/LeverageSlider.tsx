import React, { FC, useState } from 'react';
import {
  SliderTrack,
  SliderMark,
  Slider,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { Props } from './LeverageSlider.d';
const LeverageSlider: FC<Props> = ({ onStepSliderHandler, realValue }) => {
  const [sliderValue, setSliderValue] = useState<number>(11);

  const handleChange = value => {
    onStepSliderHandler(value / 10);
    setSliderValue(value);
  };

  return (
    <Slider
      focusThumbOnChange={false}
      // TODO: [DEV]
      colorScheme="teal"
      aria-label="slider-ex-6"
      onChange={v => handleChange(v)}
      value={realValue * 10}
      defaultValue={sliderValue}
      min={11}
      max={30}
    >
      <SliderMark value={11} mt="3" ml="-2" fontSize="xs">
        1.1x
      </SliderMark>
      <SliderMark value={15} mt="3" ml="-2" fontSize="xs">
        1.5x
      </SliderMark>
      <SliderMark value={20} mt="3" ml="-2" fontSize="xs">
        2x
      </SliderMark>
      <SliderMark value={25} mt="3" ml="-2" fontSize="xs">
        2.5x
      </SliderMark>
      <SliderMark value={30} mt="3" ml="-2" fontSize="xs">
        3x
      </SliderMark>

      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb w="12px" h="12px" />
    </Slider>
  );
};
export default LeverageSlider;
