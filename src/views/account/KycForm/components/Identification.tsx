import Segment from '@/components/ui/Segment'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { FormItem, FormContainer } from '@/components/ui/Form'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import SegmentItemOption from '@/components/shared/SegmentItemOption'
import DatePicker from '@/components/ui/DatePicker'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import classNames from 'classnames'
import {
    Field,
    Form,
    Formik,
    FieldProps,
    FormikTouched,
    FormikErrors,
    FormikProps,
    FieldInputProps,
} from 'formik'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useState } from 'react'
import * as Yup from 'yup'
import type { Identification as IdentificationType } from '../store'
import type { PropsWithChildren } from 'react'

export const settingIntergrationData = {
    available: [
        {
            name: 'Right to Work',
            desc: 'your right to work in the UK',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },
        {
            name: 'GP CV',
            desc: 'GP CV',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },
        {
            name: 'Occupational Health Clearance',
            desc: 'Occupational Health Clearance',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },
        {
            name: 'Professional References 1',
            desc: 'Professional References 1',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },
        {
            name: 'Professional References 2',
            desc: 'Professional References 2',
            type: 'Approved',
            img: '/img/thumbs/file.png',
            active: false,
        },
        {
            name: 'Appraisal & Revalidation Evidence',
            desc: 'Appraisal & Revalidation Evidence',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },

        {
            name: 'Current Performers List',
            desc: 'Current Performers List',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },
        {
            name: 'Enhanced DBS Certificate',
            desc: 'Enhanced DBS Certificate',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },
        {
            name: 'Mandatory Training Certificates',
            desc: 'Mandatory Training Certificates',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },
    ],
}

type FormModel = IdentificationType

