import { breakpoints, colors, radius, shadow, spacing, transition, typography } from './tokens'

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  transition,
  breakpoints,
}

export type AppTheme = typeof theme
