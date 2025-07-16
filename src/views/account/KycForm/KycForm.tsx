import { useEffect, useMemo, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '@/components/shared/Container'
import AdaptableCard from '@/components/shared/AdaptableCard'
import FormStep from './components/FormStep'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import reducer, {
    getForm,
    setStepStatus,
    setFormData,
    setCurrentStep,
    useAppDispatch,
    useAppSelector,
    PersonalInformation as PersonalInformationType,
    Identification as IdentificationType,
    Address,
    FinancialInformation as FinancialInformationType,
} from './store'
import { injectReducer } from '@/store'

injectReducer('accountDetailForm', reducer)

const PersonalInformation = lazy(
    () => import('./components/PersonalInformation'),
)
const AddressInfomation = lazy(() => import('./components/AddressInfomation'))
const Identification = lazy(() => import('./components/Identification'))
const FinancialInformation = lazy(
    () => import('./components/FinancialInformation'),
)

const DetailForm = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const stepStatus = useAppSelector(
        (state) => state.accountDetailForm.data.stepStatus,
    )
    const currentStep = useAppSelector(
        (state) => state.accountDetailForm.data.currentStep,
    )
    const formData = useAppSelector(
        (state) => state.accountDetailForm.data.formData,
    )

    // ✅ Get user type from localStorage
    const userDetails = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('userdetails') || '{}')
        } catch (error) {
            return {}
        }
    }, [])

    const isBusiness = userDetails?.data?.signedUpAs === 'business'

    // ✅ Save state to localStorage whenever it changes
    useEffect(() => {
        const kycState = {
            currentStep,
            stepStatus,
            formData,
            isBusiness,
            timestamp: Date.now(),
        }
        localStorage.setItem('kycFormProgress', JSON.stringify(kycState))
    }, [currentStep, stepStatus, formData, isBusiness])

    // ✅ Restore state on component mount
    useEffect(() => {
        const savedState = localStorage.getItem('kycFormProgress')
        if (savedState) {
            try {
                const {
                    currentStep: savedStep,
                    stepStatus: savedStatus,
                    formData: savedFormData,
                    timestamp,
                } = JSON.parse(savedState)

                // Check if data is not too old (24 hours)
                const ONE_DAY = 24 * 60 * 60 * 1000
                if (Date.now() - timestamp < ONE_DAY) {
                    dispatch(setCurrentStep(savedStep))
                    dispatch(setStepStatus(savedStatus))
                    dispatch(setFormData(savedFormData))
                }
            } catch (error) {
                console.error('Error restoring KYC state:', error)
            }
        }

        dispatch(getForm())
    }, [dispatch])

    // ✅ Check if all KYC steps are completed based on user type
    const isKycCompleted = useMemo(() => {
        if (isBusiness) {
            // For business users: only steps 0 and 1 need to be completed
            return (
                stepStatus[0]?.status === 'complete' &&
                stepStatus[1]?.status === 'complete'
            )
        } else {
            // For non-business users: all steps 0, 1, 2, and 3 need to be completed
            return (
                stepStatus[0]?.status === 'complete' &&
                stepStatus[1]?.status === 'complete' &&
                stepStatus[2]?.status === 'complete' &&
                stepStatus[3]?.status === 'complete'
            )
        }
    }, [stepStatus, isBusiness])

    // ✅ Auto-redirect to AccountReview page if KYC is completed
    useEffect(() => {
        if (isKycCompleted) {
            navigate(`${APP_PREFIX_PATH}/account/account-review`)
        }
    }, [isKycCompleted, navigate])

    const handleNextChange = (
        values:
            | PersonalInformationType
            | Address
            | IdentificationType
            | FinancialInformationType,
        name: string,
    ) => {
        const nextStep = currentStep + 1
        dispatch(setFormData({ [name]: values }))

        // ✅ Adjust logic based on user type
        if (isBusiness) {
            // For business users: step 0 -> step 1 -> navigate to review page
            if (currentStep === 1) {
                dispatch(
                    setStepStatus({
                        [currentStep]: { status: 'complete' },
                    }),
                )
                navigate(`${APP_PREFIX_PATH}/account/account-review`)
            } else {
                dispatch(
                    setStepStatus({
                        [currentStep]: { status: 'complete' },
                        [nextStep]: { status: 'current' },
                    }),
                )
                dispatch(setCurrentStep(nextStep))
            }
        } else {
            // For non-business users: original logic
            if (currentStep === 3) {
                dispatch(
                    setStepStatus({
                        [currentStep]: { status: 'complete' },
                    }),
                )
                navigate(`${APP_PREFIX_PATH}/account/account-review`)
            } else {
                dispatch(
                    setStepStatus({
                        [currentStep]: { status: 'complete' },
                        [nextStep]: { status: 'current' },
                    }),
                )
                dispatch(setCurrentStep(nextStep))
            }
        }
    }

    const handleBackChange = () => {
        const previousStep = currentStep - 1
        dispatch(setCurrentStep(previousStep))
    }

    const currentStepStatus = useMemo(
        () => stepStatus[currentStep]?.status || 'pending',
        [stepStatus, currentStep],
    )

    return (
        <Container className="h-full">
            <AdaptableCard className="h-full" bodyClass="h-full">
                <div className="grid lg:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-5 gap-4 h-full">
                    <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-2">
                        <FormStep
                            currentStep={currentStep}
                            currentStepStatus={currentStepStatus}
                            stepStatus={stepStatus}
                            isBusiness={isBusiness}
                        />
                    </div>
                    <div className="2xl:col-span-4 lg:col-span-3 xl:col-span-2">
                        <Suspense fallback={<></>}>
                            {currentStep === 0 && (
                                <PersonalInformation
                                    data={formData.personalInformation}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                />
                            )}
                            {currentStep === 1 && (
                                <AddressInfomation
                                    data={formData.addressInformation}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                    onBackChange={handleBackChange}
                                />
                            )}
                            {/* Only show Identification and FinancialInformation for non-business users */}
                            {!isBusiness && currentStep === 2 && (
                                <Identification
                                    data={formData.identification}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                    onBackChange={handleBackChange}
                                />
                            )}
                            {!isBusiness && currentStep === 3 && (
                                <FinancialInformation
                                    data={formData.financialInformation}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                    onBackChange={handleBackChange}
                                />
                            )}
                        </Suspense>
                    </div>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default DetailForm
