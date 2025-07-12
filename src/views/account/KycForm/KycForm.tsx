import { useEffect, useMemo, lazy, Suspense } from 'react'
import Container from '@/components/shared/Container'
import AdaptableCard from '@/components/shared/AdaptableCard'
import FormStep from './components/FormStep'
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
const AccountReview = lazy(() => import('./components/AccountReview'))

const DetailForm = () => {
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

    // ✅ Check if all KYC steps are completed
    const isKycCompleted = useMemo(() => {
        // Check if steps 0, 1, 2, and 3 are all completed
        return (
            stepStatus[0]?.status === 'complete' &&
            stepStatus[1]?.status === 'complete' &&
            stepStatus[2]?.status === 'complete' &&
            stepStatus[3]?.status === 'complete'
        )
    }, [stepStatus])

    useEffect(() => {
        dispatch(getForm())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ✅ Auto-redirect to AccountReview if KYC is completed
    useEffect(() => {
        if (isKycCompleted && currentStep < 4) {
            dispatch(setCurrentStep(4))
            dispatch(
                setStepStatus({
                    [4]: { status: 'current' },
                }),
            )
        }
    }, [isKycCompleted, currentStep, dispatch])

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

        // ✅ If this is the last step (step 3), mark it as complete and go to review
        if (currentStep === 3) {
            dispatch(
                setStepStatus({
                    [currentStep]: { status: 'complete' },
                    [4]: { status: 'current' },
                }),
            )
            dispatch(setCurrentStep(4))
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
                    {currentStep !== 4 && (
                        <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-2">
                            <FormStep
                                currentStep={currentStep}
                                currentStepStatus={currentStepStatus}
                                stepStatus={stepStatus}
                            />
                        </div>
                    )}
                    <div
                        className={
                            currentStep !== 4
                                ? '2xl:col-span-4 lg:col-span-3 xl:col-span-2'
                                : 'lg:col-span-5'
                        }
                    >
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
                            {currentStep === 2 && (
                                <Identification
                                    data={formData.identification}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                    onBackChange={handleBackChange}
                                />
                            )}
                            {currentStep === 3 && (
                                <FinancialInformation
                                    data={formData.financialInformation}
                                    currentStepStatus={currentStepStatus}
                                    onNextChange={handleNextChange}
                                    onBackChange={handleBackChange}
                                />
                            )}
                            {currentStep === 4 && <AccountReview />}
                        </Suspense>
                    </div>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default DetailForm
