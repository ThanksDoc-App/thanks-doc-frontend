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

// Simple function to get current user role
const getCurrentUserRole = (): string | null => {
  try {
    const userDetailsString = localStorage.getItem('userdetails')
    if (userDetailsString) {
      const userDetails = JSON.parse(userDetailsString)
      return userDetails.data?.signedUpAs?.toLowerCase() || null
    }
  } catch (error) {
    console.error('Error getting user role:', error)
  }
  return null
}

// Enhanced navigation configuration - ALWAYS generates fresh config
export const getAppsNavigationConfig = (): NavigationTree[] => {
  // Always get fresh copy of base config
  const configCopy = JSON.parse(JSON.stringify(baseConfig))
  
  // Get current user role fresh each time
  const signedUpAs = getCurrentUserRole()
  
  console.log('Generating navigation for role:', signedUpAs)
  
  if (!signedUpAs) {
    console.warn('No user role found')
    return configCopy
  }
  
  const appsSection = configCopy.find((section: NavigationTree) => section.key === 'apps')
  
  if (appsSection && Array.isArray(appsSection.subMenu)) {
    let newSubMenu: NavigationTree[] = []
    
    if (signedUpAs === 'super admin' || signedUpAs.includes('admin')) {
      // Admin users - show CRM items
      for (const item of appsSection.subMenu) {
        if (item.key === 'apps.crm') {
          const children = JSON.parse(JSON.stringify(item.subMenu))
          if (children.length > 0) {
            children[0].icon = item.icon
          }
          newSubMenu.push(...children)
        } else if (item.key === 'appsAccount.settings') {
          newSubMenu.push(item)
        }
      }
    } else {
      // Doctor/Business users
      for (const item of appsSection.subMenu) {
        // Skip wrong role items
        if ((signedUpAs === 'doctor' && item.key === 'apps.sales') ||
            (signedUpAs === 'business' && item.key === 'apps.project') ||
            (item.key === 'apps.crm')) {
          continue
        }
        
        if (item.key === 'appsAccount.settings') {
          newSubMenu.push(item)
        } else if (item.type === NAV_ITEM_TYPE_COLLAPSE && Array.isArray(item.subMenu)) {
          const children = JSON.parse(JSON.stringify(item.subMenu))
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

// Simple hook for React components
export const useNavigationConfig = () => {
  const [config, setConfig] = useState<NavigationTree[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const refreshConfig = useCallback(() => {
    const newConfig = getAppsNavigationConfig()
    setConfig(newConfig)
    setIsLoading(false)
  }, [])
  
  useEffect(() => {
    // Initial load
    refreshConfig()
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userdetails') {
        setTimeout(refreshConfig, 100) // Small delay to ensure localStorage is updated
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [refreshConfig])
  
  return { config, isLoading, refreshConfig }
}

// Simple auth helper - call this after login
export const updateNavigationAfterAuth = (userDetails: any) => {
  localStorage.setItem('userdetails', JSON.stringify(userDetails))
  
  // Force refresh navigation after a short delay
  setTimeout(() => {
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userdetails',
      newValue: JSON.stringify(userDetails)
    }))
  }, 100)
}

// Default export
export default getAppsNavigationConfig()
