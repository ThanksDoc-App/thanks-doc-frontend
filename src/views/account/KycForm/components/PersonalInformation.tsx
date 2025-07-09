import Input from '@/components/ui/Input'
import InputGroup from '@/components/ui/InputGroup'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Select from '@/components/ui/Select'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { countryList } from '@/constants/countries.constant'
import { statusOptions } from '../constants'
import { components } from 'react-select'
import dayjs from 'dayjs'
import * as Yup from 'yup'
import type { OptionProps, SingleValueProps } from 'react-select'
import type { FieldInputProps, FieldProps } from 'formik'
import type { PersonalInformation as PersonalInformationType } from '../store'
import type { ComponentType } from 'react'
import type { InputProps } from '@/components/ui/Input'
import { useEffect } from 'react'
// Add categories imports
import {
    fetchCategories,
    selectCategories,
    selectCategoriesLoading,
    selectCategoriesError,
} from '../../../sales/ProductForm/store/categorySlice'
// Add KYC form imports - Remove updateForm import since we're not using it here
import { useAppDispatch, useAppSelector } from '@/store'
// Add local storage for temporary data
import { setTempPersonalInfo } from '../store/tempDataSlice' // We'll create this

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

type FormModel = PersonalInformationType

type PersonalInformationProps = {
    data: PersonalInformationType
    onNextChange?: (
        values: FormModel,
        formName: string,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => void
    currentStepStatus?: string
}

const { SingleValue } = components

const genderOptions = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Others', value: 'O' },
]

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

const PhoneSelectOption = ({
    innerProps,
    data,
    isSelected,
}: OptionProps<CountryOption>) => {
    return (
        <div
            className={`cursor-pointer flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center gap-2">
                <span>
                    ({data.value}) {data.dialCode}
                </span>
            </div>
        </div>
    )
}

const PhoneControl = (props: SingleValueProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <div className="flex items-center">
            {selected && <span>{selected.dialCode}</span>}
        </div>
    )
}

const validationSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string(),
    nationality: Yup.string(),
    phoneNumber: Yup.string(),
    dob: Yup.string(),
    gender: Yup.string(),
    maritalStatus: Yup.string(),
    dialCode: Yup.string(),
    specialty: Yup.string(),
})

const PersonalInformation = ({
    data = {
        firstName: '',
        lastName: '',
        email: '',
        residentCountry: '',
        nationality: '',
        dialCode: '',
        phoneNumber: '',
        dob: '',
        gender: '',
        maritalStatus: '',
        specialty: '',
    },
    onNextChange,
    currentStepStatus,
}: PersonalInformationProps) => {
    const dispatch = useAppDispatch()

    // Add category selectors
    const categories = useAppSelector(selectCategories)
    const categoriesLoading = useAppSelector(selectCategoriesLoading)
    const categoriesError = useAppSelector(selectCategoriesError)

    // Fetch categories on component mount
    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    // Transform categories data for Select component
    const specialtyOptions = categories.map((category) => ({
        label: category.name, // Display name
        value: category._id, // Category ID
    }))

    // Handle categories error
    useEffect(() => {
        if (categoriesError) {
            toast.push(
                <Notification
                    title="Failed to load specialties"
                    type="danger"
                />,
                { placement: 'top-center' },
            )
        }
    }, [categoriesError])

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Personal Information</h3>
                <p>Basic information for an account opening</p>
            </div>
            <Formik
                initialValues={data}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true)
                    try {
                        // Transform the data to match API expectations
                        const apiData = {
                            ...values,
                            category: values.specialty, // Map specialty to category
                            // Remove specialty field to avoid confusion
                            specialty: undefined,
                        }

                        // Store personal information in temporary state instead of calling API
                        dispatch(setTempPersonalInfo(apiData))

                        // Show success notification for saving locally
                        toast.push(
                            <Notification
                                title="Personal information saved. Continue to address information."
                                type="success"
                            />,
                            { placement: 'top-center' },
                        )

                        // Proceed to next step without API call
                        setTimeout(() => {
                            onNextChange?.(
                                values,
                                'personalInformation',
                                setSubmitting,
                            )
                        }, 1000)
                    } catch (error) {
                        toast.push(
                            <Notification
                                title="Failed to save information"
                                type="danger"
                            />,
                            { placement: 'top-center' },
                        )
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting, setSubmitting }) => {
                    return (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label="Specialty"
                                    invalid={
                                        errors.specialty && touched.specialty
                                    }
                                    errorMessage={errors.specialty}
                                >
                                    <Field name="specialty">
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                placeholder="Select specialty"
                                                field={field}
                                                form={form}
                                                options={specialtyOptions}
                                                isLoading={categoriesLoading}
                                                value={specialtyOptions.find(
                                                    (option) =>
                                                        option.value ===
                                                        values.specialty,
                                                )}
                                                onChange={(option) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value,
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <div className="md:grid grid-cols-2 gap-4">
                                    <FormItem
                                        label="Phone Number"
                                        invalid={
                                            (errors.dialCode &&
                                                touched.dialCode) ||
                                            (errors.phoneNumber &&
                                                touched.phoneNumber)
                                        }
                                        errorMessage="Please enter your phone number"
                                    >
                                        <InputGroup>
                                            <Field name="phoneNumber">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => {
                                                    return (
                                                        <NumericFormatInput
                                                            form={form}
                                                            field={field}
                                                            customInput={
                                                                NumberInput as ComponentType
                                                            }
                                                            placeholder="Phone Number"
                                                            onValueChange={(
                                                                e,
                                                            ) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    e.value,
                                                                )
                                                            }}
                                                        />
                                                    )
                                                }}
                                            </Field>
                                        </InputGroup>
                                    </FormItem>
                                    <FormItem
                                        label="Date of Birth"
                                        invalid={
                                            typeof errors.dob === 'string' &&
                                            touched.dob
                                        }
                                        errorMessage={
                                            Array.isArray(errors.dob)
                                                ? errors.dob.join(', ')
                                                : typeof errors.dob === 'string'
                                                  ? errors.dob
                                                  : undefined
                                        }
                                    >
                                        <Field name="dob" placeholder="Date">
                                            {({ field, form }: FieldProps) => (
                                                <DatePicker
                                                    field={field}
                                                    form={form}
                                                    value={field.value}
                                                    onChange={(date) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            dayjs(date).format(
                                                                'YYYY-MM-DD',
                                                            ),
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                                <div className="flex justify-end gap-2">
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

export default PersonalInformation
