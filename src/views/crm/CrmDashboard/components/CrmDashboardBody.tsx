import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminDashboardStats } from '@/views/crm/CrmDashboard/store' // Updated path to match your structure
import { RootState } from '@/store' // Adjust path as needed
import { useAppDispatch } from '../../Services/store'
import { useNavigate } from 'react-router-dom'
// import { useAppDispatch } from '@/hooks/useAppDispatch' // Create this hook if not present

const CrmDashboardBody = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const adminDashboardState = useSelector(
        (state: RootState) => state.adminDashboard,
    )
    const { stats, loading, error } = adminDashboardState?.data || {
        stats: null,
        loading: false,
        error: null,
    }

    useEffect(() => {
        dispatch(getAdminDashboardStats())
    }, [dispatch])

    return (
        <div className="flex items-center justify-between gap-4 mt-5">
            <div
                className="w-full h-[120px] border border-[#D6DDEB] py-4 px-5 flex  gap-2 flex-col cursor-pointer"
                onClick={() => navigate('/app/crm/business')}
            >
                <p className="text-[#7C8493] text-[14px] font-[400]">
                    Total Business
                </p>
                <h5 className=" text-[16px] font-[600]">
                    {stats?.businesses || 0}
                </h5>
            </div>
            <div
                className="w-full h-[120px] border border-[#D6DDEB] py-4 px-5 flex  gap-2 flex-col cursor-pointer"
                onClick={() => navigate('/app/crm/doctor')}
            >
                <p className="text-[#7C8493] text-[14px] font-[400]">
                    Total Doctors
                </p>
                <h5 className="text-[16px] font-[600]">
                    {stats?.doctors || 0}
                </h5>
            </div>
            <div className="w-full h-[120px] border border-[#D6DDEB] py-4 px-5 flex  gap-2 flex-col">
                <p className="text-[#7C8493] text-[14px] font-[400]">
                    Total Services
                </p>
                <h5 className="text-[16px] font-[600]">
                    {stats?.services || 0}
                </h5>
            </div>
        </div>
    )
}

export default CrmDashboardBody
