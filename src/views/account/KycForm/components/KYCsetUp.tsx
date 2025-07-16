import React from 'react'
import { useNavigate } from 'react-router-dom'

const KYCsetUp = ({ isVisible = true }) => {
    const navigate = useNavigate()

    // Don't render if not visible
    if (!isVisible) return null

    return (
        <div className="flex items-start sm:items-center sm:justify-between gap-5 flex-col sm:flex-row bus rounded-xl px-5 py-9">
            <div className="flex items-center gap-5">
                <img
                    src="/img/others/kycsetup-icon.png" // Fixed path
                    alt="KYC Setup"
                    className="w-15 h-15"
                />
                <div>
                    <p className="text-[#0F9297] text-[16px] font-[700]">
                        Set up profile
                    </p>
                    <p className="text-[#7C8493] text-[15px]">
                        Upload your documents to start using ThanksDoc
                    </p>
                </div>
            </div>
            <div>
                <button
                    className="border-[#0F9297] border bg-white text-[#0F9297] py-1.5 px-7 rounded-lg font-[600]"
                    onClick={() => navigate('/app/account/kyc-form')}
                >
                    Set up
                </button>
            </div>
        </div>
    )
}

export default KYCsetUp
