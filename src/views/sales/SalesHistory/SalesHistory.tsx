import React from 'react'
import SalesHistoryTable from './components/SalesHistoryTable'

const SalesHistory = () => {
    return (
        <div>
            <div>
                <div className="flex flex-col lg:flex-row justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0">Job Listing </h3>
                    {/* <JobHistoryTool /> */}
                </div>
                <SalesHistoryTable />
            </div>
        </div>
    )
}

export default SalesHistory
