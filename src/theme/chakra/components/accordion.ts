const Accordion = {
  parts: ['container', 'item', 'button', 'panel', 'icon'],
  baseStyle: {
    container: {
      bg: 'grayDarker',
    },
  },

  sizes: {},

  variants: {
    bridge: {
      container: {
        bg: 'bgBox',
        color: 'white',
        width: {
          base: '380px',
          md: '520px',
          lg: '520px',
        },
        borderRadius: '10px',
        margin: '5px',
        boxSizing: 'border-box',
        border: '1px solid #374151',
      },
      icon: {
        color: 'ci',
      },
    },
    liquidity: {
      container: {
        bg: 'bgBoxLighter',
        color: 'white',
        width: '100%',
        justifyContent: 'center',
        borderRadius: '4px',
        border: 'none',
        marginBottom: '4px',
      },
    },
    spiritwars: {
      container: {
        border: 'none',
      },
    },
  },

  defaultProps: {},
};

export default Accordion;
