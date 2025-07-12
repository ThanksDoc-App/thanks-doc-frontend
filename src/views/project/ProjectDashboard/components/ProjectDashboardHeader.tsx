type ProjectDashboardHeaderProps = {
    userName?: string
    taskCount?: number
}

const ProjectDashboardHeader = ({
    userName,
    taskCount,
}: ProjectDashboardHeaderProps) => {
    return (
        <div>
            <h4 className="mb-1">
                Hello, Dr{' '}
                {userName
                    ? userName.charAt(0).toUpperCase() + userName.slice(1)
                    : 'User'}
                !
            </h4>
            <p>Explore jobs around you.</p>
        </div>
    )
}

export default ProjectDashboardHeader
