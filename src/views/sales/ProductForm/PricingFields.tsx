import { useState, ComponentType } from 'react'
import { Field, FieldProps, FieldInputProps, useFormikContext } from 'formik'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input, { InputProps } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import {
    createJob,
    selectCreateJobLoading,
    selectCreateJobError,
} from './store/JobsSlice'
import {
    payForJob,
    clearPaymentError,
    resetPaymentState,
} from './store/paymentSlice'

type FormFieldsName = {
    stock: number
    price: number
    bulkDiscountPrice: number
    taxRate: number
    category: string
    service: string
    description: string
    location: string
    date: string
    time: string
    name: string
}

const PriceInput = (props: InputProps & { field: any }) => {
    return <Input {...props} value={props.field.value} suffix="GBP" />
}

const NumericFormatInput = ({
    onValueChange,
    ...rest
}: Omit<NumericFormatProps, 'form'> & {
    form: any
    field: FieldInputProps<unknown>
}) => {
    return (
        <NumericFormat
            customInput={Input as ComponentType}
            type="text"
            autoComplete="off"
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

const PricingFields = () => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [createdJobId, setCreatedJobId] = useState<string | null>(null)

    // Get live form state
    const { values, touched, errors, setFieldValue } =
        useFormikContext<FormFieldsName>()

    // Redux hooks with proper typing
    const dispatch = useDispatch<AppDispatch>()
    const createJobLoading = useSelector(selectCreateJobLoading)
    const createJobError = useSelector(selectCreateJobError)

    // Redux hooks for payment with proper typing
    const paymentState = useSelector((state: RootState) => state.payment)
    const {
        loading: paymentLoading = false,
        error: paymentError = null,
        lastPayment = null,
    } = paymentState || {}

    // Check if all required fields are filled
    const isFormValid = (): boolean => {
        const requiredFields: (keyof FormFieldsName)[] = [
            'category',
            'service',
            'description',
            'location',
            'date',
            'time',
            'price',
        ]
        const missingFields = requiredFields.filter((field) => !values[field])
        const priceValue = Number(values.price)

        return (
            missingFields.length === 0 && !isNaN(priceValue) && priceValue > 0
        )
    }

    const handlePayForService = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault()

        if (!isFormValid()) {
            console.warn('Form is not valid')
            return
        }

        try {
            // Create job data in the format expected by the API
            const jobData = {
                name: values.name || 'Job Service',
                service: values.service,
                category: values.category,
                description: values.description,
                location: {
                    country: 'UK',
                    city: 'London',
                    state: 'England',
                    address1: values.location,
                    address2: '',
                    zipCode: '00000',
                },
                amount: Number(values.price) || 0,
                currency: 'GBP',
                time: values.time,
                date: values.date,
            }

            console.log('Creating job with data:', jobData)

            // Dispatch the createJob action
            const resultAction = await dispatch(createJob(jobData))

            if (createJob.fulfilled.match(resultAction)) {
                console.log('Job created successfully:', resultAction.payload)
                const jobId =
                    resultAction.payload?.id || resultAction.payload?._id

                if (jobId) {
                    setCreatedJobId(jobId)
                    setIsPaymentModalOpen(true)
                } else {
                    console.error('No job ID returned from job creation')
                }
            } else {
                console.error('Failed to create job:', resultAction.payload)
            }
        } catch (error) {
            console.error('Error creating job:', error)
        }
    }

    const navigateToStripe = (url: string) => {
        console.log('Attempting to navigate to:', url)

        // Method 1: Direct assignment
        try {
            window.location.href = url
            return
        } catch (error) {
            console.error('window.location.href failed:', error)
        }

        // Method 2: Using assign
        try {
            window.location.assign(url)
            return
        } catch (error) {
            console.error('window.location.assign failed:', error)
        }

        // Method 3: Create and click a link
        try {
            const link = document.createElement('a')
            link.href = url
            link.target = '_self'
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Link click method failed:', error)
        }
    }

    const handleConfirmPayment = async () => {
        if (!createdJobId) {
            console.error('No job ID available for payment')
            return
        }

        try {
            console.log('Processing payment for job:', createdJobId)

            // Dispatch the payForJob action
            const resultAction = await dispatch(payForJob(createdJobId))

            if (payForJob.fulfilled.match(resultAction)) {
                console.log('Payment action fulfilled')
                console.log('Full response:', resultAction.payload)

                const response = resultAction.payload

                // The response structure is: response.data.data.data.url
                // Based on your console log, the structure is different
                let checkoutUrl: string | undefined

                // Try different possible paths for the URL
                if (response?.data?.data?.data?.url) {
                    checkoutUrl = response.data.data.data.url
                } else if (response?.data?.data?.url) {
                    checkoutUrl = response.data.data.url
                } else if (response?.data?.url) {
                    checkoutUrl = response.data.url
                }

                console.log('Extracted checkout URL:', checkoutUrl)
                console.log('Response structure analysis:', {
                    hasData: !!response?.data,
                    dataKeys: response?.data ? Object.keys(response.data) : [],
                    nestedData: response?.data?.data,
                    nestedDataKeys: response?.data?.data
                        ? Object.keys(response.data.data)
                        : [],
                    deepNestedData: response?.data?.data?.data,
                    deepNestedDataKeys: response?.data?.data?.data
                        ? Object.keys(response.data.data.data)
                        : [],
                })

                if (checkoutUrl && typeof checkoutUrl === 'string') {
                    // Clean up state before navigation
                    setIsPaymentModalOpen(false)
                    setCreatedJobId(null)
                    dispatch(resetPaymentState())

                    // Navigate to Stripe checkout
                    navigateToStripe(checkoutUrl)
                } else {
                    console.error('Invalid checkout URL:', {
                        url: checkoutUrl,
                        type: typeof checkoutUrl,
                        fullResponse: response,
                    })
                }
            } else {
                console.error('Payment action rejected:', resultAction.payload)
            }
        } catch (error) {
            console.error('Error in handleConfirmPayment:', error)
        }
    }

    const closeModal = () => {
        setIsPaymentModalOpen(false)
        setCreatedJobId(null)
        dispatch(clearPaymentError())
    }

    return (
        <>
            <AdaptableCard divider className="mb-4">
                <h5>Pricing and Payment</h5>
                <p className="mb-6">Proceed to make payment for this service</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <FormItem
                            invalid={(errors.price && touched.price) as boolean}
                            errorMessage={errors.price}
                        >
                            <Field name="price">
                                {({ field, form }: FieldProps) => (
                                    <NumericFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Price"
                                        customInput={
                                            PriceInput as ComponentType
                                        }
                                        value={values.price || ''}
                                        disabled={true}
                                        onValueChange={(e) => {
                                            setFieldValue(field.name, e.value)
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            variant="solid"
                            type="button"
                            className="w-full text-blue-500"
                            onClick={handlePayForService}
                            disabled={createJobLoading || !isFormValid()}
                        >
                            {createJobLoading
                                ? 'Creating Job...'
                                : 'Pay for Service'}
                        </Button>
                    </div>
                </div>
                {createJobError && (
                    <div className="mt-2 text-red-500 text-sm">
                        Error: {createJobError}
                    </div>
                )}
            </AdaptableCard>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={closeModal}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold">
                                    Pay for the service
                                </h4>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                    type="button"
                                >
                                    ✕
                                </button>
                            </div>
                            <hr className="mb-4" />

                            {/* Show payment error if any */}
                            {paymentError && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {paymentError}
                                    <button
                                        onClick={() =>
                                            dispatch(clearPaymentError())
                                        }
                                        className="ml-2 text-red-500 underline hover:no-underline"
                                        type="button"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}

                            {/* Show success message if payment initiated */}
                            {lastPayment && (
                                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                    Payment initiated successfully! Session ID:{' '}
                                    {lastPayment.data?.data?.session_id}
                                </div>
                            )}

                            <div className="flex items-center flex-col justify-center gap-4">
                                <p className="text-gray-600 text-sm font-medium text-center">
                                    Service completed, proceed to pay
                                </p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {Number(values.price || 0).toFixed(2)} GBP
                                </p>
                                <div className="w-full">
                                    <Button
                                        variant="solid"
                                        onClick={handleConfirmPayment}
                                        className="w-full"
                                        disabled={paymentLoading}
                                        type="button"
                                    >
                                        {paymentLoading
                                            ? 'Processing Payment...'
                                            : 'Continue'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PricingFields
