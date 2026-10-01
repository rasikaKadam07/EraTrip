import {
    AccessTime,
    Add,
    CalendarToday,
    Close,
    Collections,
    CopyAll,
    DarkMode,
    Delete, Edit,
    Email,
    EventNote,
    ExpandMore,
    Google,
    Help, Info,
    Language,
    LightMode,
    LocationOn,
    Lock,
    Logout,
    MoreVert,
    NavigateNext,
    Notifications,
    People,
    Person,
    Send,
    Settings as SettingsIcon,
    Share,
    Wallet
} from '@mui/icons-material'
import {
    Alert,
    AppBar,
    Avatar,
    Box,
    Button,
    Card, CardContent,
    Chip,
    Collapse,
    Container,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider,
    Fade,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    LinearProgress,
    List, ListItem, ListItemIcon, ListItemText,
    Menu, MenuItem,
    Paper,
    Select,
    Slide,
    Snackbar,
    Stack,
    Switch,
    TextField,
    Toolbar, Typography
} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { nudeColors } from './assets/theme'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const readSession = () => {
  try {
    const value = localStorage.getItem('eratrip_session')
    return value ? JSON.parse(value) : null
  } catch {
    localStorage.removeItem('eratrip_session')
    localStorage.removeItem('user')
    return null
  }
}

const apiRequest = async (path, options = {}) => {
  const session = readSession() || {}
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((item) => item.msg).filter(Boolean).join(', ')
      : data.detail
    throw new Error(detail || 'Request failed')
  }
  return data
}

// ============================================
// THEME CONTEXT
// ============================================
const ThemeContext = createContext()

const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setMode(saved)
  }, [])

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('theme', newMode)
  }

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: nudeColors.primary,
        dark: nudeColors.primaryDark,
        light: nudeColors.primaryLight,
      },
      secondary: {
        main: nudeColors.secondary,
        light: nudeColors.secondaryLight,
      },
      background: {
        default: mode === 'dark' ? '#2C241C' : nudeColors.background,
        paper: mode === 'dark' ? '#3D3228' : nudeColors.surface,
      },
      text: {
        primary: mode === 'dark' ? '#EDE4D8' : nudeColors.text,
        secondary: mode === 'dark' ? '#B5A89A' : nudeColors.textSecondary,
      },
      success: { main: nudeColors.success },
      error: { main: nudeColors.error },
      warning: { main: nudeColors.warning },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: '"Poppins", sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 500 }
    },
    components: {
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
            }
          },
          contained: {
            background: mode === 'dark'
              ? `linear-gradient(135deg, ${nudeColors.primaryDark}, ${nudeColors.secondary})`
              : nudeColors.gradient,
            color: '#fff',
            '&:hover': {
              background: mode === 'dark'
                ? `linear-gradient(135deg, ${nudeColors.primary}, ${nudeColors.secondaryLight})`
                : `linear-gradient(135deg, ${nudeColors.primaryDark}, ${nudeColors.secondary})`,
            }
          }
        }
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
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '24px',
            background: mode === 'dark' ? '#3D3228' : '#FFFFFF',
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            '&.MuiChip-filled': {
              background: mode === 'dark' ? '#5A4A3A' : nudeColors.primaryLight,
              color: mode === 'dark' ? '#EDE4D8' : nudeColors.text,
            }
          }
        }
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: nudeColors.primary,
              '&:hover': {
                backgroundColor: 'rgba(212, 163, 115, 0.08)',
              },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: nudeColors.primary,
            },
          }
        }
      }
    }
  })

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

