import { useMemo } from 'react'

export const useKYCStatus = () => {
    const shouldHideKYCSetup = useMemo(() => {
        try {
            // Get user type from localStorage
            const userDetails = JSON.parse(localStorage.getItem('userdetails') || '{}')
            const isBusiness = userDetails?.data?.signedUpAs === 'business'

            // Get KYC form progress from localStorage
            const kycProgress = JSON.parse(localStorage.getItem('kycFormProgress') || '{}')
            const { stepStatus, currentStep } = kycProgress

            if (!stepStatus) return false

            // Check if KYC is completed based on user type
            if (isBusiness) {
                // For business users: steps 0 and 1 need to be completed
                // and they should be at step 2 (review) or have completed it
                const step0Complete = stepStatus[0]?.status === 'complete'
                const step1Complete = stepStatus[1]?.status === 'complete'
                const atReviewOrBeyond = currentStep >= 2

                return step0Complete && step1Complete && atReviewOrBeyond
            } else {
                // For non-business users: steps 0, 1, 2, and 3 need to be completed
                // and they should be at step 4 (review) or have completed it
                const step0Complete = stepStatus[0]?.status === 'complete'
                const step1Complete = stepStatus[1]?.status === 'complete'
                const step2Complete = stepStatus[2]?.status === 'complete'
                const step3Complete = stepStatus[3]?.status === 'complete'
                const atReviewOrBeyond = currentStep >= 4

                return step0Complete && step1Complete && step2Complete && step3Complete && atReviewOrBeyond
            }
        } catch (error) {
            console.error('Error checking KYC status:', error)
            return false
        }
    }, [])

    return { shouldHideKYCSetup }
}