import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, getIn, FieldInputProps, FieldProps } from 'formik'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import {
    occupationOptions,
    annualIncomeOptions,
    sourceOfWealthOptions,
    noTinReasonOption,
} from '../constants'
import { countryList } from '@/constants/countries.constant'
import * as Yup from 'yup'
import type { ComponentType } from 'react'
import type { FinancialInformation as FinancialInformationType } from '../store'
import type { InputProps } from '@/components/ui/Input'

type FormModel = FinancialInformationType

type NoTinReasonOption = {
    label: string
    value: number | string
}

type FinancialInformationProps = {
    data: FinancialInformationType
    onNextChange?: (
        values: FormModel,
        formName: string,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => void
    onBackChange?: () => void
    currentStepStatus?: string
}

const NumberInput = (props: InputProps) => {
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

const FinancialInformation = ({
    data = {
        taxResident: '',
        tin: '',
        noTin: false,
        noTinReason: '',
        occupation: '',
        annualIncome: '',
        sourceOfWealth: '',
        companyInformation: {
            companyName: '',
            contactNumber: '',
            country: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
        },
    },
    onNextChange,
    onBackChange,
    currentStepStatus,
}: FinancialInformationProps) => {
    const onNext = (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        onNextChange?.(values, 'financialInformation', setSubmitting)
    }

    const onBack = () => {
        onBackChange?.()
    }

     return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Bank Details</h3>
                <p>
                    Fill in your financial information to help us speed up the
                    verication process.
                </p>
            </div>
            <Formik
                enableReinitialize
                initialValues={data}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true)
                    setTimeout(() => {
                        onNext(values, setSubmitting)
                    }, 1000)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => {
                    return (
                        <Form>
                            <FormContainer>
                                   <div className="flex flex-col md:flex-row gap-4">
                                    <FormItem label="Sort code" asterisk={false} className="flex-1">
                                        <Field
                                            name="bankName"
                                            as={Input}
                                            placeholder="Enter your sort code"
                                        />
                                    </FormItem>
                                    <FormItem label="Account Number" asterisk={false} className="flex-1">
                                        <Field
                                            name="accountNumber"
                                            as={Input}
                                            placeholder="Enter your account number"
                                        />
                                    </FormItem>
                                </div>
                                <FormItem label="Account Name" asterisk={false}>
                                    <Field
                                        name="accountType"
                                        as={Input}
                                        placeholder="Enter your account name"
                                    />
                                </FormItem>
                                {/* --- End Bank Account Fields --- */}
                                <div className="flex justify-end gap-2">
                                    <Button type="button" onClick={onBack}>
                                        Back
                                    </Button>
                                    <Button
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {currentStepStatus === 'complete'
                                            ? 'Save'
                                            : 'Next'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default FinancialInformation
