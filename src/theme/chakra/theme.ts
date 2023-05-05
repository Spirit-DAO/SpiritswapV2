import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// Overwritten properties
import { colors } from 'theme/base/color';
import { borderRadius } from 'theme/base/borderRadius';
import { spacing as space } from 'theme/base/spacing';
import { fontSize as fontSizes } from 'theme/base/fontSize';
import { fontFamily } from 'theme/base/fontFamily';
import { fontWeight as fontWeights } from 'theme/base/fontWeight';
import { lineHeight as lineHeights } from 'theme/base/lineHeight';
import { breakpoints } from 'theme/base/breakpoints';
import { shadows } from 'theme/base/shadows';
import { globalStyles as styles } from './styles';
import {
  Button,
  Input,
  Accordion,
  Tabs,
  Table,
  NumberInput,
  Modal,
  Tag,
  Heading,
  Container,
  Skeleton,
  SliderMark,
} from './components';
import { CustomChakraSteps } from './custom/customChakraSteps';
import { inputStyles } from './components/inputStyles';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  cssVarPrefix: 'spirit',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles,
  breakpoints,
  colors,
  borderRadius,
  fontSizes,
  fontFamily,
  fontWeights,
  lineHeights,
  space,
  shadows,
  components: {
    Modal,
    Button,
    Input,
    NumberInput,
    SliderMark,
    Accordion,
    Tabs,
    Table,
    Tag,
    Heading,
    Steps: CustomChakraSteps,
    Container,
    Skeleton,
    Select: { ...inputStyles },
  },
});

export default theme;
