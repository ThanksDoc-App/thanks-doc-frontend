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

injectReducer('projectDashboard', reducer)

const ProjectDashboard = () => {
    const dispatch = useAppDispatch()

    const dashboardData = useAppSelector(
        (state) => state.projectDashboard.data.dashboardData,
    )
    const loading = useAppSelector((state) => state.projectDashboard.loading)

    // Old logic: only used dashboardData?.userName
    // <ProjectDashboardHeader
    //     userName={dashboardData?.userName}
    //     taskCount={dashboardData?.taskCount}
    // />

    // New logic: fallback to name in localStorage if dashboardData.userName is missing
    const localUserName =
        JSON.parse(localStorage.getItem('userdetails') || '{}')?.data?.name ||
        'Doctor'

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        dispatch(getProjectDashboardData())
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={loading}>
                {/* Old version */}
                {/* <ProjectDashboardHeader
                    userName={dashboardData?.userName}
                    taskCount={dashboardData?.taskCount}
                /> */}

                {/* New version with localStorage fallback */}
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
                        {/* <Projects data={dashboardData?.projectsData} /> */}
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default ProjectDashboard
