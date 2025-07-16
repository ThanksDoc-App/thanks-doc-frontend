import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react' // Make sure this is the right import
import { Button } from '@/components/ui'

const SignUpAs = ({ className }: any) => {
    const navigate = useNavigate()

    const handleDoctorSignUp = () => {
        localStorage.setItem('signedUpAs', 'doctor')
        navigate('/sign-up-doctor', { state: { signedUpAs: 'doctor' } })
    }

    const handleBusinessSignUp = () => {
        localStorage.setItem('signedUpAs', 'business')
        navigate('/sign-up-business', { state: { signedUpAs: 'business' } })
    }

    const handleBack = () => {
        navigate(-1) // Navigates back to the previous page
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen p-3">
            {/* Back Button */}
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

            {/* Centered Content */}
            <div className={`w-full max-w-md ${className}`}>
                <h1 className="text-[30px] font-[600] text-[#202430] dark:text-white text-center mb-12">
                    Sign up
                </h1>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
                    <button
                        onClick={handleDoctorSignUp}
                        className="flex-1 min-w-[140px] h-[50px] px-5 bg-white border border-[#D6DDEB] rounded-md text-[16px] text-[#25324B] font-[500] hover:bg-gray-50 transition-colors duration-200"
                    >
                        As a Doctor
                    </button>
                    <button
                        onClick={handleBusinessSignUp}
                        className="flex-1 min-w-[160px] h-[47px] px-5 bg-teal-600 text-white rounded-md font-[700] text-[16px] hover:bg-teal-700 transition-colors duration-200"
                    >
                        As a Business
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignUpAs
