import { useCallback } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Select from '@/components/ui/Select'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import get from 'lodash/get'
import { countryList } from '@/constants/countries.constant'
import * as Yup from 'yup'
import type { Address } from '../store'
import type { FieldProps, FormikTouched, FormikErrors } from 'formik'

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
    country: Yup.string(), // removed .required
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    city: Yup.string(),
    state: Yup.string(), // removed .required
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

    const getError = useCallback(
        (name: string) => {
            return get(errors, name)
        },
        [errors],
    )

    const getTouched = useCallback(
        (name: string) => {
            return get(touched, name)
        },
        [touched],
    )

    return (
        <>
        <div className="md:grid grid-cols-2 gap-4">
            <FormItem
                label="Postcode"
                invalid={getError(zipCodeName) && getTouched(zipCodeName)}
                errorMessage={getError(zipCodeName)}
            >
                <div className="flex gap-2">
                    <Field
                        type="text"
                        autoComplete="off"
                        name={zipCodeName}
                        placeholder="Find a Postcode"
                        component={Input}
                    />
                    <Button
                        type="button"
                        className="shrink-0"
                        onClick={() => {
                            // Add your postcode lookup logic here
                            alert('Find a Postcode feature coming soon!')
                        }}
                    >
                        Find address
                    </Button>
                </div>
            </FormItem>
        </div>
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
    const onNext = (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        onNextChange?.(values, 'addressInformation', setSubmitting)
    }

    const onBack = () => {
        onBackChange?.()
    }

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Address Information</h3>
                <p>
                    Enter your address information help us to speed up the
                    verication process.
                </p>
            </div>
            <Formik
                enableReinitialize
                initialValues={data}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true)
                    setTimeout(() => {
                        onNext(values, setSubmitting)
                    }, 1000)
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
                                {/* <FormItem>
                                    <Field name="sameCorrespondenceAddress">
                                        {({ field, form }: FieldProps) => (
                                            <Checkbox
                                                checked={
                                                    values.sameCorrespondenceAddress
                                                }
                                                onChange={(val) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        val,
                                                    )
                                                }
                                            >
                                                Correspondence address is same
                                                as above
                                            </Checkbox>
                                        )}
                                    </Field>
                                </FormItem> */}
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
