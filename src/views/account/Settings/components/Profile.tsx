import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import { components } from 'react-select'
import {
    HiOutlineUserCircle,
    HiOutlineMail,
    HiOutlineBriefcase,
    HiOutlineUser,
    HiCheck,
    HiOutlineGlobeAlt,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineClipboard,
} from 'react-icons/hi'
import * as Yup from 'yup'
import type { OptionProps, ControlProps } from 'react-select'
import type { FormikProps, FieldInputProps, FieldProps } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../store/SettingsSlice'
import { RootState } from '@/store'
import { useEffect } from 'react'
// Add categories imports
import {
    fetchCategories,
    selectCategories,
    selectCategoriesLoading,
    selectCategoriesError,
} from '../../../sales/ProductForm/store/categorySlice'
import { useAppDispatch, useAppSelector } from '@/store'

export type ProfileFormModel = {
    name: string
    address: string
    email: string
    phone: string
    avatar: string
    timeZone: string
    lang: string
    syncData: boolean
    gmcNumber?: number
    specialty?: string
}

type ProfileProps = {
    data?: ProfileFormModel
}

type LanguageOption = {
    value: string
    label: string
    imgPath: string
}

const { Control } = components

const validationSchema = Yup.object().shape({
    name: Yup.string().required('User Name Required'),
    email: Yup.string().email('Invalid email').required('Email Required'),
    title: Yup.string(),
    avatar: Yup.string(),
    lang: Yup.string(),
    timeZone: Yup.string(),
    syncData: Yup.bool(),
    specialty: Yup.string(),
})

