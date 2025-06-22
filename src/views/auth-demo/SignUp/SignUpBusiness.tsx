import Simple from '@/components/layouts/AuthLayout/Simple'
import { Button } from '@/components/ui'
import SignUpFormBusiness from '@/views/auth/SignUp/SignUpFormBusiness'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SignUpBusiness = () => {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <div className="relative min-h-screen">
            {/* Back button */}
            <div className="absolute top-10  z-10">
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
            <Simple
                content={
                    <div className="mb-4">
                        <h3 className="mb-1">Get Started</h3>
                        {/* <p>Start posting jobs!</p> */}
                    </div>
                }
            >
                <SignUpFormBusiness signInUrl="/auth/sign-in-business" />
            </Simple>
        </div>
    )
}

export default SignUpBusiness
