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

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h4 className="mb-1">Hello, Admin</h4>
            </div>
            <div className="flex items-center justify-center gap-3">
                {' '}
                <Button
                    className="w-full px-2 md:w-auto flex items-center justify-center gap-2 border-0 "
                    onClick={() => navigate('/app/crm/create-category')}
                >
                    <IoMdArrowRoundForward size={20} color="#0F9297" />
                    <span className="text-[#0F9297]">Create a category </span>
                </Button>
                <Button
                    variant="solid"
                    className="w-full md:w-auto flex items-center justify-center gap-2"
                    onClick={() => navigate('/app/crm/create-service')}
                >
                    <FiPlus size={20} />
                    Create a service{' '}
                </Button>
            </div>
        </div>
    )
}

export default CrmDashboardHeader
