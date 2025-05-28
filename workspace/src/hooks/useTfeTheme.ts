import { useMemo } from 'react';

/**
 * Custom hook that provides access to TFE theme colors and styles
 */
export function useTfeTheme() {
  const theme = useMemo(() => {
    return {
      colors: {
        primary: 'var(--tfe-primary)',
        primaryLight: 'var(--tfe-primary-light)',
        primaryDark: 'var(--tfe-primary-dark)',
        secondary: 'var(--tfe-secondary)',
        secondaryLight: 'var(--tfe-secondary-light)',
        secondaryDark: 'var(--tfe-secondary-dark)',
        accent: 'var(--tfe-accent)',
        accentLight: 'var(--tfe-accent-light)',
        accentDark: 'var(--tfe-accent-dark)',
        gray: {
          50: 'var(--tfe-gray-50)',
          100: 'var(--tfe-gray-100)',
          200: 'var(--tfe-gray-200)',
          300: 'var(--tfe-gray-300)',
          400: 'var(--tfe-gray-400)',
          500: 'var(--tfe-gray-500)',
          600: 'var(--tfe-gray-600)',
          700: 'var(--tfe-gray-700)',
          800: 'var(--tfe-gray-800)',
          900: 'var(--tfe-gray-900)',
        }
      },
      gradients: {
        primary: 'var(--tfe-gradient-primary)',
      },
      utils: {
        buttonStyle: {
          background: 'var(--tfe-primary)',
          color: 'white',
          fontWeight: '600', 
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        gradientButtonStyle: {
          background: 'var(--tfe-gradient-primary)',
          color: 'white',
          fontWeight: '600', 
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        iconContainerStyle: (color: 'primary' | 'secondary' | 'accent') => ({
          backgroundColor: `var(--tfe-${color}-light)`,
          color: `var(--tfe-${color})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '9999px',
        }),
        bulletPointStyle: {
          backgroundColor: 'var(--tfe-primary)',
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '9999px',
          marginTop: '0.5rem',
          marginRight: '0.75rem',
          flexShrink: 0,
        }
      }
    };
  }, []);

  return theme;
}
