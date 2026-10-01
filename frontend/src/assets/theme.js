import { createTheme } from '@mui/material/styles'

// ============================================
// NUDE COLOR PALETTE
// ============================================
export const nudeColors = {
  // Primary - Warm Nudes
  primary: '#D4A373',      // Warm Sand
  primaryDark: '#B8896B',  // Deeper Sand
  primaryLight: '#F0D5B8', // Light Sand

  // Secondary - Earthy
  secondary: '#8D6B5B',    // Earthy Brown
  secondaryLight: '#C4A88C',

  // Accents
  accent: '#E8C9A0',       // Cream
  accentDark: '#C9A87C',

  // Background
  background: '#FAF6F0',   // Warm White
  surface: '#FFFFFF',

  // Text
  text: '#4A3728',         // Dark Brown
  textSecondary: '#7A6B5B',

  // Status
  success: '#7BA37B',
  error: '#C97A7A',
  warning: '#D4A373',

  // Gradients
  gradient: 'linear-gradient(135deg, #D4A373 0%, #8D6B5B 100%)',
  gradientLight: 'linear-gradient(135deg, #F0D5B8 0%, #E8C9A0 100%)',
}

// ============================================
// DARK THEME COLOR OVERRIDES
// ============================================
export const darkNudeColors = {
  primary: '#D4A373',
  primaryDark: '#C49A6B',
  primaryLight: '#E8C9A0',
  secondary: '#A88A7A',
  secondaryLight: '#C4A88C',
  accent: '#B8896B',
  accentDark: '#8D6B5B',
  background: '#2C241C',
  surface: '#3D3228',
  text: '#EDE4D8',
  textSecondary: '#B5A89A',
  success: '#7BA37B',
  error: '#C97A7A',
  warning: '#D4A373',
  gradient: 'linear-gradient(135deg, #D4A373 0%, #8D6B5B 100%)',
  gradientLight: 'linear-gradient(135deg, #3D3228 0%, #2C241C 100%)',
}

// ============================================
// CREATE THEME FUNCTION
// ============================================
export const createAppTheme = (mode = 'light') => {
  const colors = mode === 'dark' ? darkNudeColors : nudeColors

  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: colors.primary,
        dark: colors.primaryDark,
        light: colors.primaryLight,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: colors.secondary,
        light: colors.secondaryLight,
        contrastText: '#FFFFFF',
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.text,
        secondary: colors.textSecondary,
      },
      success: { main: colors.success },
      error: { main: colors.error },
      warning: { main: colors.warning },
    },

    shape: {
      borderRadius: 16,
    },

    typography: {
      fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.02em',
        fontSize: '3.5rem',
        lineHeight: 1.1,
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
        fontSize: '2.75rem',
        lineHeight: 1.2,
      },
      h3: {
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.3,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.35rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.1rem',
        lineHeight: 1.4,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.9375rem',
        letterSpacing: '0.01em',
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '50px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 28px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(212, 163, 115, 0.3)',
            },
          },
          contained: {
            background: mode === 'dark'
              ? `linear-gradient(135deg, ${colors.primaryDark}, ${colors.secondary})`
              : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            color: '#FFFFFF',
            '&:hover': {
              background: mode === 'dark'
                ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondaryLight})`
                : `linear-gradient(135deg, ${colors.primaryDark}, ${colors.secondary})`,
            },
          },
          outlined: {
            borderColor: colors.primary,
            color: colors.primary,
            '&:hover': {
              borderColor: colors.primaryDark,
              backgroundColor: `rgba(212, 163, 115, 0.08)`,
            },
          },
          sizeLarge: {
            padding: '14px 36px',
            fontSize: '1rem',
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '24px',
            background: mode === 'dark' ? '#3D3228' : '#FFFFFF',
            boxShadow: mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(212, 163, 115, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: mode === 'dark'
                ? '0 12px 48px rgba(0,0,0,0.4)'
                : '0 12px 48px rgba(212, 163, 115, 0.25)',
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '24px',
            background: mode === 'dark' ? '#3D3228' : '#FFFFFF',
            transition: 'all 0.3s ease',
          },
          elevation1: {
            boxShadow: mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(212, 163, 115, 0.15)',
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              '& fieldset': {
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(212, 163, 115, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: colors.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary,
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: colors.primary,
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            fontWeight: 500,
            '&.MuiChip-filled': {
              background: mode === 'dark' ? '#5A4A3A' : colors.primaryLight,
              color: mode === 'dark' ? '#EDE4D8' : colors.text,
            },
            '&.MuiChip-outlined': {
              borderColor: colors.primary,
              color: colors.primary,
            },
          },
          colorPrimary: {
            background: colors.primary,
            color: '#FFFFFF',
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 52,
            height: 28,
            padding: 0,
            '& .MuiSwitch-switchBase': {
              padding: 0,
              margin: 2,
              transitionDuration: '300ms',
              '&.Mui-checked': {
                transform: 'translateX(24px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                  backgroundColor: colors.primary,
                  opacity: 1,
                  border: 0,
                },
                '&:hover': {
                  backgroundColor: 'rgba(212, 163, 115, 0.08)',
                },
              },
            },
            '& .MuiSwitch-track': {
              borderRadius: 14,
              backgroundColor: mode === 'dark' ? '#5A4A3A' : '#D1C8BC',
              opacity: 1,
              transition: 'background-color 0.3s ease',
            },
          },
        },
      },

      MuiSlider: {
        styleOverrides: {
          root: {
            color: colors.primary,
          },
          thumb: {
            '&:hover': {
              boxShadow: '0 0 0 8px rgba(212, 163, 115, 0.16)',
            },
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '24px',
            padding: '8px',
            background: mode === 'dark' ? '#3D3228' : '#FFFFFF',
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'dark'
              ? 'rgba(44, 36, 28, 0.85)'
              : 'rgba(250, 246, 240, 0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(212, 163, 115, 0.2)'}`,
          },
        },
      },

      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.primary,
            color: '#FFFFFF',
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
          },
          standardSuccess: {
            backgroundColor: mode === 'dark' ? 'rgba(123, 163, 123, 0.2)' : '#E8F5E9',
            color: colors.success,
          },
          standardError: {
            backgroundColor: mode === 'dark' ? 'rgba(201, 122, 122, 0.2)' : '#FFEBEE',
            color: colors.error,
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: `rgba(212, 163, 115, 0.08)`,
            },
            '&.Mui-selected': {
              backgroundColor: `rgba(212, 163, 115, 0.12)`,
            },
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            '&.Mui-selected': {
              color: colors.primary,
            },
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: colors.primary,
          },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(212, 163, 115, 0.2)',
          },
          bar: {
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            borderRadius: 6,
          },
        },
      },
    },
  })
}

export default createAppTheme