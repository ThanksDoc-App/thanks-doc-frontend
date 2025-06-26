// injectReducer('salesDashboard', reducer)

import CrmDashboardBody from './components/CrmDashboardBody'
import CrmDashboardHeader from './components/CrmDashboardHeader'

const CrmDashboard = () => {
    return (
        <div className="flex flex-col gap-4 h-full">
            <CrmDashboardHeader /> <CrmDashboardBody />
        </div>
    )
}

export default CrmDashboard
