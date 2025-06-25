import { useState, useEffect, Suspense, lazy } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { useNavigate, useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { apiGetAccountSettingData } from '@/services/AccountServices'

type AccountSetting = {
    profile: {
        name: string
        email: string
        phone: string
        title: string
        avatar: string
        timeZone: string
        lang: string
        syncData: boolean
    }
    loginHistory: {
        type: string
        deviceName: string
        time: number
        location: string
    }[]
    notification: {
        news: string[]
        accountActivity: string[]
        signIn: string[]
        reminders: string[]
        mentioned: string[]
        replies: string[]
        taskUpdate: string[]
        assigned: string[]
        newProduct: string[]
        newOrder: string[]
    }
}

type GetAccountSettingData = AccountSetting

const Profile = lazy(() => import('./components/Profile'))
const Password = lazy(() => import('./components/Password'))
const NotificationSetting = lazy(
    () => import('./components/NotificationSetting'),
)
const Integration = lazy(() => import('./components/Integration'))
const Billing = lazy(() => import('./components/Billing'))

const { TabNav, TabList } = Tabs

const settingsMenu: Record<
    string,
    {
        label: string
        path: string
    }
> = {
    profile: { label: 'Profile', path: 'profile' },
    integration: { label: 'Documents', path: 'integration' },
    billing: { label: 'Account Details', path: 'billing' },
    password: { label: 'Password', path: 'password' },
}

const Settings = () => {
    const [currentTab, setCurrentTab] = useState('profile')
    const [data, setData] = useState<Partial<AccountSetting>>({})

    const navigate = useNavigate()
    const location = useLocation()

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1,
    )

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/app/account/settings/${val}`)
    }

    const fetchData = async () => {
        const response = await apiGetAccountSettingData<GetAccount>()
        setData(response.data)
    }

    useEffect(() => {
        setCurrentTab(path)
        if (isEmpty(data)) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Get signedUpAs from localStorage
    let signedUpAs: string | null = null
    try {
        const userDetails = localStorage.getItem('userdetails')
        if (userDetails) {
            const parsed = JSON.parse(userDetails)
            signedUpAs = parsed?.data?.signedUpAs
        }
    } catch (error) {
        console.error('Error parsing userdetails:', error)
    }

    // Filter tabs based on signedUpAs
    const filteredTabs = Object.keys(settingsMenu).filter((key) => {
        if (
            signedUpAs === 'business' &&
            (key === 'integration' || key === 'billing')
        ) {
            return false
        }
        return true
    })

    return (
        <Container>
            <AdaptableCard>
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
                    <TabList>
                        {filteredTabs.map((key) => (
                            <TabNav key={key} value={key}>
                                {settingsMenu[key].label}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>
                <div className="px-4 py-6">
                    <Suspense fallback={<></>}>
                        {currentTab === 'profile' && (
                            <Profile
                                data={
                                    data.profile
                                        ? {
                                              address: '',
                                              ...data.profile,
                                          }
                                        : undefined
                                }
                            />
                        )}
                        {currentTab === 'password' && (
                            <Password data={data.loginHistory} />
                        )}
                        {currentTab === 'notification' && (
                            <NotificationSetting data={data.notification} />
                        )}
                        {currentTab === 'integration' &&
                            signedUpAs !== 'business' && <Integration />}
                        {currentTab === 'billing' &&
                            signedUpAs !== 'business' && <Billing />}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default Settings
