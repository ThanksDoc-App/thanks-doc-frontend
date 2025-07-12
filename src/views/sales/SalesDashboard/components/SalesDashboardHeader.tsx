import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

type SalesDashboardHeaderProps = {
    userName?: string
    taskCount?: number
}

const SalesDashboardHeader = ({
    userName,
    taskCount,
}: SalesDashboardHeaderProps) => {
    const navigate = useNavigate()

    const localUserName = JSON.parse(
        localStorage.getItem('userdetails') || '{}',
    )?.data?.name

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h4 className="mb-1">
                    Hello,{' '}
                    {localUserName?.charAt(0).toUpperCase() +
                        localUserName?.slice(1)}
                </h4>
                <p>Explore jobs around you.</p>
            </div>
            <Button
                variant="solid"
                className="w-full md:w-auto"
                onClick={() => navigate('/app/sales/product-new')}
            >
                Post a Job
            </Button>
        </div>
    )
}

export default SalesDashboardHeader
