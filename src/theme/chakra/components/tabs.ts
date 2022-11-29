const Tabs = {
  parts: ['tablist', 'tab', 'tabpanel', 'root'],
  baseStyle: {
    tablist: {
      border: '1px solid rgba(55, 65, 81, 1)',
      w: 'fit-content',
      bg: 'transparent',
      borderRadius: 'md',
      lineHeight: '24px',
      padding: '3px',
      borderColor: 'grayBorderToggle',
    },

    tab: {
      _selected: {
        borderRadius: 'md',
        bg: 'ciTrans15',
        boxShadow: 'none',
        color: 'ci',
      },
    },
    tabpanel: {
      padding: '0px',
    },
  },

  sizes: {},

  variants: {
    danger: {
      tab: {
        _selected: {
          bg: 'dangerBg',
          color: 'red',
        },
      },
    },
    unSelected: {
      tab: {
        _selected: {
          borderRadius: 'md',
          bg: 'none',
          boxShadow: 'none',
          color: 'white',
        },
      },
    },
  },

  defaultProps: {
    size: 'md',
    variant: 'default',
  },
};

export default Tabs;
