// Design tokens shared between frontend and email templates
// Extracted from apps/desktop/src/styles/globals.css

export const designTokens = {
  colors: {
    // Backgrounds
    background: '#FCFCFC', // hsl(0 0% 99%)
    surface: '#FAFAFA', // hsl(0 0% 98%)
    surfaceHover: '#F5F5F5', // hsl(0 0% 96%)

    // Text
    foreground: '#171717', // hsl(0 0% 9%)
    foregroundSecondary: '#737373', // hsl(0 0% 45%)
    foregroundTertiary: '#9E9E9E', // hsl(0 0% 62%)

    // Primary (Black)
    primary: '#000000', // hsl(0 0% 0%)
    primaryHover: '#262626', // hsl(0 0% 15%)
    primaryForeground: '#FFFFFF', // hsl(0 0% 100%)

    // Secondary
    secondary: '#FFFFFF', // hsl(0 0% 100%)
    secondaryHover: '#FAFAFA', // hsl(0 0% 98%)
    secondaryForeground: '#171717', // hsl(0 0% 9%)

    // Accent (Blue)
    accent: '#2B9EF1', // hsl(211 100% 55%)
    accentHover: '#1A8FDE', // hsl(211 100% 48%)
    accentForeground: '#FFFFFF', // hsl(0 0% 100%)

    // Borders
    border: '#E5E5E5', // hsl(0 0% 90%)
    borderHover: '#CCCCCC', // hsl(0 0% 80%)

    // Input
    input: '#E5E5E5', // hsl(0 0% 90%)
    inputFocus: '#171717', // hsl(0 0% 9%)

    // Status Colors
    success: '#22C55E', // hsl(142 76% 48%)
    successForeground: '#FFFFFF',

    warning: '#F97316', // hsl(35 100% 52%)
    warningForeground: '#FFFFFF',

    destructive: '#EF4444', // hsl(0 91% 60%)
    destructiveForeground: '#FFFFFF',

    info: '#2B9EF1', // hsl(211 100% 55%)
    infoForeground: '#FFFFFF',

    // UI Elements
    ring: '#171717', // hsl(0 0% 9%)
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },

  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '10px',
  },

  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: 'SF Mono, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  shadows: {
    card: '0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.04)',
  },
} as const

export type DesignTokens = typeof designTokens
