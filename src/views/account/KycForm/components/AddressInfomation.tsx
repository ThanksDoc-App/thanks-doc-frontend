import { useCallback, useEffect, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Select from '@/components/ui/Select'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import get from 'lodash/get'
import { countryList } from '@/constants/countries.constant'
import * as Yup from 'yup'
import type { Address } from '../store'
import type { FieldProps, FormikTouched, FormikErrors } from 'formik'
// Add these imports for API integration
import { updateForm } from '../store/kycFormSlice'
import { useAppDispatch, useAppSelector } from '@/store'
// Import temp data selectors - now from main store
import {
    selectTempPersonalInfo,
    clearTempPersonalInfo,
} from '../store/tempDataSlice'

type FormModel = Address

type AddressInfomationProps = {
    data: Address
    onNextChange?: (
        values: FormModel,
        formName: string,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => void
    onBackChange?: () => void
    currentStepStatus?: string
}

type AddressFormProps = {
    values: FormModel
    touched: FormikTouched<FormModel>
    errors: FormikErrors<FormModel>
    countryName: string
    addressLine1Name: string
    addressLine2Name: string
    cityName: string
    stateName: string
    zipCodeName: string
}

const validationSchema = Yup.object().shape({
    country: Yup.string(),
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string(),
    sameCorrespondenceAddress: Yup.bool(),
    correspondenceAddress: Yup.object().when('sameCorrespondenceAddress', {
        is: false,
        then: (schema) =>
            schema.shape({
                country: Yup.string(),
                addressLine1: Yup.string(),
                addressLine2: Yup.string(),
                city: Yup.string(),
                state: Yup.string(),
                zipCode: Yup.string(),
            }),
        otherwise: (schema) => schema,
    }),
})

const AddressForm = (props: AddressFormProps) => {
    const {
        values,
        touched,
        errors,
        countryName,
        addressLine1Name,
        addressLine2Name,
        cityName,
        stateName,
        zipCodeName,
    } = props

    const getError = useCallback((name: string) => get(errors, name), [errors])

    const getTouched = useCallback(
        (name: string) => get(touched, name),
        [touched],
    )

    return (
        <>
            <div className="md:grid grid-cols-2 gap-4">
                <FormItem
                    label="Address Line 1"
                    invalid={
                        getError(addressLine1Name) &&
                        getTouched(addressLine1Name)
                    }
                    errorMessage={getError(addressLine1Name)}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name={addressLine1Name}
                        placeholder="Address Line 1"
                        component={Input}
                    />
                </FormItem>
                <FormItem
                    label="Address Line 2"
                    invalid={
                        getError(addressLine2Name) &&
                        getTouched(addressLine2Name)
                    }
                    errorMessage={getError(addressLine2Name)}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name={addressLine2Name}
                        placeholder="Address Line 2"
                        component={Input}
                    />
                </FormItem>
            </div>

            <div className="md:grid grid-cols-2 gap-4">
                <FormItem
                    label="City"
                    invalid={getError(cityName) && getTouched(cityName)}
                    errorMessage={getError(cityName)}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name={cityName}
                        placeholder="City"
                        component={Input}
                    />
                </FormItem>
                <FormItem
                    label="Postcode"
                    invalid={getError(zipCodeName) && getTouched(zipCodeName)}
                    errorMessage={getError(zipCodeName)}
                >
                    <Field
                        type="text"
                        autoComplete="off"
                        name={zipCodeName}
                        placeholder="Enter a Postcode"
                        component={Input}
                    />
                </FormItem>
            </div>
        </>
    )
}

const AddressInfomation = ({
    data = {
        country: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        sameCorrespondenceAddress: true,
        correspondenceAddress: {
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
}: AddressInfomationProps) => {
    const dispatch = useAppDispatch()

    // Get temporary personal information from main store
    const tempPersonalInfo = useAppSelector(selectTempPersonalInfo)

    // Check if personal information is available
    useEffect(() => {
        if (!tempPersonalInfo) {
            toast.push(
                <Notification
                    title="Please complete personal information first"
                    type="warning"
                />,
                { placement: 'top-center' },
            )
        }
    }, [tempPersonalInfo])

    const onNext = async (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        if (!tempPersonalInfo) {
            toast.push(
                <Notification
                    title="Personal information is missing. Please go back and complete it."
                    type="danger"
                />,
                { placement: 'top-center' },
            )
            setSubmitting(false)
            return
        }

        try {
            // Combine personal information and address information to match API structure
            const combinedPayload = {
                phone: tempPersonalInfo.phoneNumber,
                location: {
                    country: values.country,
                    city: values.city,
                    state: values.state,
                    address1: values.addressLine1,
                    address2: values.addressLine2,
                    zipCode: values.zipCode,
                },
                maritalStatus: tempPersonalInfo.maritalStatus,
                countryCode: tempPersonalInfo.dialCode,
                dateOfBirth: tempPersonalInfo.dob,
                category: tempPersonalInfo.category,
                isCorrespondenceAddressSame: values.sameCorrespondenceAddress,
                correspondenceAddress: values.sameCorrespondenceAddress
                    ? {
                          country: values.country,
                          city: values.city,
                          state: values.state,
                          address1: values.addressLine1,
                          address2: values.addressLine2,
                          zipCode: values.zipCode,
                      }
                    : {
                          country: values.correspondenceAddress.country,
                          city: values.correspondenceAddress.city,
                          state: values.correspondenceAddress.state,
                          address1: values.correspondenceAddress.addressLine1,
                          address2: values.correspondenceAddress.addressLine2,
                          zipCode: values.correspondenceAddress.zipCode,
                      },
            }

            console.log('Combined payload being sent:', combinedPayload)

            // Call the API endpoint with combined data
            const response = await dispatch(
                updateForm(combinedPayload),
            ).unwrap()

            // Check if status is true before proceeding
            if (response.status !== true) {
                toast.push(
                    <Notification
                        title={response.message || 'Failed to save information'}
                        type="danger"
                    />,
                    { placement: 'top-center' },
                )
                setSubmitting(false)
                return
            }

            // Clear temporary personal information after successful submission
            dispatch(clearTempPersonalInfo())

            // Show success notification
            toast.push(
                <Notification
                    title={
                        response.message ||
                        'Personal and address information saved successfully'
                    }
                    type="success"
                />,
                { placement: 'top-center' },
            )

            // Call the next change handler only if status is true
            onNextChange?.(values, 'addressInformation', setSubmitting)
        } catch (error) {
            // Show error notification
            toast.push(
                <Notification
                    title="Failed to save information"
                    type="danger"
                />,
                { placement: 'top-center' },
            )
            console.error('Failed to save combined information:', error)
            setSubmitting(false)
        }
    }

    const onBack = () => {
        onBackChange?.()
    }

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Address Information</h3>
                <p>
                    Enter your address information to help us speed up the
                    verification process.
                </p>
                {tempPersonalInfo && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-700">
                            ✓ Personal information saved. Complete address
                            information to submit both forms.
                        </p>
                    </div>
                )}
            </div>
            <Formik
                enableReinitialize
                initialValues={data}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true)
                    // Add debug logging
                    console.log('Form submitted with values:', values)
                    console.log('Temporary personal info:', tempPersonalInfo)

                    try {
                        await onNext(values, setSubmitting)
                    } catch (error) {
                        console.error('Submit error:', error)
                        setSubmitting(false)
                    }
                }}
            >
                {({ values, touched, errors, isSubmitting }) => {
                    const formProps = { values, touched, errors }

                    return (
                        <Form>
                            <FormContainer>
                                <h5 className="mb-4">Permanent Address</h5>
                                <AddressForm
                                    countryName="country"
                                    addressLine1Name="addressLine1"
                                    addressLine2Name="addressLine2"
                                    cityName="city"
                                    stateName="state"
                                    zipCodeName="zipCode"
                                    {...formProps}
                                />

                                <FormItem>
                                    <Field name="sameCorrespondenceAddress">
                                        {({ field, form }: FieldProps) => (
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                                onChange={(checked) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        checked,
                                                    )
                                                }}
                                            >
                                                Same as correspondence address
                                            </Checkbox>
                                        )}
                                    </Field>
                                </FormItem>

                                {!values.sameCorrespondenceAddress && (
                                    <>
                                        <h5 className="mb-4">
                                            Correspondence Address
                                        </h5>
                                        <AddressForm
                                            countryName="correspondenceAddress.country"
                                            addressLine1Name="correspondenceAddress.addressLine1"
                                            addressLine2Name="correspondenceAddress.addressLine2"
                                            cityName="correspondenceAddress.city"
                                            stateName="correspondenceAddress.state"
                                            zipCodeName="correspondenceAddress.zipCode"
                                            {...formProps}
                                        />
                                    </>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button type="button" onClick={onBack}>
                                        Back
                                    </Button>
                                    <Button
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                        disabled={!tempPersonalInfo}
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

export default AddressInfomation
