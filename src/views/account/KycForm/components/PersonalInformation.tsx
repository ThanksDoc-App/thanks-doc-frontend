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
import { useEffect, useMemo } from 'react'
// Add categories imports
import {
    fetchCategories,
    selectCategories,
    selectCategoriesLoading,
    selectCategoriesError,
} from '../../../sales/ProductForm/store/categorySlice'
// Add profile imports
import { getUserProfile } from '../../../account/Settings/store/SettingsSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { RootState } from '@/store'
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

    // ✅ Get profile data from Redux state
    const { profileData, getProfileLoading } = useAppSelector(
        (state: RootState) => state.settings,
    )

    // ✅ Get user type from localStorage
    const userDetails = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('userdetails') || '{}')
        } catch (error) {
            console.error('Error parsing userdetails from localStorage:', error)
            return {}
        }
    }, [])

    const signedUpAs = userDetails?.data?.signedUpAs || ''
    const isBusiness = signedUpAs === 'business'

    // ✅ Fetch profile data on component mount
    useEffect(() => {
        if (!profileData) {
            dispatch(getUserProfile())
        }
    }, [dispatch, profileData])

    // Fetch categories on component mount (only for non-business users)
    useEffect(() => {
        if (!isBusiness) {
            dispatch(fetchCategories())
        }
    }, [dispatch, isBusiness])

    // ✅ Create prefilled data from profile API response
    const prefilledData = useMemo(() => {
        if (!profileData?.data) return data

        const profile = profileData.data

        return {
            ...data,
            firstName: profile.name?.split(' ')[0] || data.firstName,
            lastName:
                profile.name?.split(' ').slice(1).join(' ') || data.lastName,
            email: profile.email || data.email,
            phoneNumber: profile.phone || data.phoneNumber,
            dob: profile.dateOfBirth
                ? dayjs(profile.dateOfBirth).format('YYYY-MM-DD')
                : isBusiness && profile.createdAt
                  ? dayjs(profile.createdAt).format('YYYY-MM-DD')
                  : data.dob,
            maritalStatus: profile.maritalStatus || data.maritalStatus,
            countryCode: profile.countryCode || data.dialCode,
            specialty: profile.category?._id || data.specialty,
        }
    }, [profileData, data, isBusiness])

    // Transform categories data for Select component
    const specialtyOptions = categories.map((category) => ({
        label: category.name, // Display name
        value: category._id, // Category ID
    }))

    // Handle categories error
    useEffect(() => {
        if (categoriesError && !isBusiness) {
            toast.push(
                <Notification
                    title="Failed to load specialties"
                    type="danger"
                />,
                { placement: 'top-center' },
            )
        }
    }, [categoriesError, isBusiness])

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Personal Information</h3>
                <p>Basic information for an account opening</p>
            </div>
            <Formik
                initialValues={prefilledData} // ✅ Use prefilled data
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true)
                    try {
                        // Transform the data to match API expectations
                        const apiData = {
                            ...values,
                            // Only include category for non-business users
                            ...(isBusiness
                                ? {}
                                : { category: values.specialty }),
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
                                {/* ✅ Only show specialty field for non-business users */}
                                {!isBusiness && (
                                    <FormItem
                                        label="Specialty"
                                        invalid={
                                            errors.specialty &&
                                            touched.specialty
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
                                                    isLoading={
                                                        categoriesLoading
                                                    }
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
                                )}

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
                                        label={
                                            isBusiness
                                                ? 'Business registration date'
                                                : 'Date of Birth'
                                        } // ✅ Dynamic label based on user type
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
                                                    placeholder={
                                                        isBusiness
                                                            ? 'Select date of creation'
                                                            : 'Select date of birth'
                                                    }
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
                                        loading={
                                            isSubmitting || getProfileLoading
                                        }
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
