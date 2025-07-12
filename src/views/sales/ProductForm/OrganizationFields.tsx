// OrganizationFields.tsx
import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import CreatableSelect from 'react-select/creatable'
import DatePicker from '@/components/ui/DatePicker'
import InputGroup from '@/components/ui/InputGroup'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchCategories,
    selectCategories,
    selectCategoriesLoading,
    selectCategoriesError,
} from './store/categorySlice'
import {
    fetchServices,
    selectServices,
    selectServicesLoading,
    selectServicesError,
} from './store/servicesSlice'
import {
    createJob,
    selectCreateJobLoading,
    selectCreateJobError,
} from './store/JobsSlice'

type Options = {
    label: string
    value: string
}[]

const options2 = [
    { value: '12.00 AM', label: '12.00 AM' },
    { value: '1.00 AM ', label: '1.00 AM' },
    { value: '2.00 AM ', label: '2.00 AM' },
    { value: '3.00 AM ', label: '3.00 AM' },
    { value: '4.00 AM ', label: '4.00 AM' },
    { value: '5.00 AM ', label: '5.00 AM' },
    { value: '6.00 AM ', label: '6.00 AM' },
    { value: '7.00 AM ', label: '7.00 AM' },
    { value: '8.00 AM ', label: '8.00 AM' },
    { value: '9.00 AM ', label: '9.00 AM' },
    { value: '10.00 AM ', label: '10.00 AM' },
    { value: '11.00 AM ', label: '11.00 AM' },
    { value: '12.00 PM ', label: '12.00 PM' },
    { value: '1.00 PM ', label: '1.00 PM' },
    { value: '2.00 PM ', label: '2.00 PM' },
    { value: '3.00 PM ', label: '3.00 PM' },
    { value: '4.00 PM ', label: '4.00 PM' },
    { value: '5.00 PM ', label: '5.00 PM' },
    { value: '6.00 PM ', label: '6.00 PM' },
    { value: '7.00 PM ', label: '7.00 PM' },
    { value: '8.00 PM ', label: '8.00 PM' },
    { value: '9.00 PM ', label: '9.00 PM' },
    { value: '10.00 PM ', label: '10.00 PM' },
    { value: '11.00 PM ', label: '11.00 PM' },
]

type FormFieldsName = {
    category: string
    service: string
    tags: Options
    vendor: string
    brand: string
    description: string
    price: number // Changed to number to match PricingFields
    location: string
    date: string
    time: string
}

type OrganizationFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: {
        category: string
        service: string
        tags: Options
        price: number // Added price to values
        [key: string]: unknown
    }
}

const OrganizationFields = (props: OrganizationFieldsProps) => {
    const {
        values = { category: '', service: '', tags: [], price: 0 },
        touched,
        errors,
    } = props

    // Redux hooks for categories
    const dispatch = useDispatch()
    const categories = useSelector(selectCategories)
    const categoriesLoading = useSelector(selectCategoriesLoading)
    const categoriesError = useSelector(selectCategoriesError)

    // Redux hooks for services
    const services = useSelector(selectServices)
    const servicesLoading = useSelector(selectServicesLoading)
    const servicesError = useSelector(selectServicesError)

    // Redux hooks for job creation
    const createJobLoading = useSelector(selectCreateJobLoading)
    const createJobError = useSelector(selectCreateJobError)

    // Transform categories data for Select component
    const categoryOptions = categories.map((category) => ({
        label: category.name,
        value: category._id,
    }))

    // Transform services data for Select component
    const serviceOptions = services.map((service) => ({
        label: service.name,
        value: service._id,
    }))

    // Get selected service details for price
    const selectedService = services.find(
        (service) => service._id === values.service,
    )

    // Fetch categories when component mounts
    useEffect(() => {
        if (categories.length === 0 && !categoriesLoading) {
            dispatch(fetchCategories())
        }
    }, [dispatch, categories.length, categoriesLoading])

    // Fetch services when component mounts
    useEffect(() => {
        if (services.length === 0 && !servicesLoading) {
            dispatch(fetchServices())
        }
    }, [dispatch, services.length, servicesLoading])

    return (
        <AdaptableCard divider isLastChild className="mb-4">
            <h5>Enter job information</h5>
            <p className="mb-6">This information will be displayed publicly</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Service Category"
                        invalid={
                            (errors.category && touched.category) as boolean
                        }
                        errorMessage={errors.category}
                    >
                        <Field name="category">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={categoryOptions}
                                    value={categoryOptions.filter(
                                        (category) =>
                                            category.value === values.category,
                                    )}
                                    onChange={(option) => {
                                        form.setFieldValue(
                                            field.name,
                                            option?.value,
                                        )
                                    }}
                                    isLoading={categoriesLoading}
                                    placeholder={
                                        categoriesLoading
                                            ? 'Loading categories...'
                                            : categoriesError
                                              ? 'Error loading categories'
                                              : 'Select a category'
                                    }
                                    isDisabled={
                                        categoriesLoading || !!categoriesError
                                    }
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Service Title"
                        invalid={(errors.service && touched.service) as boolean}
                        errorMessage={errors.service}
                    >
                        <Field name="service">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={serviceOptions}
                                    value={serviceOptions.filter(
                                        (service) =>
                                            service.value === values.service,
                                    )}
                                    onChange={(option) => {
                                        form.setFieldValue(
                                            field.name,
                                            option?.value,
                                        )
                                        // Update price when service is selected
                                        const selectedSrv = services.find(
                                            (srv) => srv._id === option?.value,
                                        )
                                        if (selectedSrv && selectedSrv.price) {
                                            form.setFieldValue(
                                                'price',
                                                selectedSrv.price,
                                            )
                                        }
                                    }}
                                    isLoading={servicesLoading}
                                    placeholder={
                                        servicesLoading
                                            ? 'Loading services...'
                                            : servicesError
                                              ? 'Error loading services'
                                              : 'Select a service'
                                    }
                                    isDisabled={
                                        servicesLoading || !!servicesError
                                    }
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
            </div>
            <div className="">
                <FormItem
                    label="Service Description"
                    invalid={Boolean(errors.description && touched.description)}
                    errorMessage={errors.description}
                >
                    <Field
                        as={Input}
                        name="description"
                        placeholder="Enter product description"
                        textArea
                        rows={4}
                    />
                </FormItem>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Price"
                        invalid={Boolean(errors.price && touched.price)}
                        errorMessage={errors.price}
                    >
                        <Field name="price">
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Price will be set automatically"
                                    suffix="GBP"
                                    disabled={true}
                                    value={
                                        selectedService?.price ||
                                        values.price ||
                                        ''
                                    }
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Address"
                        invalid={Boolean(errors.location && touched.location)}
                        errorMessage={errors.location}
                    >
                        <Field
                            type="text"
                            name="location"
                            placeholder="Search location"
                            component={Input}
                        />
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Date"
                        invalid={Boolean(errors.date && touched.date)}
                        errorMessage={errors.date}
                    >
                        <Field name="date">
                            {({ field, form }: FieldProps) => (
                                <DatePicker
                                    {...field}
                                    value={field.value}
                                    onChange={(val) =>
                                        form.setFieldValue(field.name, val)
                                    }
                                    placeholder="Select Date"
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Time"
                        invalid={Boolean(errors.time && touched.time)}
                        errorMessage={errors.time}
                    >
                        <Field name="time">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    isSearchable={false}
                                    options={options2}
                                    value={options2.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        form.setFieldValue(
                                            field.name,
                                            option?.value,
                                        )
                                    }
                                    placeholder="Select Time"
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
            </div>
        </AdaptableCard>
    )
}

export default OrganizationFields
