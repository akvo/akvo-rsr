export const gridConf = {
  mediaQuery: 'only screen',
  columns: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 12,
    xl: 12,
  },
  gutterWidth: {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 2,
    xl: 2,
  },
  paddingWidth: {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 2,
    xl: 2,
  },
  container: {
    xs: 'full', // 'full' = max-width: 100%
    sm: 'full', // 'full' = max-width: 100%
    md: 48, // max-width: 768px
    lg: 80, // max-width: 1280px
    xl: 90, // max-width: 1440px
  },
  breakpoints: {
    xs: 1,
    sm: 36, // 576px
    md: 48, // 768px
    lg: 80, // 1280px
    xl: 90, // 1440px
  },
}

export const theme = {
  space: {
    lg: '32px',
    md: '32px',
    sm: '16px',
    xs: '16px'
  },
  margin: {
    lg: '64px',
    md: '32px',
    sm: '16px',
    xs: '16px'
  },
  boxShadow: {
    xs: '0px 1px 2px rgba(29, 41, 57, 0.05)',
    sm: '0px 1px 3px rgba(29, 41, 57, 0.1), 0px 1px 2px rgba(29, 41, 57, 0.06)',
    md: '0px 4px 8px -2px rgba(29, 41, 57, 0.1), 0px 2px 4px -2px rgba(29, 41, 57, 0.06)',
    lg: '0px 12px 16px -4px rgba(29, 41, 57, 0.08), 0px 4px 6px -2px rgba(29, 41, 57, 0.03)',
    xl: '0px 20px 24px -4px rgba(29, 41, 57, 0.08), 0px 8px 8px -4px rgba(29, 41, 57, 0.03)',
    '2xl': '0px 24px 48px -12px rgba(29, 41, 57, 0.18)',
    '3xl': '0px 32px 64px -12px rgba(29, 41, 57, 0.14)'
  },
  font: {
    family: '"Assistant", sans-serif',
    size: {
      xl: '20px',
      lg: '18px',
      md: '16px',
      sm: '14px',
      xs: '12px',
    },
    weight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    heading: {
      family: '"Roboto Condensed", sans-serif',
      '2xl': '96px',
      xl: '56px',
      lg: '48px',
      md: '36px',
      sm: '30px',
      xs: '24px',
    }
  },
  color: {
    white: '#FFFFFF',
    black: '#031B33',
    gray: {
      25: '#FCFCFD',
      50: '#F9FAFB',
      100: '#F2F4F7',
      200: '#EAECF0',
      300: '#D0D5DD',
      400: '#98A2B3',
      500: '#667085',
      600: '#475467',
      700: '#344054',
      800: '#1D2939',
      900: '#101828',
    },
    primary: {
      25: '#F2F7FC',
      50: '#E3EFFC',
      100: '#CAE3FC',
      200: '#BDDCFC',
      300: '#B0D6FC',
      400: '#97C9FC',
      500: '#7EBDFC',
      600: '#4CA3FC',
      700: '#218EFC',
      800: '#1B73CC',
      900: '#165DA6',
    },
    error: {
      25: '#FFFBFA',
      50: '#FEF3F2',
      100: '#FEE4E2',
      200: '#FECDCA',
      300: '#FDA29B',
      400: '#F97066',
      500: '#F04438',
      600: '#D92D20',
      700: '#B42318',
      800: '#912018',
      900: '#7A271A',
    },
    warning: {
      25: '#FFFCF5',
      50: '#FFFAEB',
      100: '#FEF0C7',
      200: '#FEDF89',
      300: '#FEC84B',
      400: '#FDB022',
      500: '#F79009',
      600: '#DC6803',
      700: '#B54708',
      800: '#93370D',
      900: '#7A2E0E',
    },
    success: {
      25: '#F6FEF9',
      50: '#ECFDF3',
      100: '#D1FADF',
      200: '#A6F4C5',
      300: '#6CE9A6',
      400: '#32D583',
      500: '#12B76A',
      600: '#039855',
      700: '#027A48',
      800: '#05603A',
      900: '#054F31',
    }
  },
  gradient: {
    gray: {
      600: 'conic-gradient(from 259.08deg at 50% 50%, #475467 0deg, rgba(71, 84, 103, 0) 360deg)',
      '600-500': 'linear-gradient(90deg, #475467 0%, #667085 100%)',
      '700-600': 'linear-gradient(45deg, #344054 0%, #475467 100%)',
      '800-45': 'linear-gradient(45deg, #1D2939 0%, #475467 100%)',
      '800-90': 'linear-gradient(63.44deg, #1D2939 16.72%, #475467 83.39%)',
      '800-700': 'linear-gradient(26.57deg, #1D2939 8.33%, #344054 91.67%)',
      '900-600': 'linear-gradient(45deg, #101828 0%, #475467 100%)',
    },
    primary: {
      600: 'conic-gradient(from 259.08deg at 50% 50%, #4CA3FC 0deg, rgba(76, 163, 252, 0) 360deg)',
      '600-500': 'linear-gradient(90deg, #4CA3FC 0%, #7EBDFC 100%)',
      '700-600': 'linear-gradient(45deg, #218EFC 0%, #7EBDFC 100%)',
      '800-45': 'linear-gradient(45deg, #1B73CC 0%, #97C9FC 100%)',
      '800-90': 'linear-gradient(63.44deg, #1B73CC 16.72%, #97C9FC 83.39%)',
      '800-700': 'linear-gradient(26.57deg, #1B73CC 8.33%, #97C9FC 91.67%)',
      '900-600': 'linear-gradient(45deg, #165DA6 0%, #97C9FC 100%)',
    }
  }
}
