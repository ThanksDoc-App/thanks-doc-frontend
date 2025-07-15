// hooks/useKYCStatus.js
import { useAppSelector } from '@/store'

export const useKYCStatus = () => {
    const stepStatus = useAppSelector(
        (state) => state.accountDetailForm?.stepStatus || {}
    )
    const currentStep = useAppSelector(
        (state) => state.accountDetailForm?.currentStep || 0
    )

    // Check if user has started KYC (any step beyond 0 or step 0 is complete)
    const hasStartedKYC = currentStep > 0 || stepStatus[0]?.status === 'complete'

    // Check if all KYC steps are completed
    const isKYCCompleted = 
        stepStatus[0]?.status === 'complete' &&
        stepStatus[1]?.status === 'complete' &&
        stepStatus[2]?.status === 'complete' &&
        stepStatus[3]?.status === 'complete'

    // Check if user is currently in review stage
    const isInReviewStage = currentStep === 4

    return {
        hasStartedKYC,
        isKYCCompleted,
        isInReviewStage,
        shouldHideKYCSetup: hasStartedKYC || isKYCCompleted || isInReviewStage
    }
}
