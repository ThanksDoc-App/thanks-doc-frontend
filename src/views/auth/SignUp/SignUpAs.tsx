import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Briefcase } from 'lucide-react' // Make sure this is the right import
import { Button } from '@/components/ui'

const SignUpAs = () => {
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
        <div className="relative flex items-center justify-center min-h-screen p-3 bg-[#F9FAFB]">
            {/* Back Button */}
            <div className="absolute top-4 left-2 sm:top-10 sm:left-5 z-10">
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
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-10">
                <h1 className="text-[24px] sm:text-[30px] font-[600] text-[#202430] text-center mb-8 sm:mb-12">
                    Sign up as
                </h1>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5">
                    <button
                        onClick={handleDoctorSignUp}
                        className="w-full sm:w-auto min-w-[140px] h-[50px] px-5 bg-white border border-[#D6DDEB] rounded-md text-[16px] text-[#25324B] font-[500] hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <User className="w-5 h-5" />
                        As a Doctor
                    </button>
                    <button
                        onClick={handleBusinessSignUp}
                        className="w-full sm:w-auto min-w-[140px] h-[50px] px-5 bg-white border border-[#D6DDEB] rounded-md text-[16px] text-[#25324B] font-[500] hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <Briefcase className="w-5 h-5" />
                        As a Business
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignUpAs
