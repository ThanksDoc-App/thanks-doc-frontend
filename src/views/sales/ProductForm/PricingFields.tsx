import { useState, ComponentType } from 'react'
import { Field, FieldProps, FieldInputProps, useFormikContext } from 'formik'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input, { InputProps } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import {
    createJob,
    selectCreateJobLoading,
    selectCreateJobError,
} from './store/JobsSlice'

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

const PriceInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} suffix="GBP" />
}

const NumericFormatInput = ({
    onValueChange,
    ...rest
}: Omit<NumericFormatProps, 'form'> & {
    /* eslint-disable @typescript-eslint/no-explicit-any */
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

    // Get live form state
    const { values, touched, errors, setFieldValue } =
        useFormikContext<FormFieldsName>()

    // Redux hooks
    const dispatch = useDispatch()
    const createJobLoading = useSelector(selectCreateJobLoading)
    const createJobError = useSelector(selectCreateJobError)

    // Check if all required fields are filled
    const isFormValid = () => {
        const requiredFields = [
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

    const handlePayForService = async (e: React.MouseEvent) => {
        e.preventDefault()

        if (!isFormValid()) {
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
                setIsPaymentModalOpen(true)
            } else {
                console.error('Failed to create job:', resultAction.payload)
            }
        } catch (error) {
            console.error('Error creating job:', error)
        }
    }

    const handleConfirmPayment = () => {
        console.log('Processing payment for:', values.price)
        setIsPaymentModalOpen(false)
        // Add payment processing logic here
    }

    const closeModal = () => {
        setIsPaymentModalOpen(false)
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

            {/* Custom Payment Modal - Keeping your original styling */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center ">
                    {/* Backdrop - keeping original background */}
                    <div
                        className="fixed inset-0 bg-[#2155A329] bg-opacity-50"
                        onClick={closeModal}
                    />

                    {/* Modal Content - keeping your original dimensions */}
                    <div className="relative bg-white rounded-lg shadow-xl">
                        <div className="p-6">
                            <h4 className="text-lg font-semibold mb-2">
                                Pay for the service
                            </h4>
                            <hr className="mb-4" />
                            <div className="flex items-center flex-col justify-center gap-4">
                                <p className="text-[#515B6F] text-[15px] font-[600]">
                                    Service completed, proceed to pay
                                </p>
                                <p className="text-2xl font-bold text-[#202430] text-[30px]">
                                    {Number(values.price || 0).toFixed(2)} GBP
                                </p>
                                <div>
                                    <Button
                                        variant="solid"
                                        onClick={handleConfirmPayment}
                                        className="w-[450px] mb-3"
                                    >
                                        Continue
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
