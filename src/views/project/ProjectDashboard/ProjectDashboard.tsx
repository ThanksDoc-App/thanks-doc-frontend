import { useEffect } from 'react'
import reducer, {
    getProjectDashboardData,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store'
import Loading from '@/components/shared/Loading'
import ProjectDashboardHeader from './components/ProjectDashboardHeader'
import TaskOverview from './components/TaskOverview'
import MyTasks from './components/MyTasks'
import KYCsetUp from '../../account/KycForm/components/KYCsetUp'
import { useKYCStatus } from '@/utils/hooks/useKYCStatus'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getUserProfile } from '@/views/account/Settings/store/SettingsSlice'

injectReducer('projectDashboard', reducer)

const ProjectDashboard = () => {
    const dispatch = useAppDispatch()
    const { shouldHideKYCSetup, userRole } = useKYCStatus()

    const dashboardData = useAppSelector(
        (state) => state.projectDashboard.data.dashboardData,
    )
    const loading = useAppSelector(
        (state) => state.projectDashboard.data.loading,
    )

    // Get profile data from Redux
    const { profileData } = useSelector((state: RootState) => state.settings)

    // Fixed: Access the name from the correct nested structure
    const userDetails = JSON.parse(localStorage.getItem('userdetails') || '{}')
    const localUserName = userDetails?.data?.name || 'Doctor'

    // Use profile data if available, otherwise fallback to localStorage
    const userName = profileData?.data?.name || localUserName

    useEffect(() => {
        fetchData()
        // Fetch profile data if not already available
        if (!profileData) {
            dispatch(getUserProfile())
        }
    }, [dispatch, profileData])

    const fetchData = () => {
        dispatch(getProjectDashboardData())
    }

    console.log('User Role:', userRole)
    console.log('Should Hide KYC Setup:', shouldHideKYCSetup)

    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={loading}>
                <KYCsetUp isVisible={!shouldHideKYCSetup} />
                <ProjectDashboardHeader
                    userName={userName}
                    taskCount={dashboardData?.taskCount}
                />
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-auto">
                        <MyTasks data={dashboardData?.myTasksData} />
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default ProjectDashboard
