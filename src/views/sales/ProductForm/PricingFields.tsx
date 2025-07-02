import { useState, ComponentType } from 'react'
import { Field, FieldProps, FieldInputProps, useFormikContext } from 'formik'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input, { InputProps } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

type FormFieldsName = {
    stock: number
    price: number
    bulkDiscountPrice: number
    taxRate: number
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

    const handlePayForService = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsPaymentModalOpen(true)
    }

    const handleConfirmPayment = () => {
        console.log('Processing payment for:', values.price)
        setIsPaymentModalOpen(false)
        // Add payment processing logic here
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
                        >
                            Pay for Service
                        </Button>
                    </div>
                </div>
            </AdaptableCard>

            {/* Payment Modal */}
            <Dialog
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onRequestClose={() => setIsPaymentModalOpen(false)}
            >
                <div className="">
                    <h4 className="text-lg font-semibold mb-2">
                        Pay for the service{' '}
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
            </Dialog>
        </>
    )
}

export default PricingFields
