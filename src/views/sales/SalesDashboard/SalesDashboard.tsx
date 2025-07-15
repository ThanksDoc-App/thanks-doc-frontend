import reducer from './store'
import { injectReducer } from '@/store'
import SalesDashboardHeader from './components/SalesDashboardHeader'
import SalesDashboardBody from './components/SalesDashboardBody'
import KYCsetUp from '@/views/account/KycForm/components/KYCsetUp'
import { useKYCStatus } from '@/utils/hooks/useKYCStatus'

injectReducer('salesDashboard', reducer)

const SalesDashboard = () => {
    const { shouldHideKYCSetup } = useKYCStatus()

    return (
        <div className="flex flex-col gap-4 h-full">
            <KYCsetUp isVisible={!shouldHideKYCSetup} />
            <SalesDashboardHeader />
            <SalesDashboardBody />
        </div>
    )
}

export default SalesDashboard
