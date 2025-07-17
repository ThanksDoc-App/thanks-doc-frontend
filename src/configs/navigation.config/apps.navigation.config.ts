// navigation.config.ts
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import {
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { DOCTOR, BUSINESS, ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const baseConfig: NavigationTree[] = [
  {
    key: 'apps',
    path: '',
    title: '',
    translateKey: '',
    icon: 'apps',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [DOCTOR, BUSINESS],
    subMenu: [
      {
        key: 'apps.project',
        path: '',
        title: 'Doctor Dashboard',
        translateKey: 'nav.appsProject.project',
        icon: 'explore',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [DOCTOR],
        subMenu: [
          {
            key: 'appsProject.dashboard',
            path: `${APP_PREFIX_PATH}/project/dashboard`,
            title: 'Dashboard',
            translateKey: 'nav.appsProject.dashboard',
            icon: 'explore',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [DOCTOR],
            subMenu: [],
          },
          {
            key: 'appsProject.history',
            path: `${APP_PREFIX_PATH}/project/history`,
            title: 'Listing',
            translateKey: 'nav.appsProject.history',
            icon: 'job_history',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [DOCTOR],
            subMenu: [],
          },
        ],
      },
      {
        key: 'apps.sales',
        path: '',
        title: 'Sales',
        translateKey: 'nav.appsSales.sales',
        icon: 'busness_dashboard',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [BUSINESS],
        subMenu: [
          {
            key: 'appsSales.dashboard',
            path: `${APP_PREFIX_PATH}/sales/dashboard`,
            title: 'Dashboard',
            translateKey: 'nav.appsSales.dashboard',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [BUSINESS],
            subMenu: [],
          },
          {
        key: 'appsSales.listing',
            path: `${APP_PREFIX_PATH}/sales/history`,
            title: 'Listing',
            translateKey: 'nav.appsSales.listing',
            icon: 'job_listing',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [BUSINESS],
            subMenu: [],
          },
        ],
      },
      {
        key: 'apps.crm',
        path: '',
        title: 'CRM',
        translateKey: 'nav.appsCrm.crm',
        icon: 'busness_dashboard',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN],
        subMenu: [
          {
            key: 'appsCrm.dashboard',
            path: `${APP_PREFIX_PATH}/crm/dashboard`,
            title: 'Dashboard',
            translateKey: 'nav.appsCrm.dashboard',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN],
            subMenu: [],
          },
          {
            key: 'appsCrm.business',
            path: `${APP_PREFIX_PATH}/crm/business`,
            title: 'Business',
            translateKey: 'nav.appsCrm.business',
            icon: 'business_icon',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN],
            subMenu: [],
          },
          {
            key: 'appsCrm.doctor',
            path: `${APP_PREFIX_PATH}/crm/doctor`,
            title: 'Doctor',
            translateKey: 'nav.appsCrm.doctor',
            icon: 'doctor_icon',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN],
            subMenu: [],
          },
          {
            key: 'appsCrm.service',
            path: `${APP_PREFIX_PATH}/crm/service`,
            title: 'Services',
            translateKey: 'nav.appsCrm.service',
            icon: 'job_history',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN],
            subMenu: [],
          },
          {
            key: 'appsCrm.category',
            path: `${APP_PREFIX_PATH}/crm/category`,
            title: 'Category',
            translateKey: 'nav.appsCrm.category',
            icon: 'category_icon',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN],
            subMenu: [],
          },
        ],
      },
      {
        key: 'appsAccount.settings',
        path: `${APP_PREFIX_PATH}/account/settings/profile`,
        title: 'Settings',
        translateKey: 'nav.appsAccount.settings',
        icon: 'settings_icon',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [DOCTOR, BUSINESS, ADMIN, USER],
        subMenu: [],
      },
    ],
  },
]

