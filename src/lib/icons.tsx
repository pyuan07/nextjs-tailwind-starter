import {
  // Basic UI icons
  User,
  Settings,
  Lock,
  Save,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Bell,
  Home,
  LogIn,
  UserPlus,
  Palette,
  Moon,
  Sun,
  // Component icons
  Square,
  CreditCard,
  Loader2,
  Rocket,
  BarChart3,
  // Action icons
  ExternalLink,
  Eye,
  EyeOff,
  // Navigation icons
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  // Status icons
  Check,
  AlertCircle,
  HelpCircle,
  Zap,
  Trash2,
  Edit3,
  Upload,
  Download,
} from 'lucide-react'

// Icon mapping for semantic meaning
export const Icons = {
  // Authentication & User
  user: User,
  login: LogIn,
  register: UserPlus,
  logout: ArrowLeft,
  profile: User,

  // Security
  security: Lock,
  password: Lock,

  // Actions
  save: Save,
  edit: Edit3,
  delete: Trash2,
  upload: Upload,
  download: Download,

  // Status & Feedback
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  help: HelpCircle,

  // Navigation
  home: Home,
  back: ArrowLeft,
  forward: ArrowRight,
  external: ExternalLink,
  menu: Menu,
  close: X,
  chevronDown: ChevronDown,

  // UI Elements
  notification: Bell,
  settings: Settings,
  theme: Palette,
  sun: Sun,
  moon: Moon,
  eye: Eye,
  eyeOff: EyeOff,

  // Content
  card: CreditCard,
  component: Square,
  dashboard: BarChart3,
  analytics: BarChart3,

  // Loading & Progress
  loading: Loader2,
  spinner: Loader2,

  // Brand & Feature
  rocket: Rocket,
  feature: Zap,

  // Form & Input
  check: Check,
  alert: AlertCircle,
}

// Icon size mapping
export const IconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const

// Utility component for consistent icon usage
interface IconProps {
  name: keyof typeof Icons
  size?: keyof typeof IconSizes | number
  className?: string
}

export function Icon({ name, size = 'md', className }: IconProps) {
  const IconComponent = Icons[name]
  const iconSize = typeof size === 'number' ? size : IconSizes[size]

  return <IconComponent size={iconSize} className={className} />
}

export default Icons