const useTheme = () => useContext(ThemeContext)

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = readSession()
    if (!session?.access_token) {
      setLoading(false)
      return
    }
    apiRequest('/auth/me')
      .then((userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
      })
      .catch(() => {
        localStorage.removeItem('eratrip_session')
        localStorage.removeItem('user')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const userData = data.user
    setUser(userData)
    localStorage.setItem('eratrip_session', JSON.stringify({ access_token: data.access_token, user: userData }))
    localStorage.setItem('user', JSON.stringify(userData))
    return userData
  }

  const signup = async (full_name, email, password) => {
    await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ full_name, email, password }),
    })
    return login(email, password)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('eratrip_session')
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    const session = readSession() || {}
    localStorage.setItem('eratrip_session', JSON.stringify({ ...session, user: userData }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

// ============================================
// ANIMATIONS
// ============================================
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const buttonTap = {
  tap: { scale: 0.95 }
}

// ============================================
// INTERESTS
// ============================================
const INTERESTS = [
  { id: 'vegetarian', label: '🌿 Vegetarian', icon: '🌿' },
  { id: 'temples', label: '🏯 Temples', icon: '🏯' },
  { id: 'art', label: '🎨 Art', icon: '🎨' },
  { id: 'nature', label: '🌳 Nature', icon: '🌳' },
  { id: 'family', label: '👨‍👩‍👧‍👦 Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'friends', label: '👥 Friends', icon: '👥' },
  { id: 'nightlife', label: '🌙 Nightlife', icon: '🌙' },
  { id: 'shopping', label: '🛍️ Shopping', icon: '🛍️' },
]

const getTodayISO = () => new Date().toISOString().split('T')[0]

const readSavedEras = () => {
  try {
    return JSON.parse(localStorage.getItem('eraTrips') || '[]')
  } catch {
    return []
  }
}

// ============================================
// COMPONENTS
// ============================================

// Navbar
const Navbar = () => {
  const { user, logout } = useAuth()
  const { mode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  if (!user) return null

  return (
    <Slide appear={false} direction="down" in={true}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{
        backdropFilter: 'blur(20px)',
        py: 1,
        background: mode === 'dark'
          ? 'rgba(44, 36, 28, 0.85)'
          : 'rgba(250, 246, 240, 0.85)',
        borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(212, 163, 115, 0.2)'}`
      }}>
        <Toolbar>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 800,
                background: mode === 'dark'
                  ? `linear-gradient(135deg, ${nudeColors.primaryLight}, ${nudeColors.secondaryLight})`
                  : nudeColors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                letterSpacing: '-0.5px'
              }}
              onClick={() => navigate('/vibe-check')}
            >
              EraTrip
            </Typography>
          </motion.div>

          <Stack direction="row" spacing={1} alignItems="center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button color="inherit" onClick={() => navigate('/vibe-check')}>Plan</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button color="inherit" onClick={() => navigate('/my-eras')}>My Eras</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton onClick={() => navigate('/settings')}>
                <SettingsIcon />
              </IconButton>
            </motion.div>
            <Switch
              checked={mode === 'dark'}
              onChange={toggleTheme}
              icon={<LightMode sx={{ color: nudeColors.text }} />}
              checkedIcon={<DarkMode sx={{ color: nudeColors.primary }} />}
            />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Avatar
                sx={{
                  bgcolor: nudeColors.primary,
                  cursor: 'pointer',
                  border: `2px solid ${nudeColors.primaryLight}`,
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {user?.full_name?.[0] || 'U'}
              </Avatar>
            </motion.div>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings') }}>
              <ListItemIcon><Person fontSize="small" /></ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); logout(); navigate('/login') }}>
              <ListItemIcon><Logout fontSize="small" sx={{ color: nudeColors.error }} /></ListItemIcon>
              <Typography sx={{ color: nudeColors.error }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Slide>
  )
}

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return children
}

// ============================================
// PAGES
// ============================================

// Splash Screen
const SplashScreen = () => {
  const navigate = useNavigate()
  const { mode } = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login')
    }, 3000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: mode === 'dark'
        ? 'linear-gradient(135deg, #2C241C, #3D3228)'
        : 'linear-gradient(135deg, #FAF6F0, #F0E8DC)',
    }}>
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            type: 'spring',
            bounce: 0.5
          }}
        >
          <Typography variant="h1" sx={{
            fontSize: '5rem',
            background: mode === 'dark'
              ? `linear-gradient(135deg, ${nudeColors.primaryLight}, ${nudeColors.secondaryLight})`
              : nudeColors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900,
            letterSpacing: '-2px'
          }}>
            EraTrip
          </Typography>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Typography variant="h6" color="textSecondary" sx={{ mt: 1 }}>
          Get Your Era Mapped ✨
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 4, borderRadius: '50px', px: 6, py: 1.5 }}
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
      </motion.div>
    </Box>
  )
}

