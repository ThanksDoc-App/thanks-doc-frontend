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

injectReducer('projectDashboard', reducer)

const ProjectDashboard = () => {
    const dispatch = useAppDispatch()
    const { shouldHideKYCSetup } = useKYCStatus()

    const dashboardData = useAppSelector(
        (state) => state.projectDashboard.data.dashboardData,
    )
    const loading = useAppSelector(
        (state) => state.projectDashboard.data.loading,
    )

    const localUserName =
        JSON.parse(localStorage.getItem('userdetails') || '{}')?.data?.name ||
        'Doctor'

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        dispatch(getProjectDashboardData())
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={loading}>
                <KYCsetUp isVisible={!shouldHideKYCSetup} />
                <ProjectDashboardHeader
                    userName={dashboardData?.userName || localUserName}
                    taskCount={dashboardData?.taskCount}
                />
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-auto">
                        {/* <TaskOverview
                            data={dashboardData?.projectOverviewData}
                        /> */}
                        <MyTasks data={dashboardData?.myTasksData} />
                        {/* <Projects data={dashboardData?.projectsData} /> */}{' '}
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default ProjectDashboard