type IdentificationProps = {
    data: IdentificationType
    onNextChange?: (
        values: FormModel,
        formName: string,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => void
    onBackChange?: () => void
    currentStepStatus?: string
}

type DocumentUploadFieldProps = PropsWithChildren<{
    label: string
    name: string
    touched: FormikTouched<IdentificationType>
    errors: FormikErrors<IdentificationType>
}>

// Generate document types from settingIntergrationData
const documentTypes = settingIntergrationData.available.map((item) => ({
    value: item.name.toLowerCase().replace(/\s+/g, ''),
    label: item.name,
    desc: item.desc,
    img: item.img,
    disabled: false,
}))

// Define document types that require name/email instead of file upload
const referenceDocumentTypes = [
    'professionalreferences1', // Added Professional References 1
    'professionalreferences2',
    'appraisalrevalidationevidence',
]

// Define document types that require title field instead of expiry date
const titleDocumentTypes = ['mandatorytrainingcertificates']

// Generate validation schema dynamically
const generateValidationSchema = () => {
    const schema: any = {
        documentType: Yup.string(), // not required
        expiryDate: Yup.string(), // not required
        titleField: Yup.string(), // not required
    }

    documentTypes.forEach((doc) => {
        const fieldName = doc.value
        if (referenceDocumentTypes.includes(fieldName)) {
            // For reference documents, add fullName and email fields
            schema[`${fieldName}FullName`] = Yup.string()
            schema[`${fieldName}Email`] = Yup.string().email(
                'Invalid email format',
            )
        } else {
            // For regular documents, add front and back fields
            schema[`${fieldName}Front`] = Yup.string()
            schema[`${fieldName}Back`] = Yup.string()
        }
    })

    return Yup.object().shape(schema)
}

const validationSchema = generateValidationSchema()

// Generate document upload descriptions
const documentUploadDescription = settingIntergrationData.available.reduce(
    (acc, item) => {
        const key = item.name.toLowerCase().replace(/\s+/g, '')
        if (referenceDocumentTypes.includes(key)) {
            acc[key] = [
                `Provide accurate contact information for ${item.name}`,
                `Ensure the full name matches official records`,
                `Email address must be valid and active`,
            ]
        } else {
            acc[key] = [
                `Uploaded ${item.name} image must be clearly visible & complete`,
                `${item.name} must be in valid period`,
                `Provided ${item.name} must include all required information`,
            ]
        }
        return acc
    },
    {} as Record<string, string[]>,
)

const DocumentUploadField = (props: DocumentUploadFieldProps) => {
    const { label, name, children, touched, errors } = props

    const onSetFormFile = (
        form: FormikProps<IdentificationType>,
        field: FieldInputProps<IdentificationType>,
        file: File[],
    ) => {
        form.setFieldValue(field.name, URL.createObjectURL(file[0]))
    }

    return (
        <FormItem
            label={label}
            invalid={errors[name] && touched[name]}
            errorMessage={errors[name]}
        >
            <Field name={name}>
                {({ field, form }: FieldProps) => (
                    <Upload
                        draggable
                        className="cursor-pointer h-[300px]"
                        showList={false}
                        uploadLimit={1}
                        onChange={(files) => onSetFormFile(form, field, files)}
                        onFileRemove={(files) =>
                            onSetFormFile(form, field, files)
                        }
                    >
                        {field.value ? (
                            <img
                                className="p-3 max-h-[300px]"
                                src={field.value}
                                alt=""
                            />
                        ) : (
                            <div className="text-center">
                                {children}
                                <p className="font-semibold">
                                    <span className="text-gray-800 dark:text-white">
                                        Drop your image here, or{' '}
                                    </span>
                                    <span className="text-blue-500">
                                        browse
                                    </span>
                                </p>
                                <p className="mt-1 opacity-60 dark:text-white">
                                    Support: jpeg, png
                                </p>
                            </div>
                        )}
                    </Upload>
                )}
            </Field>
        </FormItem>
    )
}

const ReferenceInputFields = ({
    documentType,
    touched,
    errors,
}: {
    documentType: string
    touched: FormikTouched<IdentificationType>
    errors: FormikErrors<IdentificationType>
}) => {
    const documentLabel =
        documentTypes.find((d) => d.value === documentType)?.label || ''

    return (
        <div className="grid xl:grid-cols-2 gap-4">
            <FormItem
                label={`${documentLabel} - Full Name`}
                invalid={
                    errors[`${documentType}FullName`] &&
                    touched[`${documentType}FullName`]
                }
                errorMessage={errors[`${documentType}FullName`]}
            >
                <Field name={`${documentType}FullName`}>
                    {({ field }: FieldProps) => (
                        <Input
                            {...field}
                            placeholder="Enter full name"
                            autoComplete="off"
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label={`${documentLabel} - Email Address`}
                invalid={
                    errors[`${documentType}Email`] &&
                    touched[`${documentType}Email`]
                }
                errorMessage={errors[`${documentType}Email`]}
            >
                <Field name={`${documentType}Email`}>
                    {({ field }: FieldProps) => (
                        <Input
                            {...field}
                            type="email"
                            placeholder="Enter email address"
                            autoComplete="off"
                        />
                    )}
                </Field>
            </FormItem>
        </div>
    )
}

const Identification = ({
    data = {
        documentType: '',
        ...documentTypes.reduce((acc, doc) => {
            if (referenceDocumentTypes.includes(doc.value)) {
                acc[`${doc.value}FullName`] = ''
                acc[`${doc.value}Email`] = ''
            } else {
                acc[`${doc.value}Front`] = ''
                acc[`${doc.value}Back`] = ''
            }
            return acc
        }, {} as any),
    },
    onNextChange,
    onBackChange,
    currentStepStatus,
}: IdentificationProps) => {
    const { textTheme, bgTheme } = useThemeClass()
    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 3
    const totalPages = Math.ceil(documentTypes.length / itemsPerPage)

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return documentTypes.slice(startIndex, endIndex)
    }

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    const onNext = (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        onNextChange?.(values, 'identification', setSubmitting)
    }

    const onBack = () => {
        onBackChange?.()
    }

    const isReferenceDocument = (documentType: string) => {
        return referenceDocumentTypes.includes(documentType)
    }

    const isTitleDocument = (documentType: string) => {
        return titleDocumentTypes.includes(documentType)
    }

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Identification</h3>
                <p>Upload relevant document to verify your identity.</p>
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
                    const validatedProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label="Select your document type"
                                    invalid={
                                        errors.documentType &&
                                        touched.documentType
                                    }
                                    errorMessage={errors.documentType}
                                >
                                    <Field name="documentType">
                                        {({ field, form }: FieldProps) => (
                                            <div className="relative">
                                                {/* Navigation Arrows */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            goToPreviousPage
                                                        }
                                                        disabled={
                                                            currentPage === 0
                                                        }
                                                        className={`p-2 rounded-lg border transition-colors ${
                                                            currentPage === 0
                                                                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                                                : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        <HiChevronLeft className="w-5 h-5" />
                                                    </button>

                                                    <div className="flex space-x-2">
                                                        {Array.from(
                                                            {
                                                                length: totalPages,
                                                            },
                                                            (_, index) => (
                                                                <button
                                                                    key={index}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setCurrentPage(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className={`w-3 h-3 rounded-full transition-colors ${
                                                                        index ===
                                                                        currentPage
                                                                            ? 'bg-blue-500'
                                                                            : 'bg-gray-300 hover:bg-gray-400'
                                                                    }`}
                                                                />
                                                            ),
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={goToNextPage}
                                                        disabled={
                                                            currentPage ===
                                                            totalPages - 1
                                                        }
                                                        className={`p-2 rounded-lg border transition-colors ${
                                                            currentPage ===
                                                            totalPages - 1
                                                                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                                                : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        <HiChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* Document Type Selector */}
                                                <Segment
                                                    className="flex xl:items-center flex-col xl:flex-row gap-4"
                                                    value={[field.value]}
                                                    onChange={(val) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            val[0],
                                                        )
                                                    }
                                                >
                                                    <>
                                                        {getCurrentPageItems().map(
                                                            (item) => (
                                                                <Segment.Item
                                                                    key={
                                                                        item.value
                                                                    }
                                                                    value={
                                                                        item.value
                                                                    }
                                                                    disabled={
                                                                        item.disabled
                                                                    }
                                                                >
                                                                    {({
                                                                        active,
                                                                        value,
                                                                        onSegmentItemClick,
                                                                        disabled,
                                                                    }) => {
                                                                        return (
                                                                            <SegmentItemOption
                                                                                active={
                                                                                    active
                                                                                }
                                                                                disabled={
                                                                                    disabled
                                                                                }
                                                                                className="w-full xl:w-[260px] h-18"
                                                                                onSegmentItemClick={
                                                                                    onSegmentItemClick
                                                                                }
                                                                            >
                                                                                <div className="flex items-center justify-center h-full">
                                                                                    <h6 className="text-center text-[15px]">
                                                                                        {
                                                                                            item.label
                                                                                        }
                                                                                    </h6>
                                                                                </div>
                                                                            </SegmentItemOption>
                                                                        )
                                                                    }}
                                                                </Segment.Item>
                                                            ),
                                                        )}
                                                    </>
                                                </Segment>
                                            </div>
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Conditional rendering based on document type */}
                                {values.documentType &&
                                    !isReferenceDocument(
                                        values.documentType,
                                    ) && (
                                        <>
                                            {/* Show title field for title documents, expiry date for others */}
                                            {isTitleDocument(
                                                values.documentType,
                                            ) ? (
                                                <FormItem
                                                    label="Document Title"
                                                    className="mb-6"
                                                >
                                                    <Field name="titleField">
                                                        {({
                                                            field,
                                                        }: FieldProps) => (
                                                            <Input
                                                                {...field}
                                                                placeholder="Enter document title"
                                                                autoComplete="off"
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                            ) : (
                                                <FormItem
                                                    label="Document Expiry Date"
                                                    className="mb-6"
                                                >
                                                    <Field name="expiryDate">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps) => (
                                                            <DatePicker
                                                                {...field}
                                                                value={
                                                                    field.value ||
                                                                    null
                                                                }
                                                                onChange={(
                                                                    date,
                                                                ) =>
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        date,
                                                                    )
                                                                }
                                                                placeholder="Select expiry date"
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                            )}

                                            <div className="grid xl:grid-cols-2 gap-4">
                                                <DocumentUploadField
                                                    name={
                                                        `${values.documentType}Front` as keyof IdentificationType
                                                    }
                                                    label={`${documentTypes.find(
                                                        (d) =>
                                                            d.value ===
                                                            values.documentType,
                                                    )?.label} Front`}
                                                    {...validatedProps}
                                                >
                                                    <DoubleSidedImage
                                                        className="mx-auto mb-3"
                                                        src="/img/thumbs/id-card-front.png"
                                                        darkModeSrc="/img/thumbs/id-card-front-dark.png"
                                                        alt=""
                                                    />
                                                </DocumentUploadField>
                                                <DocumentUploadField
                                                    name={
                                                        `${values.documentType}Back` as keyof IdentificationType
                                                    }
                                                    label={`${documentTypes.find(
                                                        (d) =>
                                                            d.value ===
                                                            values.documentType,
                                                    )?.label} Back`}
                                                    {...validatedProps}
                                                >
                                                    <DoubleSidedImage
                                                        className="mx-auto mb-3"
                                                        src="/img/thumbs/id-card-back.png"
                                                        darkModeSrc="/img/thumbs/id-card-back-dark.png"
                                                        alt=""
                                                    />
                                                </DocumentUploadField>
                                            </div>
                                        </>
                                    )}

                                {/* Reference document fields */}
                                {values.documentType &&
                                    isReferenceDocument(
                                        values.documentType,
                                    ) && (
                                        <ReferenceInputFields
                                            documentType={values.documentType}
                                            touched={touched}
                                            errors={errors}
                                        />
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

export default Identification
