import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Presets } from 'store/v3/mint';
import type { Props } from './RangePresets.d';
import { StyledPreset, StyledPresetInner } from './styled';

enum PresetProfits {
  VERY_LOW,
  LOW,
  MEDIUM,
  HIGH,
}

const RangePresets = ({
  isStablecoinPair,
  activePreset,
  handlePresetRangeSelection,
  priceLower,
  price,
  priceUpper,
  isInvalid,
  outOfRange,
}: Props) => {
  const { t } = useTranslation();

  const ranges = useMemo(() => {
    if (isStablecoinPair)
      return [
        {
          type: Presets.STABLE,
          title: `Stablecoins`,
          min: 0.984,
          max: 1.01,
          risk: PresetProfits.VERY_LOW,
          profit: PresetProfits.HIGH,
        },
      ];

    return [
      {
        type: Presets.FULL,
        title: `Full range`,
        min: 0,
        max: Infinity,
        risk: PresetProfits.VERY_LOW,
        profit: PresetProfits.VERY_LOW,
      },
      {
        type: Presets.SAFE,
        title: `Safe`,
        min: 0.8,
        max: 1.4,
        risk: PresetProfits.LOW,
        profit: PresetProfits.LOW,
      },
      {
        type: Presets.NORMAL,
        title: `Common`,
        min: 0.9,
        max: 1.2,
        risk: PresetProfits.MEDIUM,
        profit: PresetProfits.MEDIUM,
      },
      {
        type: Presets.RISK,
        title: `Expert`,
        min: 0.95,
        max: 1.1,
        risk: PresetProfits.HIGH,
        profit: PresetProfits.HIGH,
      },
    ];
  }, [isStablecoinPair]);

  const risk = useMemo(() => {
    if (!priceUpper || !priceLower || !price) return;

    const upperPercent = 100 - (+price / +priceUpper) * 100;
    const lowerPercent = Math.abs(100 - (+price / +priceLower) * 100);

    const rangePercent =
      +priceLower > +price && +priceUpper > 0
        ? upperPercent - lowerPercent
        : upperPercent + lowerPercent;

    if (rangePercent < 7.5) {
      return 5;
    } else if (rangePercent < 15) {
      return (15 - rangePercent) / 7.5 + 4;
    } else if (rangePercent < 30) {
      return (30 - rangePercent) / 15 + 3;
    } else if (rangePercent < 60) {
      return (60 - rangePercent) / 30 + 2;
    } else if (rangePercent < 120) {
      return (120 - rangePercent) / 60 + 1;
    } else {
      return 1;
    }
  }, [price, priceLower, priceUpper]);

  const _risk = useMemo(() => {
    const res: any[] = [];
    const split = risk?.toString().split('.');

    if (!split) return;

    for (let i = 0; i < 5; i++) {
      if (i < +split[0]) {
        res.push(100);
      } else if (i === +split[0]) {
        res.push(parseFloat('0.' + split[1]) * 100);
      } else {
        res.push(0);
      }
    }

    return res;
  }, [risk]);

  return (
    <VStack mt={2}>
      <Flex gap={4} w="full">
        {ranges.map((range, i) => (
          <Flex w="full" key={i}>
            <Button
              w="full"
              backgroundColor={activePreset === range.type ? '' : 'transparent'}
              className={`preset-ranges__button ${
                activePreset === range.type ? 'active' : ''
              } mr-05`}
              onClick={() => {
                handlePresetRangeSelection(range);
                if (activePreset == range.type) {
                  handlePresetRangeSelection(null);
                } else {
                  handlePresetRangeSelection(range);
                }
              }}
              key={i}
            >
              {range.title}
            </Button>
          </Flex>
        ))}
      </Flex>
      <Flex w="full">
        {_risk && !isInvalid && !isStablecoinPair && (
          <HStack
            className={`preset-ranges__description ${outOfRange && 'mt-2'}`}
          >
            <Flex className="f mb-05">
              <Text>{`Risk:`}</Text>
              <Flex alignItems="center" ml={4}>
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <StyledPreset key={i}>
                    <StyledPresetInner
                      key={i}
                      style={{ left: `calc(-100% + ${_risk[i]}%)` }}
                    />
                  </StyledPreset>
                ))}
              </Flex>
            </Flex>
            <Flex ml={4}>
              <Text>{`Profit:`}</Text>
              <Flex alignItems="center" ml={4}>
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <StyledPreset key={i}>
                    <StyledPresetInner
                      key={i}
                      style={{
                        left: `calc(-100% + ${_risk[i]}%)`,
                      }}
                    />
                  </StyledPreset>
                ))}
              </Flex>
            </Flex>
          </HStack>
        )}
      </Flex>
    </VStack>
  );
};

export default RangePresets;