// Enhanced navigation configuration with proper state management
export const getAppsNavigationConfig = (userRole?: string): NavigationTree[] => {
  const configCopy = structuredClone(baseConfig)
  
  // Get user role from parameter or localStorage
  let signedUpAs: string | null = userRole || null
  
  if (!signedUpAs) {
    const userDetailsString = localStorage.getItem('userdetails')
    
    if (userDetailsString) {
      try {
        const userDetails = JSON.parse(userDetailsString)
        signedUpAs = userDetails.data?.signedUpAs?.toLowerCase() || null
      } catch (error) {
        console.error('Error parsing user details from localStorage:', error)
        return configCopy // Return base config if parsing fails
      }
    }
  }
  
  // If no user role found, return base config
  if (!signedUpAs) {
    console.warn('No user role found, returning base navigation config')
    return configCopy
  }
  
  const appsSection = configCopy.find(section => section.key === 'apps')
  
  if (appsSection && Array.isArray(appsSection.subMenu)) {
    let newSubMenu: NavigationTree[] = []
    
    if (signedUpAs === 'super admin') {
      // Super admin logic
      for (const item of appsSection.subMenu) {
        if (item.key === 'apps.crm') {
          const children = structuredClone(item.subMenu)
          if (children.length > 0) {
            children[0].icon = item.icon
          }
          newSubMenu.push(...children)
        } else if (item.key === 'appsAccount.settings') {
          // Always include settings for super admin
          newSubMenu.push(item)
        }
      }
    } else {
      // Regular user logic
      for (const item of appsSection.subMenu) {
        // Skip items based on user role
        if ((signedUpAs === 'doctor' && item.key === 'apps.sales') ||
            (signedUpAs === 'business' && item.key === 'apps.project')) {
          continue
        }
        
        if (item.key === 'appsAccount.settings') {
          // Always include settings for all users
          newSubMenu.push(item)
        } else if (item.key === 'apps.crm') {
          if (signedUpAs !== 'doctor' && signedUpAs !== 'business') {
            const children = structuredClone(item.subMenu)
            if (children.length > 0) {
              children[0].icon = item.icon
            }
            newSubMenu.push(...children)
          }
        } else if (item.type === NAV_ITEM_TYPE_COLLAPSE && Array.isArray(item.subMenu)) {
          const children = structuredClone(item.subMenu)
          if (children.length > 0) {
            children[0].icon = item.icon
          }
          newSubMenu.push(...children)
        } else {
          newSubMenu.push(item)
        }
      }
    }
    
    appsSection.subMenu = newSubMenu
  }
  
  return configCopy
}

// Navigation store/context for state management
class NavigationStore {
  private static instance: NavigationStore
  private currentConfig: NavigationTree[] = []
  private userRole: string | null = null
  private listeners: Array<(config: NavigationTree[]) => void> = []
  
  private constructor() {
    this.initialize()
  }
  
  static getInstance(): NavigationStore {
    if (!NavigationStore.instance) {
      NavigationStore.instance = new NavigationStore()
    }
    return NavigationStore.instance
  }
  
  private initialize() {
    // Listen for localStorage changes
    window.addEventListener('storage', this.handleStorageChange.bind(this))
    
    // Initial load
    this.updateFromStorage()
  }
  
  private handleStorageChange(event: StorageEvent) {
    if (event.key === 'userdetails') {
      this.updateFromStorage()
    }
  }
  
  private updateFromStorage() {
    const userDetailsString = localStorage.getItem('userdetails')
    let newUserRole: string | null = null
    
    if (userDetailsString) {
      try {
        const userDetails = JSON.parse(userDetailsString)
        newUserRole = userDetails.data?.signedUpAs?.toLowerCase() || null
      } catch (error) {
        console.error('Error parsing user details from localStorage:', error)
      }
    }
    
    // Only update if role has changed
    if (newUserRole !== this.userRole) {
      this.userRole = newUserRole
      this.currentConfig = getAppsNavigationConfig(this.userRole)
      this.notifyListeners()
    }
  }
  
  public updateUserRole(role: string) {
    this.userRole = role
    this.currentConfig = getAppsNavigationConfig(this.userRole)
    this.notifyListeners()
  }
  
  public getConfig(): NavigationTree[] {
    return this.currentConfig
  }
  
  public subscribe(listener: (config: NavigationTree[]) => void) {
    this.listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentConfig))
  }
  
  public refreshConfig() {
    this.updateFromStorage()
  }
}

// Hook for React components
export const useNavigationConfig = () => {
  const [config, setConfig] = useState<NavigationTree[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const store = NavigationStore.getInstance()
    
    // Set initial config
    setConfig(store.getConfig())
    setIsLoading(false)
    
    // Subscribe to changes
    const unsubscribe = store.subscribe((newConfig) => {
      setConfig(newConfig)
      setIsLoading(false)
    })
    
    // Cleanup
    return unsubscribe
  }, [])
  
  const refreshConfig = () => {
    NavigationStore.getInstance().refreshConfig()
  }
  
  return { config, isLoading, refreshConfig }
}

// Authentication helper
export const updateNavigationAfterAuth = (userDetails: any) => {
  // Save to localStorage
  localStorage.setItem('userdetails', JSON.stringify(userDetails))
  
  // Update navigation store
  const role = userDetails.data?.signedUpAs?.toLowerCase() || null
  if (role) {
    NavigationStore.getInstance().updateUserRole(role)
  }
}

// Default export for backward compatibility
export default getAppsNavigationConfig()