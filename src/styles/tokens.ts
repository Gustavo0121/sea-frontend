export const colors = {
  petrol: '#0B4F6C',
  petrolDark: '#083A50',
  blueDark: '#1D7CB2',
  blueLight: '#4FA8D8',
  white: '#FFFFFF',
  grayLightest: '#F7F9FA',
  grayLight: '#EDF1F3',
  grayMedium: '#C7D0D4',
  grayText: '#5B6B72',
  black: '#1A2327',
  orange: '#FF7A1A',
  orangeDark: '#E0640A',
  success: '#2E9E5B',
  error: '#D64545',
  warning: '#E0A800',
} as const

export const typography = {
  fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
} as const

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  full: '9999px',
} as const

export const shadow = {
  sm: '0 1px 2px rgba(6, 43, 61, 0.06)',
  md: '0 4px 12px rgba(6, 43, 61, 0.08)',
  lg: '0 12px 32px rgba(6, 43, 61, 0.12)',
} as const

export const transition = {
  fast: '120ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '320ms ease-in-out',
} as const

export const breakpoints = {
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const
