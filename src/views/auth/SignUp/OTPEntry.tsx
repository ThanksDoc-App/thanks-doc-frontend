import { apiVerifyOtp } from '@/services/AuthService'
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export type OTPResponse = {
    message?: any
    status: boolean
}

interface Meta {
    [key: string]: any
}

const OTPEntry = <T extends Meta>(props: T): React.JSX.Element => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    const handleContinue = async () => {
        const otpValue = otp.join('')

        if (otpValue.length === 6) {
            setIsLoading(true)
            try {
                const response = await apiVerifyOtp({ otp: Number(otpValue) })

                const responseData = response.data as OTPResponse
                const statusCode = response.status

                if (
                    statusCode === 200 ||
                    statusCode === 201 ||
                    responseData.status === true
                ) {
                    toast.success('OTP verified successfully!')
                    navigate('/sign-in')
                } else {
                    throw new Error(
                        responseData?.message || 'Verification failed',
                    )
                }
            } catch (error: any) {
                console.error('OTP verification error:', error)
                const errorMessage =
                    error?.response?.data?.message ||
                    error.message ||
                    'Invalid OTP'
                toast.error(errorMessage)
            } finally {
                setIsLoading(false)
            }
        } else {
            toast.error('Please enter all 6 digits')
        }
    }

    const handleChange = (index: number, value: string) => {
        if (value.length > 1 || (value && !/^\d$/.test(value))) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus()
        }

        // Auto-submit when all 6 digits are filled
        if (value && index === otp.length - 1) {
            const completeOtp = [...newOtp]
            if (completeOtp.every((digit) => digit !== '')) {
                setTimeout(() => handleContinue(), 100) // Small delay for better UX
            }
        }
    }

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp]
                newOtp[index] = ''
                setOtp(newOtp)
            } else if (index > 0) {
                const newOtp = [...otp]
                newOtp[index - 1] = ''
                setOtp(newOtp)
                inputRefs.current[index - 1]?.focus()
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        } else if (e.key === 'ArrowRight' && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)

        if (!/^\d+$/.test(pastedData)) return

        const newOtp = [...otp]
        for (let i = 0; i < pastedData.length && i < 6; i++) {
            newOtp[i] = pastedData[i]
        }
        setOtp(newOtp)

        const nextIndex = Math.min(pastedData.length, 5)
        inputRefs.current[nextIndex]?.focus()

        // Auto-submit if pasted data fills all 6 digits
        if (pastedData.length === 6) {
            setTimeout(() => handleContinue(), 100) // Small delay for better UX
        }
    }

    const isComplete = otp.every((digit) => digit !== '')

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="p-8 w-full max-w-md">
                <div className="text-center mb-3">
                    <h1 className="text-[30px] font-[600] text-[#202430] mb-5">
                        Enter OTP
                    </h1>
                    <p className="font-[600] text-gray-600">
                        Enter the OTP sent to your email address
                    </p>
                </div>

                <div className="mb-8">
                    <div className="flex justify-center space-x-3 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el: any) =>
                                    (inputRefs.current[index] = el)
                                }
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                disabled={isLoading}
                                className={`w-12 h-12 text-center text-lg font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                                    isLoading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={!isComplete || isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                            isComplete && !isLoading
                                ? 'bg-teal-600 hover:bg-teal-700 text-white'
                                : 'bg-teal-600 hover:bg-teal-700 text-white cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Verifying...
                            </>
                        ) : (
                            'Continue'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OTPEntry
