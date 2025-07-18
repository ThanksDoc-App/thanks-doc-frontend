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
    HiOutlineHome,
} from 'react-icons/hi'
import * as Yup from 'yup'
import type { OptionProps, ControlProps } from 'react-select'
import type { FormikProps, FieldInputProps, FieldProps } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import {
    updateUserProfile,
    changeProfileImage,
    getUserProfile,
} from '../store/SettingsSlice'
import { RootState } from '@/store'
import { useEffect, useState } from 'react'
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
    city: string // ✅ Changed from address to city
    address1: string // ✅ Added separate address1 field
    postcode: string
    email: string
    phone: string
    avatar: string
    timeZone: string
    lang: string
    syncData: boolean
    gmcNumber?: string
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
    city: Yup.string(), // ✅ Added city validation
    address1: Yup.string(), // ✅ Added address1 validation
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

    const {
        updateUserLoading,
        updateUserSuccess,
        updateUserError,
        profileImageLoading,
        profileImageSuccess,
        profileImageError,
        profileImageData,
        // ✅ Add profile data selectors
        getProfileLoading,
        getProfileSuccess,
        getProfileError,
        profileData,
    } = useSelector((state: RootState) => state.settings)

    // Add category selectors
    const categories = useAppSelector(selectCategories)
    const categoriesLoading = useAppSelector(selectCategoriesLoading)
    const categoriesError = useAppSelector(selectCategoriesError)

    // State to store the selected image file
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(
        null,
    )

    // ✅ Fetch profile data on component mount
    useEffect(() => {
        console.log('🚀 Profile component mounted - triggering getUserProfile')
        dispatch(getUserProfile())
    }, [dispatch])

    // Fetch categories on component mount
    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    // Transform categories data for Select component
    const specialtyOptions = categories.map((category) => ({
        label: category.name, // Display name
        value: category._id, // Category ID
    }))

    // ✅ Use API data with separate city and address1 fields
    const defaultData: ProfileFormModel = {
        name: profileData?.data?.name || '',
        email: profileData?.data?.email || '',
        phone: profileData?.data?.phone || '',
        city: profileData?.data?.location?.city || '', // ✅ City field
        address1: profileData?.data?.location?.address1 || '', // ✅ Address1 field
        postcode: profileData?.data?.location?.zipCode || '',
        avatar: profileData?.data?.profileImage?.url || '',
        gmcNumber: profileData?.data?.gmcNumber || '',
        timeZone: '',
        lang: '',
        syncData: false,
        specialty: profileData?.data?.category?._id || '',
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

    // Handle profile fetch error
    useEffect(() => {
        if (getProfileError) {
            toast.push(<Notification title={getProfileError} type="danger" />, {
                placement: 'top-center',
            })
        }
    }, [getProfileError])

    // Handle profile image upload success/error
    useEffect(() => {
        if (profileImageSuccess && profileImageData) {
            toast.push(
                <Notification
                    title="Profile image updated successfully"
                    type="success"
                />,
                { placement: 'top-center' },
            )
        }
        if (profileImageError) {
            toast.push(
                <Notification title={profileImageError} type="danger" />,
                { placement: 'top-center' },
            )
        }
    }, [profileImageSuccess, profileImageError, profileImageData])

    const onSetFormFile = (
        form: FormikProps<ProfileFormModel>,
        field: FieldInputProps<ProfileFormModel>,
        file: File[],
    ) => {
        if (file.length > 0) {
            // Store the selected file for later upload
            setSelectedImageFile(file[0])

            // Update the form field with the local URL for immediate preview
            form.setFieldValue(field.name, URL.createObjectURL(file[0]))
        } else {
            // Clear the selected file if no file is selected
            setSelectedImageFile(null)
        }
    }

    // In your Profile.tsx component, update the onFormSubmit function:

    const onFormSubmit = async (
        values: ProfileFormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        console.log('Form values:', values)

        try {
            // First, upload the profile image if a new one is selected
            if (selectedImageFile) {
                const formData = new FormData()
                formData.append('image', selectedImageFile)

                // Dispatch the profile image upload action and wait for it
                await dispatch(changeProfileImage(formData)).unwrap()
            }

            // ✅ Use API data instead of localStorage
            const signedUpAs = profileData?.signedUpAs

            let updatePayload: any

            if (signedUpAs === 'doctor') {
                updatePayload = {
                    name: values.name,
                    phone: values.phone,
                    gmcNumber: values.gmcNumber?.toString() || '',
                    location: {
                        city: values.city,
                        address1: values.address1,
                        zipCode: values.postcode, // ✅ Map postcode to zipCode
                    },
                    category: values.specialty || '',
                }
            } else if (signedUpAs === 'business') {
                updatePayload = {
                    businessName: values.name,
                    phone: values.phone,
                    location: {
                        city: values.city,
                        address1: values.address1,
                        zipCode: values.postcode, // ✅ Map postcode to zipCode
                    },
                    category: values.specialty || '',
                }
            } else {
                // admin or other cases
                updatePayload = {
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    location: {
                        city: values.city,
                        address1: values.address1,
                        zipCode: values.postcode, // ✅ Map postcode to zipCode
                    },
                    category: values.specialty || '',
                }
            }

            // Dispatch the Redux action for profile update
            await dispatch(updateUserProfile(updatePayload)).unwrap()

            // Clear the selected image file after successful submission
            setSelectedImageFile(null)

            // ✅ Refresh profile data after successful update
            dispatch(getUserProfile())
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.push(
                <Notification title="Failed to update profile" type="danger" />,
                { placement: 'top-center' },
            )
        } finally {
            setSubmitting(false)
        }
    }

    // ✅ Show loading state while fetching profile
    if (getProfileLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading profile...</span>
            </div>
        )
    }

    // ✅ Show error state if profile fetch failed
    if (getProfileError && !profileData) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Failed to load profile</p>
                    <Button onClick={() => dispatch(getUserProfile())}>
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <Formik
            enableReinitialize
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                onFormSubmit(values, setSubmitting)
            }}
        >
            {({
                values,
                touched,
                errors,
                isSubmitting,
                resetForm,
                setFieldValue,
            }) => {
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
                }, [updateUserSuccess, updateUserError])

                // Update avatar field when profile image upload is successful
                useEffect(() => {
                    if (profileImageSuccess && profileImageData?.url) {
                        setFieldValue('avatar', profileImageData.url)
                    }
                }, [profileImageSuccess, profileImageData, setFieldValue])

                const validatorProps = { touched, errors }
                const isLoading =
                    isSubmitting || updateUserLoading || profileImageLoading

                // ✅ Get signedUpAs from API data
                const signedUpAs = profileData?.data?.signedUpAs

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
                                            <div className="relative">
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
                                                    disabled={isLoading}
                                                >
                                                    <Avatar
                                                        className="border-2 border-white dark:border-gray-800 shadow-lg"
                                                        size={60}
                                                        shape="circle"
                                                        icon={<HiOutlineUser />}
                                                        {...avatarProps}
                                                    />
                                                </Upload>
                                                {profileImageLoading && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                    </div>
                                                )}
                                            </div>
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

                            {/* ✅ City Field */}
                            {signedUpAs !== 'super admin' && (
                                <FormRow
                                    name="city"
                                    label="City"
                                    {...validatorProps}
                                    border={false}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="city"
                                        placeholder="City"
                                        component={Input}
                                        prefix={
                                            <HiOutlineLocationMarker className="text-xl" />
                                        }
                                    />
                                </FormRow>
                            )}

                            {/* ✅ Address1 Field */}
                            {signedUpAs !== 'super admin' && (
                                <FormRow
                                    name="address1"
                                    label="Address"
                                    {...validatorProps}
                                    border={false}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="address1"
                                        placeholder="Street Address"
                                        component={Input}
                                        prefix={
                                            <HiOutlineHome className="text-xl" />
                                        }
                                    />
                                </FormRow>
                            )}

                            {signedUpAs !== 'super admin' && (
                                <FormRow
                                    name="postcode"
                                    label="Postcode"
                                    {...validatorProps}
                                    border={false}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="postcode"
                                        placeholder="Postcode"
                                        component={Input}
                                        prefix={
                                            <HiOutlineHome className="text-xl" />
                                        }
                                    />
                                </FormRow>
                            )}

                            {signedUpAs !== 'super admin' &&
                                signedUpAs !== 'business' && (
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
                                    </FormRow>
                                )}

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
                            {signedUpAs !== 'business' &&
                                signedUpAs !== 'super admin' && (
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
                                    onClick={() => {
                                        resetForm()
                                        setSelectedImageFile(null)
                                    }}
                                    disabled={isLoading}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    loading={isLoading}
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Updating...' : 'Update'}
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
