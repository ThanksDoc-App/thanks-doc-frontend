import reducer from '@/store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import JobHistoryTool from './JobHistoryTools'
import JobHistoryTable from './JobHistoryTable'

// injectReducer('salesProductList', reducer)

const JobHistory = () => {
    return (
        // <AdaptableCard
        //     className="h-full"
        //     bodyClass="h-full -px-1 sm:px-4 md:px-6 lg:px-8"
        // >
        <div>
            <div className="flex flex-col lg:flex-row justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Job History</h3>
                <JobHistoryTool />
            </div>
            <JobHistoryTable />
        </div>
        // </AdaptableCard>
    )
}

export default JobHistory
