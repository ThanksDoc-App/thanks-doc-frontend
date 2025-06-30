import SignUpForm from '@/views/auth/SignUp/SignUpForm'
import Simple from '@/components/layouts/AuthLayout/Simple'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'

const SignUpSimple = () => {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }
    return (
        <div className="relative min-h-screen">
            {/* Back button */}
            <div className="absolute top-6 left-4 mt-2 sm:left-10 z-10">
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
            <div className="flex items-center justify-center min-h-screen w-full">
                <Simple
                    content={
                        <div className="mb-4">
                            <h3 className="mb-1">Sign Up</h3>
                            <p>And start getting jobs around you</p>
                        </div>
                    }
                >
                    <SignUpForm
                        // disableSubmit={false}
                        signInUrl="/auth/sign-in-simple"
                    />
                </Simple>
            </div>
        </div>
    )
}

export default SignUpSimple
