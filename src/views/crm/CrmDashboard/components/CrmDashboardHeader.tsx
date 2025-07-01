import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { IoMdArrowRoundForward } from 'react-icons/io'

type CrmDashboardHeaderProps = {
    userName?: string
    taskCount?: number
}

const CrmDashboardHeader = ({
    userName,
    taskCount,
}: CrmDashboardHeaderProps) => {
    const navigate = useNavigate()

    const localUserName = JSON.parse(
        localStorage.getItem('userdetails') || '{}',
    )?.data?.name

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h4 className="mb-1 text-lg font-semibold">
                    Hello,{' '}
                    {(userName || 'Admin').charAt(0).toUpperCase() +
                        (userName || 'Admin').slice(1)}
                </h4>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end w-full md:w-auto">
                <Button
                    className="w-full sm:w-auto flex items-center justify-center gap-2 border-0 px-3 py-2"
                    onClick={() => navigate('/app/crm/create-category')}
                >
                    <IoMdArrowRoundForward size={20} color="#0F9297" />
                    <span className="text-[#0F9297] whitespace-nowrap">
                        Create a category
                    </span>
                </Button>
                <Button
                    variant="solid"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2"
                    onClick={() => navigate('/app/crm/create-service')}
                >
                    <FiPlus size={20} />
                    <span className="whitespace-nowrap">Create a service</span>
                </Button>
            </div>
        </div>
    )
}

export default CrmDashboardHeader
