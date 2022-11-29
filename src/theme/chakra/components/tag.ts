const Tags = {
  parts: ['container', 'label', 'closeButton'],
  baseStyle: {
    container: {
      w: 'fit-content',

      fontSize: '16px',
      lineHeight: '24px',
      padding: '3px',
    },
  },

  sizes: {},

  variants: {
    default: {
      container: {
        border: '1px solid',
        borderColor: 'rgba(55, 65, 81, 1)',
        borderRadius: 'full',
        bg: 'bgBoxLighter',
        fontWeight: 'bold',
      },
    },
  },

  defaultProps: {
    size: 'sm',
    variant: 'default',
  },
};

export default Tags;
