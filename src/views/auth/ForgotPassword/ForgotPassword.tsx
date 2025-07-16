import Simple from '@/components/layouts/AuthLayout/Simple'
import ForgotPasswordForm from './ForgotPasswordForm'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const ForgotPassword = () => {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center ">
            {/* Back button */}
            <div className="absolute top-10 left-4 z-10">
                <Button
                    variant="plain"
                    onClick={handleBack}
                    type="button"
                    className="flex items-center gap-1"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>

            {/* Main Layout */}
            <Simple>
                <ForgotPasswordForm />
            </Simple>
        </div>
    )
}

export default ForgotPassword
