import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import {
    Field,
    FormikErrors,
    FormikTouched,
    FieldProps,
    FieldInputProps,
} from 'formik'
import Button from '@/components/ui/Button'
import type { ComponentType } from 'react'
import type { InputProps } from '@/components/ui/Input'

type FormFieldsName = {
    stock: number
    price: number
    bulkDiscountPrice: number
    taxRate: number
}

type PricingFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const PriceInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} prefix="$" />
}

const NumberInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} />
}

const TaxRateInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} />
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

const PricingFields = (props: PricingFieldsProps) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Pricing and Payment</h5>
            <p className="mb-6">Proceed to make payment for this service</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        // label="SKU"
                        invalid={(errors.stock && touched.stock) as boolean}
                        errorMessage={errors.stock}
                    >
                        <Field name="stock">
                            {({ field, form }: FieldProps) => {
                                return (
                                    <NumericFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Stock"
                                        customInput={
                                            NumberInput as ComponentType
                                        }
                                        onValueChange={(e) => {
                                            form.setFieldValue(
                                                field.name,
                                                e.value,
                                            )
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
                <div className="flex justify-end ">
                    <Button
                        color="primary"
                        type="submit"
                        className="w-full text-blue-500"
                    >
                        Pay for Service
                    </Button>
                </div>
                {/* <div className="col-span-1">
                    <FormItem
                        label="Price"
                        invalid={(errors.price && touched.price) as boolean}
                        errorMessage={errors.price}
                    >
                        <Field name="price">
                            {({ field, form }: FieldProps) => {
                                return (
                                    <NumericFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Price"
                                        customInput={
                                            PriceInput as ComponentType
                                        }
                                        onValueChange={(e) => {
                                            form.setFieldValue(
                                                field.name,
                                                e.value,
                                            )
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div> */}
            </div>
        </AdaptableCard>
    )
}

export default PricingFields
