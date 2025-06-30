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
        <div className="relative flex items-center justify-center bg-gray-50 px-4">
            {/* Back button */}
            <div className="absolute top-6 left-4 mt-2 sm:left-10 z-10">
                <Button
                    variant="plain"
                    onClick={handleBack}
                    type="button"
                    className="flex items-center gap-1 text-gray-700 hover:text-black"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>

            {/* Centered Form */}
            <div className="flex items-center justify-center min-h-screen w-full">
                <Simple
                    content={
                        <div className="mb-4 text-center">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                                Get Started
                            </h3>
                            {/* <p className="text-gray-500">Start posting jobs!</p> */}
                        </div>
                    }
                >
                    <SignUpFormBusiness signInUrl="/auth/sign-in-business" />
                </Simple>
            </div>
        </div>
    )
}

export default SignUpBusiness
