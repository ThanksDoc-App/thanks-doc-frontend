import { useEffect } from 'react'
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

injectReducer('salesDashboard', reducer)

const SalesDashboard = () => {
    const dispatch = useAppDispatch()
    const { shouldHideKYCSetupForSales, userRole } = useKYCStatus()

    // Get profile data from Redux
    const { profileData } = useSelector((state: RootState) => state.settings)

    useEffect(() => {
        // Fetch profile data if not already available
        if (!profileData) {
            dispatch(getUserProfile())
        }
    }, [dispatch, profileData])

    console.log('User Role:', userRole)
    console.log('Should Hide KYC Setup for Sales:', shouldHideKYCSetupForSales)

    return (
        <div className="flex flex-col gap-4 h-full">
            <KYCsetUp isVisible={!shouldHideKYCSetupForSales} />
            <SalesDashboardHeader />
            <SalesDashboardBody />
        </div>
    )
}

export default SalesDashboard
