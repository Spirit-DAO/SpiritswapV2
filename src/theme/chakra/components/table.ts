import { borderRadius } from 'theme/base/borderRadius';
import { fontWeight } from 'theme/base/fontWeight';
import { colors } from '../../base/color';
const Table = {
  parts: ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'tfoot', 'caption'],
  baseStyle: {
    table: {
      color: colors.white,
      th: {
        color: colors.white,
        textTransform: 'capitalize',
        fontWeight: fontWeight.regular,
        textAlign: 'start',
      },
    },
  },
  variants: {
    inspirit: {
      table: {
        th: {
          textAlign: 'start',
          bg: 'none',
          p: '4px 8px',
          color: colors.grayDarker,
          _first: { borderLeftRadius: borderRadius.sm },
          _last: { borderRightRadius: borderRadius.sm },
        },
        tr: {
          td: {
            bg: 'bgBoxLighter',
            textAlign: 'center',
            lineHeight: '17px',
            p: '4px 8px',
            borderY: `4px solid ${colors.bgBox}`,
            _first: {
              borderLeftRadius: borderRadius.md,
              pl: '5px',
            },
            _last: {
              borderRightRadius: borderRadius.md,
            },
          },
        },
      },
    },
    default: {
      table: {
        borderSpacing: '0 4px',
        borderCollapse: 'separate',
        th: {
          textAlign: 'start',
          bg: 'grayBorderBox',
          padding: '4px 8px',
          _first: { borderLeftRadius: borderRadius.sm },
          _last: { borderRightRadius: borderRadius.sm },
        },
        tr: {
          td: {
            bg: 'bgBoxLighter',
            padding: '8px 9px',
          },
        },
      },
    },
    mobile: {
      table: {
        display: 'flex',
        flexDirection: 'row',
        tbody: {
          display: 'flex',
          flexDirection: 'row',
        },
        th: {
          width: '154px',
          display: 'flex',
          alignItems: 'center',
          bg: 'transparent',
          justifyContent: 'flex-start',
          textAlign: 'start',
          height: '55px',
        },
        td: {
          width: '184px',
          bg: 'bgBoxLighter',
          textAlign: 'start',
          borderLeftRadius: borderRadius.sm,
          borderRightRadius: borderRadius.md,
          _first: { display: 'flex' },
          _last: { bg: 'transparent' },
          marginRight: '8px',
          marginBottom: '4px',
        },
        tr: {
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'start',
          borderLeftRadius: borderRadius.sm,
          borderRightRadius: borderRadius.sm,
        },
      },
    },
  },
  defaultProps: {
    variant: 'default',
  },
};

export default Table;
