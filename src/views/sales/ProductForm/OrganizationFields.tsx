import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import CreatableSelect from 'react-select/creatable'
import DatePicker from '@/components/ui/DatePicker'
import InputGroup from '@/components/ui/InputGroup'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'

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
    tags: Options
    vendor: string
    brand: string
    description: string
    price: string
    location: string
    date: string
    time: string
}

type OrganizationFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: {
        category: string
        tags: Options
        [key: string]: unknown
    }
}

const categories = [
    { label: 'Online Doctor', value: 'Online Doctor' },
    { label: 'In-person Doctor', value: 'In-person Doctor' },
    { label: 'NHS Locum GP', value: 'NHS Locum GP' },
]

const services = [
    { label: 'Menopause Specialist', value: 'Menopause Specialist' },
    { label: 'Private Prescriptions', value: 'Private Prescriptions' },
]

const OrganizationFields = (props: OrganizationFieldsProps) => {
    const { values = { category: '', tags: [] }, touched, errors } = props

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
                                    options={categories}
                                    value={categories.filter(
                                        (category) =>
                                            category.value === values.category,
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
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Service Title"
                        invalid={
                            (errors.category && touched.category) as boolean
                        }
                        errorMessage={errors.category}
                    >
                        <Field name="service">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    options={services}
                                    value={services.filter(
                                        (service) =>
                                            service.value === values.service,
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
                        <Field
                            type="number"
                            name="price"
                            placeholder="Enter price"
                            component={Input}
                            suffix="GBP"
                        />
                    </FormItem>
                </div>
                {/* New Location Field */}
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
                                    onChange={(val) => form.setFieldValue(field.name, val)}
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
                                    value={options2.find(option => option.value === field.value)}
                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
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
