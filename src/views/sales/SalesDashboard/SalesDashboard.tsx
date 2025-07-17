import { useEffect, useState } from 'react'
import reducer from './store'
import { injectReducer } from '@/store'
import SalesDashboardHeader from './components/SalesDashboardHeader'
import SalesDashboardBody from './components/SalesDashboardBody'
import KYCsetUp from '@/views/account/KycForm/components/KYCsetUp'
import { useKYCStatus } from '@/utils/hooks/useKYCStatus'
import { useAppDispatch } from '@/store'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getUserProfile } from '@/views/account/Settings/store/SettingsSlice'
import Loading from '@/components/shared/Loading'

injectReducer('salesDashboard', reducer)

const SalesDashboard = () => {
    const dispatch = useAppDispatch()
    const { shouldHideKYCSetupForSales, userRole } = useKYCStatus()
    const [showContent, setShowContent] = useState(false)

    // Get profile data from Redux
    const { profileData, loading } = useSelector(
        (state: RootState) => state.settings,
    )

    useEffect(() => {
        // Fetch profile data if not already available
        if (!profileData) {
            dispatch(getUserProfile())
        }
    }, [dispatch, profileData])

    // Add delay after loading is complete
    useEffect(() => {
        if (!loading && profileData) {
            const timer = setTimeout(() => {
                setShowContent(true)
            }, 500) // 5 second delay

            return () => clearTimeout(timer)
        } else {
            setShowContent(false)
        }
    }, [loading, profileData])

    console.log('User Role:', userRole)
    console.log('Should Hide KYC Setup for Sales:', shouldHideKYCSetupForSales)

    // Show loading until both API loading is done AND delay has passed
    const isLoading = loading || !showContent

    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={isLoading}>
                <KYCsetUp isVisible={!shouldHideKYCSetupForSales} />
                <SalesDashboardHeader />
                <SalesDashboardBody />
            </Loading>
        </div>
    )
}

export default SalesDashboard