// Login
const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { mode } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email.trim())) newErrors.email = 'Email is invalid'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/vibe-check')
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" fontWeight={700} gutterBottom align="center">
                Welcome Back 👋
              </Typography>
              <Typography color="textSecondary" align="center" sx={{ mb: 4 }}>
                Sign in to continue your journey
              </Typography>

              {errors.general && (
                <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleLogin}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Google />}
                  sx={{ mb: 2 }}
                >
                  Continue with Google
                </Button>
              </motion.div>

              <Typography textAlign="center">
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: nudeColors.primary, textDecoration: 'none', fontWeight: 600 }}>
                  Sign Up
                </Link>
              </Typography>
            </motion.div>
          </Paper>
        </Container>
      </motion.div>
    </AnimatePresence>
  )
}

// SignUp
const SignUp = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await signup(name.trim(), email.trim(), password)
      navigate('/vibe-check')
    } catch (error) {
      setErrors({ general: error.message || 'Signup failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" fontWeight={700} gutterBottom align="center">
                Create Account 🚀
              </Typography>
              <Typography color="textSecondary" align="center" sx={{ mb: 4 }}>
                Start planning your dream trips
              </Typography>

              {errors.general && (
                <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>
              )}

              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={{ mb: 3 }}
                onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSignup}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Google />}
                  sx={{ mb: 2 }}
                >
                  Sign up with Google
                </Button>
              </motion.div>

              <Typography textAlign="center">
                Already have an account?{' '}
                <Link to="/login" style={{ color: nudeColors.primary, textDecoration: 'none', fontWeight: 600 }}>
                  Sign In
                </Link>
              </Typography>
            </motion.div>
          </Paper>
        </Container>
      </motion.div>
    </AnimatePresence>
  )
}

