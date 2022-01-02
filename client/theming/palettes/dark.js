const DARK_PALETTE = {
  mode: 'dark',
  common: {
    black: 'hsl(0, 0%, 100%)',
    white: 'hsl(0, 0%, 0%)',
  },
  primary: {
    main: 'hsl(209, 78%, 54%)',
    light: 'hsl(206, 89%, 40%)',
    dark: 'hsl(211, 80%, 59%)',
    contrastText: 'hsl(0, 0%, 0%)',
  },
  secondary: {
    main: 'hsl(291, 63%, 58%)',
    light: 'hsl(291, 46%, 41%)',
    dark: 'hsl(282, 67%, 63%)',
    contrastText: 'hsl(0, 0%, 0%)',
  },
  error: {
    main: 'hsl(350, 65%, 50%)',
    light: 'hsl(351, 83%, 38%)',
    dark: 'hsl(350, 66%, 54%)',
    contrastText: 'hsl(0, 0%, 0%)',
  },
  warning: {
    main: 'hsl(320, 46%, 46%)',
    light: 'hsl(335, 70%, 50%)',
    dark: 'hsl(321, 80%, 45%)',
    contrastText: 'hsl(0, 0%, 0%)',
  },
  info: {
    main: 'hsl(201, 98%, 59%)',
    light: 'hsl(198, 97%, 52%)',
    dark: 'hsl(206, 98%, 70%)',
    contrastText: 'hsl(0, 0%, 0%)',
  },
  success: {
    main: 'hsl(123, 46%, 67%)',
    light: 'hsl(122, 39%, 51%)',
    dark: 'hsl(124, 55%, 77%)',
    contrastText: 'hsl(0, 0%, 0%)',
  },
  grey: {
    '50': 'hsl(0, 0%, 2%)',
    '100': 'hsl(0, 0%, 4%)',
    '200': 'hsl(0, 0%, 7%)',
    '300': 'hsl(0, 0%, 13%)',
    '400': 'hsl(0, 0%, 26%)',
    '500': 'hsl(0, 0%, 39%)',
    '600': 'hsl(0, 0%, 55%)',
    '700': 'hsl(0, 0%, 62%)',
    '800': 'hsl(0, 0%, 75%)',
    '900': 'hsl(0, 0%, 88%)',
    A100: 'hsl(0, 0%, 4%)',
    A200: 'hsl(0, 0%, 7%)',
    A400: 'hsl(0, 0%, 26%)',
    A700: 'hsl(0, 0%, 62%)',
  },
  shadow: {
    full: 'hsla(0, 0%, 100%, 0.20)',
    partial: 'hsla(0, 0%, 100%, 0.14)',
    low: 'hsla(0, 0%, 100%, 0.12)',
  },
  contrastThreshold: 4.5,
  tonalOffset: 0.2,
  text: {
    primary: 'hsla(0, 0%, 100%, 0.87)',
    secondary: 'hsla(0, 0%, 100%, 0.60)',
    disabled: 'hsla(0, 0%, 100%, 0.38)',
  },
  divider: 'hsla(0, 0%, 100%, 0.12)',
  background: {
    primary: 'hsl(260, 15%, 20%)',
    paper: 'hsl(200, 55%, 15%)',
    default: 'hsl(0, 0%, 0%)',
    darker: 'hsl(270, 20%, 40%)',
    hover: 'hsl(270, 60%, 9%)',
  },
  cards: {
    white: 'hsl(55, 10%, 20%)',
    blue: 'hsl(220, 70%, 20%)',
    black: 'hsl(275, 100%, 20%)',
    red: 'hsl(330, 95%, 20%)',
    green: 'hsl(160, 60%, 20%)',
    multi: 'hsl(55, 95%, 20%)',
    colorless: 'hsl(340, 5%, 20%)',
    lands: 'hsl(32, 60%, 20%)',
  },
  tags: {
    red: 'hsl(9, 80%, 25%)',
    brown: 'hsl(30, 50%, 25%)',
    yellow: 'hsl(45, 72%, 25%)',
    green: 'hsl(110, 90%, 25%)',
    turquoise: 'hsl(180, 75%, 25%)',
    blue: 'hsl(220, 72%, 23%)',
    purple: 'hsl(265, 92%, 30%)',
    violet: 'hsl(275, 84%, 25%)',
    pink: 'hsl(310, 72%, 25%)',
  },
  action: {
    active: 'hsla(0, 0%, 100%, 0.54)',
    hover: 'hsla(0, 0%, 100%, 0.04)',
    hoverOpacity: 0.04,
    selected: 'hsla(0, 0%, 100%, 0.08)',
    selectedOpacity: 0.08,
    disabled: 'hsla(0, 0%, 100%, 0.26)',
    disabledBackground: 'hsla(0, 0%, 100%, 0.12)',
    disabledOpacity: 0.38,
    focus: 'hsla(0, 0%, 100%, 0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.12,
  },
};
export default DARK_PALETTE;
