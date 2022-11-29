/**
 * app/utils/constants.ts
 *
 * Describe common constant values
 *
 */
import { Currency } from './types';

export const CurrencySymbol: { [key in keyof typeof Currency]: string } = {
  [Currency.EUR]: '€',
  [Currency.USD]: '$',
};

export const LanguageItems = [
  { id: 'en', value: 'English', type: 'languages' },
  // { id: 'es', value: 'Español', type: 'languages' },
  // { id: 'de', value: 'Deutsch', type: 'languages' },
  // { id: 'zh', value: '中文', type: 'languages' },
  // { id: 'fr', value: 'Français', type: 'languages' },
  // { id: 'ru', value: 'Русский', type: 'languages' },
  // { id: 'ar', value: 'العربية', type: 'languages' },
  // { id: 'pt', value: 'Português', type: 'languages' },
];

export const InfoGraphics = {
  swap: ['swap01', 'swap02', 'swap03', 'swap04'],
  farms: ['farms01', 'farms02', 'farms03', 'farms04', 'farms05'],
  bridge: ['bridge01', 'bridge02'],
  inSpirit: [
    'inspirit01',
    'inspirit02',
    'inspirit03',
    'inspirit04',
    'inspirit05',
    'inspirit06',
  ],
  leverage: ['ape01', 'ape02', 'ape03', 'ape04'],
  lend: ['lend01', 'lend02', 'lend03', 'lend04', 'lend05', 'lend06'],
};

export const CHART_DURATIONS = {
  weeks: { value: 'W', ID: 0 },
};

export const CHART_LABELS_POINTS = [0, 5, 10, 15, 20, 25, 29];

export const CHART_STYLE = {
  BARS: { name: 'Bar', ID: 0 },
  LINES: { name: 'Line', ID: 1 },
};

export const INITIAL_SELL_AMOUNT = '1000000000000000000';
