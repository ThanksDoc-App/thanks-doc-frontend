import React from 'react'

const CrmDashboardBody = () => {
    return (
        <div className="flex items-center justify-between gap-4 mt-5">
            <div className="w-full h-[120px] border border-[#D6DDEB] py-4 px-5 flex  gap-2 flex-col">
                <p className="text-[#7C8493] text-[14px] font-[400]">
                    Total Business
                </p>
                <h5 className="text-[#25324B] text-[16px] font-[600]">200</h5>
            </div>
            <div className="w-full h-[120px] border border-[#D6DDEB] py-4 px-5 flex  gap-2 flex-col">
                <p className="text-[#7C8493] text-[14px] font-[400]">
                    Total Doctors
                </p>
                <h5 className="text-[#25324B] text-[16px] font-[600]">200</h5>
            </div>
            <div className="w-full h-[120px] border border-[#D6DDEB] py-4 px-5 flex  gap-2 flex-col">
                <p className="text-[#7C8493] text-[14px] font-[400]">
                    Total Services
                </p>
                <h5 className="text-[#25324B] text-[16px] font-[600]">5</h5>
            </div>
        </div>
    )
}

export default CrmDashboardBody