const langOptions: LanguageOption[] = [
    { value: 'en', label: 'English (US)', imgPath: '/img/countries/us.png' },
    { value: 'ch', label: '中文', imgPath: '/img/countries/cn.png' },
    { value: 'jp', label: '日本语', imgPath: '/img/countries/jp.png' },
    { value: 'fr', label: 'French', imgPath: '/img/countries/fr.png' },
]

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<LanguageOption>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <Avatar shape="circle" size={20} src={data.imgPath} />
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const Profile = ({ data }: ProfileProps) => {
    const dispatch = useAppDispatch()
    const { updateUserLoading, updateUserSuccess, updateUserError } =
        useSelector((state: RootState) => state.settings)

    // Add category selectors
    const categories = useAppSelector(selectCategories)
    const categoriesLoading = useAppSelector(selectCategoriesLoading)
    const categoriesError = useAppSelector(selectCategoriesError)

    const userDetails = JSON.parse(localStorage.getItem('userdetails') || '{}')
    const signedUpAs = userDetails?.data?.signedUpAs

    // Fetch categories on component mount
    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    // Transform categories data for Select component
    const specialtyOptions = categories.map((category) => ({
        label: category.name, // Display name
        value: category._id, // Category ID
    }))

    // Default data with localStorage values
    const defaultData: ProfileFormModel = {
        name: userDetails?.data?.name || '',
        email: userDetails?.data?.email || '',
        phone: userDetails?.data?.phone || '',
        address: userDetails?.data?.address || '',
        avatar: userDetails?.data?.profile_image || '',
        gmcNumber: userDetails?.data?.gmcNumber || '',
        timeZone: '',
        lang: '',
        syncData: false,
        specialty:
            userDetails?.data?.specialty || userDetails?.data?.category || '',
    }

    const initialData = {
        ...defaultData,
        ...data,
    }

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

    const onSetFormFile = (
        form: FormikProps<ProfileFormModel>,
        field: FieldInputProps<ProfileFormModel>,
        file: File[],
    ) => {
        form.setFieldValue(field.name, URL.createObjectURL(file[0]))
    }

    const onFormSubmit = (
        values: ProfileFormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        console.log('values', values)

        const userDetails = JSON.parse(
            localStorage.getItem('userdetails') || '{}',
        )
        const signedUpAs = userDetails?.data?.signedUpAs

        let updatePayload: any

        if (signedUpAs === 'doctor') {
            updatePayload = {
                name: values.name,
                phone: values.phone,
                gmcNumber: values.gmcNumber?.toString() || '',
                location: {
                    address1: values.address,
                },
                category: values.specialty || '', // ✅ Category for doctors
            }
        } else if (signedUpAs === 'business') {
            updatePayload = {
                businessName: values.name,
                phone: values.phone,
                location: {
                    address1: values.address,
                },
                category: values.specialty || '', // ✅ Category for business
            }
        } else {
            // admin or other cases
            updatePayload = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                location: {
                    address1: values.address,
                },
                category: values.specialty || '', // ✅ Category for admin/others
            }
        }

        // Dispatch the Redux action
        dispatch(updateUserProfile(updatePayload))
        setSubmitting(false)
    }

    return (
        <Formik
            enableReinitialize
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                setTimeout(() => {
                    onFormSubmit(values, setSubmitting)
                }, 1000)
            }}
        >
            {({ values, touched, errors, isSubmitting, resetForm }) => {
                // Handle success and error notifications with status check
                useEffect(() => {
                    if (
                        updateUserSuccess &&
                        updateUserSuccess.status === true
                    ) {
                        toast.push(
                            <Notification
                                title={'Profile updated successfully'}
                                type="success"
                            />,
                            {
                                placement: 'top-center',
                            },
                        )
                        // Clear/reset the form fields
                        resetForm()
                    }
                    if (updateUserError) {
                        toast.push(
                            <Notification
                                title={updateUserError}
                                type="danger"
                            />,
                            {
                                placement: 'top-center',
                            },
                        )
                    }
                }, [updateUserSuccess, updateUserError, resetForm])

                const validatorProps = { touched, errors }
                return (
                    <Form>
                        <FormContainer>
                            <FormDesription
                                title="General"
                                desc="Basic info, like your name and address that will displayed in public"
                            />
                            <FormRow
                                name="avatar"
                                label="Profile Picture"
                                {...validatorProps}
                                border={false}
                            >
                                <Field name="avatar">
                                    {({ field, form }: FieldProps) => {
                                        const avatarProps = field.value
                                            ? { src: field.value }
                                            : {}
                                        return (
                                            <Upload
                                                className="cursor-pointer"
                                                showList={false}
                                                uploadLimit={1}
                                                onChange={(files) =>
                                                    onSetFormFile(
                                                        form,
                                                        field,
                                                        files,
                                                    )
                                                }
                                                onFileRemove={(files) =>
                                                    onSetFormFile(
                                                        form,
                                                        field,
                                                        files,
                                                    )
                                                }
                                            >
                                                <Avatar
                                                    className="border-2 border-white dark:border-gray-800 shadow-lg"
                                                    size={60}
                                                    shape="circle"
                                                    icon={<HiOutlineUser />}
                                                    {...avatarProps}
                                                />
                                            </Upload>
                                        )
                                    }}
                                </Field>
                            </FormRow>
                            <FormRow
                                name="name"
                                label="Name"
                                {...validatorProps}
                                border={false}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="name"
                                    placeholder="Name"
                                    component={Input}
                                    prefix={
                                        <HiOutlineUserCircle className="text-xl" />
                                    }
                                />
                            </FormRow>

                            {signedUpAs !== 'business' && (
                                <FormRow
                                    name="email"
                                    label="Email"
                                    {...validatorProps}
                                    border={false}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Email"
                                        component={Input}
                                        prefix={
                                            <HiOutlineMail className="text-xl" />
                                        }
                                    />
                                </FormRow>
                            )}
                            <FormRow
                                name="address"
                                label="Your Postcode"
                                {...validatorProps}
                                border={false}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="address"
                                    placeholder="Address"
                                    component={Input}
                                    prefix={
                                        <HiOutlineLocationMarker className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="specialty"
                                label="Specialty"
                                touched={touched}
                                errors={errors}
                                border={false}
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
                            </FormRow>
                            <FormRow
                                name="phone"
                                label="Phone Number"
                                {...validatorProps}
                                border={false}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="phone"
                                    placeholder="Phone Number"
                                    component={Input}
                                    prefix={
                                        <HiOutlinePhone className="text-xl" />
                                    }
                                />
                            </FormRow>
                            {signedUpAs !== 'business' && (
                                <FormRow
                                    name="gmcNumber"
                                    label="GMC Number"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="gmcNumber"
                                        placeholder="GMC Number"
                                        component={Input}
                                        prefix={
                                            <HiOutlineClipboard className="text-xl" />
                                        }
                                    />
                                </FormRow>
                            )}

                            <div className="mt-4 ltr:text-right">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    type="button"
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    loading={isSubmitting || updateUserLoading}
                                    type="submit"
                                >
                                    {isSubmitting || updateUserLoading
                                        ? 'Updating'
                                        : 'Update'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default Profile
