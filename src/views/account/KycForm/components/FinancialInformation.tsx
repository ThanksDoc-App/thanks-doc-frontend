import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
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
// Add these imports for API integration
import { useAppDispatch, useAppSelector } from '@/store'
import {
    addUserAccount,
    resetAddAccountStatus,
    clearAddAccountError,
} from '@/views/account/Settings/store/SettingsSlice'
import { useEffect } from 'react'

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

const validationSchema = Yup.object().shape({
    sortCode: Yup.string()
        .required('Sort code is required')
        .matches(/^[\d-]+$/, 'Sort code must contain only digits and dashes')
        .min(6, 'Sort code must be at least 6 characters'),
    accountNumber: Yup.string()
        .required('Account number is required')
        .matches(
            /^[\d\s-]+$/,
            'Account number must contain only digits, spaces, and dashes',
        )
        .test(
            'length',
            'Account number must be between 4 and 34 digits',
            function (value) {
                if (!value) return false
                const cleanValue = value.replace(/[\s-]/g, '')
                return cleanValue.length >= 4 && cleanValue.length <= 34
            },
        ),
    accountName: Yup.string()
        .required('Account name is required')
        .min(2, 'Account name must be at least 2 characters'),
})

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
        // Add bank details fields
        sortCode: '',
        accountNumber: '',
        accountName: '',
    },
    onNextChange,
    onBackChange,
    currentStepStatus,
}: FinancialInformationProps) => {
    const dispatch = useAppDispatch()
    const { addAccountLoading, addAccountSuccess, addAccountError } =
        useAppSelector((state) => state.settings)

    const onNext = async (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        try {
            // Clean the account number by removing spaces and dashes for processing
            const cleanAccountNumber =
                values.accountNumber?.replace(/[\s-]/g, '') || ''

            // Create the payload structure for bank details using the same format as Billing component
            const bankDetailsPayload = {
                accountName: values.accountName,
                sortCode: values.sortCode,
                accountNumber: cleanAccountNumber,
            }

            console.log('Bank details payload being sent:', bankDetailsPayload)

            // Call the addUserAccount action (same as Billing component)
            await dispatch(addUserAccount(bankDetailsPayload)).unwrap()

            // Show success notification
            toast.push(
                <Notification
                    title="Bank account added successfully"
                    type="success"
                />,
                { placement: 'top-center' },
            )

            // Call the next change handler
            onNextChange?.(values, 'financialInformation', setSubmitting)
        } catch (error) {
            // Show error notification
            toast.push(
                <Notification
                    title="Failed to add bank account"
                    type="danger"
                />,
                { placement: 'top-center' },
            )
            console.error('Failed to add account:', error)
            setSubmitting(false)
        }
    }

    const onBack = () => {
        onBackChange?.()
    }

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            if (addAccountError) {
                dispatch(clearAddAccountError())
            }
        }
    }, [addAccountError, dispatch])

    // Handle success state
    useEffect(() => {
        if (addAccountSuccess) {
            // Reset the success state after showing notification
            setTimeout(() => {
                dispatch(resetAddAccountStatus())
            }, 3000)
        }
    }, [addAccountSuccess, dispatch])

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Bank Details</h3>
                <p>
                    Fill in your financial information to help us speed up the
                    verification process.
                </p>
            </div>
            <Formik
                enableReinitialize
                initialValues={data}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true)
                    console.log('Form submitted with values:', values)

                    try {
                        await onNext(values, setSubmitting)
                    } catch (error) {
                        console.error('Submit error:', error)
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting }) => {
                    return (
                        <Form>
                            <FormContainer>
                                {/* Error Display */}
                                {addAccountError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-red-600 text-sm">
                                                {addAccountError}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    dispatch(
                                                        clearAddAccountError(),
                                                    )
                                                }
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <FormItem
                                    label="Account Name"
                                    invalid={
                                        errors.accountName &&
                                        touched.accountName
                                    }
                                    errorMessage={errors.accountName}
                                >
                                    <Field
                                        name="accountName"
                                        as={Input}
                                        placeholder="Enter your account name"
                                        disabled={addAccountLoading}
                                    />
                                </FormItem>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <FormItem
                                        label="Sort Code"
                                        invalid={
                                            errors.sortCode && touched.sortCode
                                        }
                                        errorMessage={errors.sortCode}
                                        className="flex-1"
                                    >
                                        <Field
                                            name="sortCode"
                                            as={Input}
                                            placeholder="12-34-56"
                                            disabled={addAccountLoading}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Account Number"
                                        invalid={
                                            errors.accountNumber &&
                                            touched.accountNumber
                                        }
                                        errorMessage={errors.accountNumber}
                                        className="flex-1"
                                    >
                                        <Field
                                            name="accountNumber"
                                            as={Input}
                                            placeholder="Enter your account number"
                                            disabled={addAccountLoading}
                                        />
                                    </FormItem>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" onClick={onBack}>
                                        Back
                                    </Button>
                                    <Button
                                        loading={addAccountLoading}
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