// Vibe Check
const VibeCheck = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { mode } = useTheme()
  const editData = location.state?.editTrip || null

  // Form state
  const [destination, setDestination] = useState(editData?.destination || '')
  const [startDate, setStartDate] = useState(editData?.startDate || '')
  const [travelers, setTravelers] = useState(editData?.travelers || 1)
  const [tripDays, setTripDays] = useState(editData?.tripDays || 3)
  const [budget, setBudget] = useState(editData?.budget || 100)
  const [interests, setInterests] = useState(editData?.interests || [])
  const [additionalPrompt, setAdditionalPrompt] = useState(editData?.additionalPrompt || '')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Validation
  const validate = () => {
    const newErrors = {}

    if (!destination.trim()) newErrors.destination = 'Destination is required'

    if (!startDate) {
      newErrors.startDate = 'Start date is required'
    } else {
      const selected = new Date(startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selected < today) {
        newErrors.startDate = 'Start date cannot be in the past'
      }
    }

    if (!travelers || travelers < 1) newErrors.travelers = 'Must have at least 1 traveler'
    if (!Number.isInteger(travelers)) newErrors.travelers = 'Must be a whole number'

    if (!tripDays || tripDays < 1) newErrors.tripDays = 'Must have at least 1 day'
    if (!Number.isInteger(tripDays)) newErrors.tripDays = 'Must be a whole number'

    if (!budget || budget < 50) newErrors.budget = 'Budget must be at least ₹50'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle interests toggle
  const toggleInterest = (interestId) => {
    setInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleStartDateChange = (value) => {
    setStartDate(value)
    setErrors((current) => ({
      ...current,
      startDate: value && value < getTodayISO() ? 'Start date cannot be in the past' : undefined,
    }))
  }

  // Handle submit
  const handleSubmit = async () => {
    if (!validate()) {
      setSnackbar({ open: true, message: 'Please fix the errors above', severity: 'error' })
      return
    }

    setLoading(true)

    try {
      const request = {
        destination: destination.trim(),
        start_date: `${startDate}T00:00:00Z`,
        travelers: Number(travelers),
        trip_days: Number(tripDays),
        budget: Number(budget),
        interests,
        additional_prompt: additionalPrompt,
        user_id: user.id,
      }
      const result = editData
        ? await apiRequest(`/trips/${editData.id}`, { method: 'PUT', body: JSON.stringify(request) })
        : await apiRequest('/trips/', { method: 'POST', body: JSON.stringify(request) })
      const tripData = { ...request, id: editData?.id || result.trip_id, startDate, tripDays }
      localStorage.setItem('activeTrip', JSON.stringify(tripData))

      setSnackbar({
        open: true,
        message: editData ? 'Era updated successfully! ✨' : 'Era created successfully! ✨',
        severity: 'success'
      })

      setTimeout(() => {
        navigate('/ai-loading', { state: { ...tripData, isEdit: !!editData } })
      }, 500)
    } catch (error) {
      setSnackbar({ open: true, message: 'Something went wrong. Please try again.', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
          >
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" fontWeight={700}>
                  {editData ? '✏️ Edit Your Era' : '🌟 Vibe Check'}
                </Typography>
                {editData && (
                  <Chip
                    label="Editing Mode"
                    color="primary"
                    size="medium"
                    icon={<Edit />}
                  />
                )}
              </Box>

              <Typography color="textSecondary" sx={{ mb: 4 }}>
                {editData
                  ? 'Update your trip details below'
                  : 'Tell us about your dream trip, and we\'ll craft the perfect itinerary!'
                }
              </Typography>

              {/* Destination */}
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  label="Where do you want to go?"
                  placeholder="e.g., Paris, France"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  error={!!errors.destination}
                  helperText={errors.destination}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: nudeColors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <Grid container spacing={3}>
                {/* Start Date */}
                <Grid item xs={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Trip Start Date"
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      inputProps={{ min: getTodayISO() }}
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ color: nudeColors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>
                </Grid>

                {/* Travelers */}
                <Grid item xs={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Number of Travelers"
                      value={travelers}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        setTravelers(isNaN(val) ? '' : val)
                      }}
                      error={!!errors.travelers}
                      helperText={errors.travelers}
                      inputProps={{ min: 1, step: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <People sx={{ color: nudeColors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>
                </Grid>

                {/* Trip Days */}
                <Grid item xs={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Number of Trip Days"
                      value={tripDays}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        setTripDays(isNaN(val) ? '' : val)
                      }}
                      error={!!errors.tripDays}
                      helperText={errors.tripDays}
                      inputProps={{ min: 1, step: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventNote sx={{ color: nudeColors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>
                </Grid>

                {/* Budget */}
                <Grid item xs={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Budget (₹ INR)"
                      value={budget}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        setBudget(isNaN(val) ? '' : val)
                      }}
                      error={!!errors.budget}
                      helperText={errors.budget || 'Minimum ₹50'}
                      inputProps={{ min: 50, step: 10 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Wallet sx={{ color: nudeColors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>
                </Grid>
              </Grid>

              {/* Interests */}
              <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Select Your Interests
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                  Choose all that apply to personalize your experience
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {INTERESTS.map((interest) => (
                    <motion.div
                      key={interest.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        label={interest.label}
                        onClick={() => toggleInterest(interest.id)}
                        color={interests.includes(interest.id) ? 'primary' : 'default'}
                        variant={interests.includes(interest.id) ? 'filled' : 'outlined'}
                        sx={{
                          m: 0.5,
                          '&:hover': {
                            backgroundColor: interests.includes(interest.id)
                              ? nudeColors.primaryDark
                              : 'rgba(212, 163, 115, 0.1)',
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </Box>

              {/* Additional Prompt */}
              <motion.div variants={itemVariants}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Additional Instructions for AI"
                  placeholder="e.g., I want to focus on local food experiences, prefer walking tours, avoid crowded tourist spots..."
                  value={additionalPrompt}
                  onChange={(e) => setAdditionalPrompt(e.target.value)}
                  sx={{ mb: 3 }}
                  helperText="Be specific to help the AI create the perfect itinerary for you"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Send sx={{ color: nudeColors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Buttons */}
              <Stack direction="row" spacing={2}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1 }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      background: mode === 'dark'
                        ? `linear-gradient(135deg, ${nudeColors.primaryDark}, ${nudeColors.secondary})`
                        : nudeColors.gradient,
                      '&:hover': {
                        background: mode === 'dark'
                          ? `linear-gradient(135deg, ${nudeColors.primary}, ${nudeColors.secondaryLight})`
                          : `linear-gradient(135deg, ${nudeColors.primaryDark}, ${nudeColors.secondary})`,
                      }
                    }}
                  >
                    {loading ? 'Planning...' : editData ? 'Update Era ✨' : 'Plan My Era ✨'}
                  </Button>
                </motion.div>

                {editData && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/my-eras')}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                )}
              </Stack>
            </Paper>
          </motion.div>
        </Container>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </AnimatePresence>
  )
}

// AI Loading
const AILoading = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const data = location.state || {}
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Analyzing your preferences...')
  const [phase, setPhase] = useState(0)

  const statusMessages = [
    '🌱 Understanding your travel style...',
    '🔍 Discovering hidden gems...',
    '🗺️ Crafting your perfect route...',
    '✨ Personalizing your experience...',
    '🎯 Almost ready...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const newProgress = p + 2
        const newPhase = Math.min(Math.floor(newProgress / 20), statusMessages.length - 1)
        setPhase(newPhase)
        setStatus(statusMessages[newPhase])

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            navigate('/timeline', { state: data })
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 150)
    return () => clearInterval(interval)
  }, [navigate, data])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              🧠 AI is Thinking
            </Typography>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                {status}
              </Typography>
            </motion.div>

            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(135deg, ${nudeColors.primary}, ${nudeColors.secondary})`,
                  }
                }}
              />
            </Box>

            <Typography variant="caption" color="textSecondary">
              {progress}% complete
            </Typography>

            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              style={{ marginTop: '30px', display: 'inline-block' }}
            >
              <Typography variant="h2">✨</Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
                {data.isEdit ? 'Updating your era...' : 'Creating your unique experience...'}
              </Typography>
            </motion.div>
          </Paper>
        </Container>
      </motion.div>
    </AnimatePresence>
  )
}

// Timeline
const Timeline = () => {
  const location = useLocation()
  const data = location.state || JSON.parse(localStorage.getItem('activeTrip') || '{}')
  const { mode } = useTheme()
  const [expandedDay, setExpandedDay] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!data.id) {
      setError('No saved trip was selected.')
      return
    }
    apiRequest(`/trips/${data.id}/itinerary`)
      .then(setItinerary)
      .catch((requestError) => setError(requestError.message))
  }, [data.id])

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  if (error) return <Container maxWidth="md" sx={{ py: 8 }}><Alert severity="error">{error}</Alert></Container>
  if (!itinerary) return <Container maxWidth="md" sx={{ py: 8 }}><Paper sx={{ p: 5, textAlign: 'center' }}><Typography>Loading your real-world itinerary...</Typography><LinearProgress sx={{ mt: 3 }} /></Paper></Container>

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    Your Era - {itinerary.destination}
                  </Typography>
                  <Typography color="textSecondary">
                    {data.startDate || new Date().toISOString().split('T')[0]} · {data.travelers || 1} Travelers · {data.tripDays || 3} Days
                  </Typography>
                  <Box mt={1}>
                    {data.interests?.map(interest => {
                      const interestObj = INTERESTS.find(i => i.id === interest)
                      return interestObj ? (
                        <Chip
                          key={interest}
                          label={interestObj.label}
                          size="small"
                          sx={{ mr: 0.5 }}
                          variant="outlined"
                        />
                      ) : null
                    })}
                  </Box>
                </Box>
                <Stack direction="row" spacing={1}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <IconButton>
                      <Share />
                    </IconButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <IconButton>
                      <CopyAll />
                    </IconButton>
                  </motion.div>
                </Stack>
              </Box>
            </Paper>

            {/* Hotels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                🏨 Recommended Hotels
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {itinerary.hotels.map((hotel, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{hotel.name}</Typography>
                          <Typography color="textSecondary">{hotel.area}</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {hotel.description}
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Check current rates and availability on Google Maps.
                          </Typography>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              size="small"
                              startIcon={<LocationOn />}
                              href={hotel.maps_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ mt: 1 }}
                            >
                              Check hotel
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

            {/* Daily Itinerary */}
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              📅 Daily Itinerary
            </Typography>

            {itinerary.days.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    mb: 2,
                    overflow: 'hidden',
                    border: expandedDay === index ? `2px solid ${nudeColors.primary}` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: expandedDay === index ? `rgba(212, 163, 115, 0.05)` : 'transparent',
                      '&:hover': {
                        bgcolor: `rgba(212, 163, 115, 0.05)`,
                      }
                    }}
                    onClick={() => toggleDay(index)}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: nudeColors.primary, width: 40, height: 40 }}>
                        {day.day}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          Day {day.day}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {day.date}
                        </Typography>
                      </Box>
                    </Box>
                    <motion.div
                      animate={{ rotate: expandedDay === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconButton>
                        <ExpandMore />
                      </IconButton>
                    </motion.div>
                  </Box>

                  <Collapse in={expandedDay === index}>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                      {day.activities.map((activity, actIndex) => (
                        <motion.div
                          key={actIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: actIndex * 0.05 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              mb: 2,
                              p: 2,
                              borderRadius: '12px',
                              bgcolor: mode === 'dark'
                                ? 'rgba(255,255,255,0.03)'
                                : 'rgba(212, 163, 115, 0.03)',
                              border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(212, 163, 115, 0.1)'}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: mode === 'dark'
                                  ? 'rgba(255,255,255,0.05)'
                                  : 'rgba(212, 163, 115, 0.06)',
                              }
                            }}
                          >
                            <Box sx={{ mr: 2, minWidth: '100px' }}>
                              <Chip
                                icon={<AccessTime />}
                                label={activity.time}
                                size="small"
                                sx={{
                                  bgcolor: nudeColors.primary,
                                  color: '#fff',
                                  '& .MuiChip-icon': { color: '#fff' }
                                }}
                              />
                            </Box>
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {activity.activity}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {activity.description}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={2} mt={1}>
                                <Chip
                                  label={`₹${activity.cost}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderColor: nudeColors.primary }}
                                />
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    size="small"
                                    startIcon={<LocationOn />}
                                    href={activity.maps_link}
                                    target="_blank"
                                    sx={{ color: nudeColors.primary }}
                                  >
                                    Location
                                  </Button>
                                </motion.div>
                              </Box>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Collapse>
                </Paper>
              </motion.div>
            ))}

            {/* Total Cost */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Paper elevation={2} sx={{ p: 3, mt: 3, bgcolor: `rgba(212, 163, 115, 0.05)` }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={600}>
                    💰 Total Estimated Cost
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: nudeColors.primary }}>
                    ₹{itinerary.total_cost}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </motion.div>
        </Container>
      </motion.div>
    </AnimatePresence>
  )
}

// My Eras
const MyEras = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { mode } = useTheme()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    apiRequest('/trips/')
      .then((data) => {
        const normalized = (data.items || []).map((trip) => {
          let preferences = {}
          try { preferences = JSON.parse(trip.preferences || '{}') } catch { preferences = {} }
          return {
            ...trip,
            startDate: String(trip.start_date).slice(0, 10),
            tripDays: preferences.trip_days || 1,
            interests: preferences.interests || [],
            additionalPrompt: preferences.additional_prompt || '',
          }
        })
        setTrips(normalized)
      })
      .catch((error) => setSnackbar({ open: true, message: error.message, severity: 'error' }))
      .finally(() => setLoading(false))
  }, [user?.id])

  const handleMenuOpen = (event, trip) => {
    setAnchorEl(event.currentTarget)
    setSelectedTrip(trip)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    await apiRequest(`/trips/${selectedTrip.id}`, { method: 'DELETE' })
    setTrips((current) => current.filter(t => t.id !== selectedTrip.id))
    setDeleteDialogOpen(false)
    setSelectedTrip(null)
    setSnackbar({ open: true, message: 'Era deleted successfully', severity: 'success' })
  }

  const handleEdit = () => {
    navigate('/vibe-check', { state: { editTrip: selectedTrip } })
    handleMenuClose()
  }

  const handleView = () => {
    setViewDialogOpen(true)
    handleMenuClose()
  }

  const handleShare = () => {
    const text = `🌍 My Era Trip!\n\nDestination: ${selectedTrip.destination}\nDate: ${selectedTrip.startDate}\nTravelers: ${selectedTrip.travelers}\nBudget: ₹${selectedTrip.budget}\n\nInterests: ${selectedTrip.interests?.join(', ')}\n\n${selectedTrip.additionalPrompt || ''}`

    if (navigator.share) {
      navigator.share({
        title: `My Era Trip - ${selectedTrip.destination}`,
        text: text,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      setSnackbar({ open: true, message: 'Trip details copied to clipboard!', severity: 'success' })
    }
    handleMenuClose()
  }

  const handleCopy = () => {
    const text = `🌍 My Era Trip!\n\nDestination: ${selectedTrip.destination}\nDate: ${selectedTrip.startDate}\nTravelers: ${selectedTrip.travelers}\nBudget: ₹${selectedTrip.budget}\n\nInterests: ${selectedTrip.interests?.join(', ')}\n\n${selectedTrip.additionalPrompt || ''}`

    navigator.clipboard.writeText(text)
    setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' })
    handleMenuClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" fontWeight={700}>
                🌍 My Eras
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/vibe-check')}
                >
                  New Era
                </Button>
              </motion.div>
            </Box>

            {loading ? (
              <Paper sx={{ p: 6, textAlign: 'center' }}><Typography>Loading your eras...</Typography></Paper>
            ) : trips.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    ✨ No Eras Yet
                  </Typography>
                  <Typography color="textSecondary" sx={{ mb: 3 }}>
                    Start your first journey by planning a new era
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/vibe-check')}
                  >
                    Plan Your First Era
                  </Button>
                </Paper>
              </motion.div>
            ) : (
              <Grid container spacing={3}>
                {trips.map((trip, index) => (
                  <Grid item xs={12} md={6} key={trip.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {trip.destination}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="body2" color="textSecondary">
                                  {trip.startDate}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={1}>
                                <People sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="body2" color="textSecondary">
                                  {trip.travelers} travelers
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Wallet sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="body2" color="textSecondary">
                                  ₹{trip.budget}
                                </Typography>
                              </Box>
                              <Box mt={1}>
                                {trip.interests?.slice(0, 4).map(interest => {
                                  const interestObj = INTERESTS.find(i => i.id === interest)
                                  return interestObj ? (
                                    <Chip
                                      key={interest}
                                      label={interestObj.label}
                                      size="small"
                                      sx={{ mr: 0.5, mb: 0.5 }}
                                      variant="outlined"
                                    />
                                  ) : null
                                })}
                                {trip.interests?.length > 4 && (
                                  <Chip
                                    label={`+${trip.interests.length - 4} more`}
                                    size="small"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </Box>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <IconButton onClick={(e) => handleMenuOpen(e, trip)}>
                                <MoreVert />
                              </IconButton>
                            </motion.div>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={handleView}>
                <ListItemIcon><Collections fontSize="small" /></ListItemIcon>
                <ListItemText>View Era</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleEdit}>
                <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                <ListItemText>Edit Era</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleShare}>
                <ListItemIcon><Share fontSize="small" /></ListItemIcon>
                <ListItemText>Share as Text</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleCopy}>
                <ListItemIcon><CopyAll fontSize="small" /></ListItemIcon>
                <ListItemText>Copy as Text</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: nudeColors.error }}>
                <ListItemIcon><Delete fontSize="small" sx={{ color: nudeColors.error }} /></ListItemIcon>
                <ListItemText>Delete Era</ListItemText>
              </MenuItem>
            </Menu>

            {/* View Dialog */}
            <Dialog
              open={viewDialogOpen}
              onClose={() => setViewDialogOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Era Details</Typography>
                  <IconButton onClick={() => setViewDialogOpen(false)}>
                    <Close />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                {selectedTrip && (
                  <Box>
                    <Typography variant="h5" fontWeight={600}>{selectedTrip.destination}</Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Start Date</Typography>
                        <Typography>{selectedTrip.startDate}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Travelers</Typography>
                        <Typography>{selectedTrip.travelers}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Budget</Typography>
                        <Typography>₹{selectedTrip.budget}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Trip Days</Typography>
                        <Typography>{selectedTrip.tripDays} days</Typography>
                      </Grid>
                    </Grid>
                    {selectedTrip.interests?.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="textSecondary">Interests</Typography>
                        <Box mt={1}>
                          {selectedTrip.interests.map(interest => {
                            const interestObj = INTERESTS.find(i => i.id === interest)
                            return interestObj ? (
                              <Chip key={interest} label={interestObj.label} sx={{ mr: 0.5, mb: 0.5 }} />
                            ) : null
                          })}
                        </Box>
                      </Box>
                    )}
                    {selectedTrip.additionalPrompt && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="textSecondary">Additional Instructions</Typography>
                        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                          <Typography variant="body2">{selectedTrip.additionalPrompt}</Typography>
                        </Paper>
                      </Box>
                    )}
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setViewDialogOpen(false)
                    handleEdit()
                  }}
                >
                  <Edit sx={{ mr: 1 }} /> Edit
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
              <DialogTitle>Delete Era</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this trip? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  sx={{ bgcolor: nudeColors.error, '&:hover': { bgcolor: '#B86969' } }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={3000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          </motion.div>
        </Container>
      </motion.div>
    </AnimatePresence>
  )
}

// Settings
const Settings = () => {
  const { user, logout, updateUser } = useAuth()
  const { mode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('en')
  const [notifications, setNotifications] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [name, setName] = useState(user?.full_name || '')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    setName(user?.full_name || '')
  }, [user?.full_name])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await apiRequest('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ full_name: name }),
      })
      updateUser(updatedUser)
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' })
      setProfileDialogOpen(false)
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' })
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              ⚙️ Settings
            </Typography>

            <Paper elevation={2} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
              <List>
                <motion.div whileHover={{ backgroundColor: 'rgba(212, 163, 115, 0.05)' }}>
                  <ListItem button onClick={() => setProfileDialogOpen(true)}>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText
                      primary="Edit Profile"
                      secondary={`${user?.full_name || 'User'} · ${user?.email}`}
                    />
                    <NavigateNext />
                  </ListItem>
                </motion.div>

                <Divider />

                <ListItem>
                  <ListItemIcon><DarkMode /></ListItemIcon>
                  <ListItemText primary="Dark Mode" />
                  <Switch checked={mode === 'dark'} onChange={toggleTheme} />
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemIcon><Language /></ListItemIcon>
                  <ListItemText primary="Language" />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <MenuItem value="en">🇬🇧 English</MenuItem>
                      <MenuItem value="hi">🇮🇳 Hindi</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemIcon><Notifications /></ListItemIcon>
                  <ListItemText primary="Notifications" />
                  <Switch
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                </ListItem>

                <Divider />

                <motion.div whileHover={{ backgroundColor: 'rgba(212, 163, 115, 0.05)' }}>
                  <ListItem button>
                    <ListItemIcon><Help /></ListItemIcon>
                    <ListItemText primary="Help & Feedback" />
                    <NavigateNext />
                  </ListItem>
                </motion.div>

                <Divider />

                <motion.div whileHover={{ backgroundColor: 'rgba(212, 163, 115, 0.05)' }}>
                  <ListItem button>
                    <ListItemIcon><Info /></ListItemIcon>
                    <ListItemText primary="About EraTrip" secondary="Version 1.0.0" />
                    <NavigateNext />
                  </ListItem>
                </motion.div>

                <Divider />

                <motion.div whileHover={{ backgroundColor: 'rgba(212, 163, 115, 0.05)' }}>
                  <ListItem button onClick={handleLogout}>
                    <ListItemIcon><Logout sx={{ color: nudeColors.error }} /></ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: nudeColors.error }} />
                  </ListItem>
                </motion.div>

                <Divider />

                <motion.div whileHover={{ backgroundColor: 'rgba(212, 163, 115, 0.05)' }}>
                  <ListItem button onClick={() => setDeleteDialogOpen(true)}>
                    <ListItemIcon><Delete sx={{ color: nudeColors.error }} /></ListItemIcon>
                    <ListItemText primary="Delete Account" sx={{ color: nudeColors.error }} />
                  </ListItem>
                </motion.div>
              </List>
            </Paper>

            {/* Profile Dialog */}
            <Dialog
              open={profileDialogOpen}
              onClose={() => setProfileDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Edit Profile</Typography>
                  <IconButton onClick={() => setProfileDialogOpen(false)}>
                    <Close />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ''}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    placeholder="Add your phone number"
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setProfileDialogOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleUpdateProfile}>Save</Button>
              </DialogActions>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete your account? This action is permanent and cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: nudeColors.error, '&:hover': { bgcolor: '#B86969' } }}
                  onClick={() => {
                    setDeleteDialogOpen(false)
                    setSnackbar({ open: true, message: 'Account deleted successfully', severity: 'success' })
                  }}
                >
                  Delete Account
                </Button>
              </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={3000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          </motion.div>
        </Container>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================
// MAIN APP
// ============================================
function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <BrowserRouter>
          {loading ? <SplashScreen /> : (
            <>
              <Navbar />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/vibe-check" element={<ProtectedRoute><VibeCheck /></ProtectedRoute>} />
                  <Route path="/ai-loading" element={<ProtectedRoute><AILoading /></ProtectedRoute>} />
                  <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
                  <Route path="/my-eras" element={<ProtectedRoute><MyEras /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                </Routes>
              </AnimatePresence>
            </>
          )}
        </BrowserRouter>
      </AuthProvider>
    </ThemeProviderWrapper>
  )
}

export default App