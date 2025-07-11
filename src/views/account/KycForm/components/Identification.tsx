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
import { useAppDispatch, useAppSelector } from '@/store'
import {
    createMultipleDocuments,
    selectDocumentLoading,
    selectDocumentError,
    clearError,
} from '../store/documentSlice'
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
    'professionalreferences1',
    'professionalreferences2',
    'appraisalrevalidationevidence',
]

// Define document types that require title field instead of expiry date
const titleDocumentTypes = ['mandatorytrainingcertificates']

// Generate validation schema dynamically
const generateValidationSchema = () => {
    const schema: any = {
        documentType: Yup.string(),
    }

    documentTypes.forEach((doc) => {
        const fieldName = doc.value
        if (referenceDocumentTypes.includes(fieldName)) {
            schema[`${fieldName}FullName`] = Yup.string()
            schema[`${fieldName}Email`] = Yup.string().email(
                'Invalid email format',
            )
        } else {
            // Single document field instead of front/back
            schema[`${fieldName}Document`] = Yup.mixed()

            if (titleDocumentTypes.includes(fieldName)) {
                schema[`${fieldName}Title`] = Yup.string()
            } else {
                schema[`${fieldName}ExpiryDate`] = Yup.string()
            }
        }
    })

    return Yup.object().shape(schema)
}

const validationSchema = generateValidationSchema()

// Enhanced DocumentUploadField with PDF support
const DocumentUploadField = (props: DocumentUploadFieldProps) => {
    const { label, name, children, touched, errors } = props

    const onSetFormFile = (
        form: FormikProps<IdentificationType>,
        field: FieldInputProps<IdentificationType>,
        files: File[],
    ) => {
        if (files.length > 0) {
            const file = files[0]
            // Validate file type - PDF only
            const allowedTypes = ['application/pdf']
            if (!allowedTypes.includes(file.type)) {
                form.setFieldError(field.name, 'Only PDF files are allowed')
                return
            }

            // Validate file size (10MB limit for PDFs)
            const maxSize = 10 * 1024 * 1024 // 10MB
            if (file.size > maxSize) {
                form.setFieldError(
                    field.name,
                    'File size must be less than 10MB',
                )
                return
            }

            form.setFieldValue(field.name, file)
        } else {
            form.setFieldValue(field.name, null)
        }
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
                        accept="application/pdf"
                        onChange={(files) => onSetFormFile(form, field, files)}
                        onFileRemove={(files) =>
                            onSetFormFile(form, field, files)
                        }
                    >
                        {field.value ? (
                            <div className="p-3 text-center">
                                <div className="flex flex-col items-center">
                                    <svg
                                        className="w-16 h-16 text-red-500 mb-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M4 18h12V6l-4-4H4v16zM9 2h2v4h4v2H9V2z" />
                                    </svg>
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        {field.value.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {(
                                            field.value.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{' '}
                                        MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                {children}
                                <p className="font-semibold">
                                    <span className="text-gray-800 dark:text-white">
                                        Drop your PDF here, or{' '}
                                    </span>
                                    <span className="text-blue-500">
                                        browse
                                    </span>
                                </p>
                                <p className="mt-1 opacity-60 dark:text-white">
                                    Support: PDF only (Max 10MB)
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
                // Single document field instead of front/back
                acc[`${doc.value}Document`] = null

                if (titleDocumentTypes.includes(doc.value)) {
                    acc[`${doc.value}Title`] = ''
                } else {
                    acc[`${doc.value}ExpiryDate`] = ''
                }
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

    // Redux hooks
    const dispatch = useAppDispatch()
    const documentLoading = useAppSelector(selectDocumentLoading)
    const documentError = useAppSelector(selectDocumentError)

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

    // FIXED: Enhanced onNext function to handle individual document uploads
    const onNext = async (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        try {
            setSubmitting(true)
            dispatch(clearError())

            // Create array of individual documents to upload
            const documentsToUpload: any[] = []

            documentTypes.forEach((docType) => {
                const fieldName = docType.value
                const documentLabel = docType.label

                if (referenceDocumentTypes.includes(fieldName)) {
                    // For documents with full name and email
                    const fullName = values[`${fieldName}FullName`]
                    const email = values[`${fieldName}Email`]

                    if (fullName || email) {
                        documentsToUpload.push({
                            title: `${documentLabel} - Reference`,
                            content: JSON.stringify({
                                type: 'reference',
                                documentType: documentLabel,
                                fullName: fullName || '',
                                email: email || '',
                                submittedAt: new Date().toISOString(),
                            }),
                            files: [], // No files for reference documents
                        })
                    }
                } else if (titleDocumentTypes.includes(fieldName)) {
                    // For "Mandatory Training Certificates"
                    const documentFile = values[`${fieldName}Document`]
                    const certificateTitle = values[`${fieldName}Title`]

                    if (documentFile || certificateTitle) {
                        const files = documentFile ? [documentFile] : []

                        documentsToUpload.push({
                            title: `${documentLabel} - ${
                                certificateTitle || 'Certificate'
                            }`,
                            content: JSON.stringify({
                                type: 'certificate',
                                documentType: documentLabel,
                                certificateTitle: certificateTitle || '',
                                hasFile: !!documentFile,
                                submittedAt: new Date().toISOString(),
                            }),
                            files,
                        })
                    }
                } else {
                    // For other documents
                    const documentFile = values[`${fieldName}Document`]
                    const expiryDate = values[`${fieldName}ExpiryDate`]

                    if (documentFile || expiryDate) {
                        const files = documentFile ? [documentFile] : []

                        documentsToUpload.push({
                            title: `${documentLabel} - Document`,
                            content: JSON.stringify({
                                type: 'standard',
                                documentType: documentLabel,
                                expiryDate: expiryDate || '',
                                hasFile: !!documentFile,
                                submittedAt: new Date().toISOString(),
                            }),
                            files,
                        })
                    }
                }
            })

            if (documentsToUpload.length === 0) {
                setSubmitting(false)
                return
            }

            // Upload documents individually
            const result = await dispatch(
                createMultipleDocuments({
                    documents: documentsToUpload,
                }),
            )

            if (createMultipleDocuments.fulfilled.match(result)) {
                console.log('Documents uploaded successfully:', result.payload)

                // Check for any failed uploads
                const failedUploads = result.payload.filter((doc) => doc.error)
                if (failedUploads.length > 0) {
                    console.warn(
                        'Some documents failed to upload:',
                        failedUploads,
                    )
                    // You might want to show a warning to the user here
                }

                onNextChange?.(values, 'identification', setSubmitting)
            } else {
                console.error('Document upload failed:', result.payload)
                setSubmitting(false)
            }
        } catch (error) {
            console.error('Error in onNext:', error)
            setSubmitting(false)
        }
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
                <p>Upload relevant PDF documents to verify your identity.</p>
                {/* Enhanced error display */}
                {documentError && (
                    <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <div className="flex justify-between items-center">
                            <span>
                                Error creating document: {documentError}
                            </span>
                            <button
                                onClick={() => dispatch(clearError())}
                                className="text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Formik
                enableReinitialize
                initialValues={data}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onNext(values, setSubmitting)
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

                                {values.documentType &&
                                    !isReferenceDocument(
                                        values.documentType,
                                    ) && (
                                        <>
                                            {isTitleDocument(
                                                values.documentType,
                                            ) ? (
                                                <FormItem
                                                    label="Document Title"
                                                    className="mb-6"
                                                >
                                                    <Field
                                                        name={`${values.documentType}Title`}
                                                    >
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
                                                    <Field
                                                        name={`${values.documentType}ExpiryDate`}
                                                    >
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

                                            {/* Single document upload instead of front/back */}
                                            <DocumentUploadField
                                                name={
                                                    `${values.documentType}Document` as keyof IdentificationType
                                                }
                                                label={`${documentTypes.find(
                                                    (d) =>
                                                        d.value ===
                                                        values.documentType,
                                                )?.label} Document`}
                                                {...validatedProps}
                                            >
                                                <svg
                                                    className="mx-auto mb-3 w-12 h-12 text-gray-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M4 18h12V6l-4-4H4v16zM9 2h2v4h4v2H9V2z" />
                                                </svg>
                                            </DocumentUploadField>
                                        </>
                                    )}

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
                                        loading={
                                            isSubmitting || documentLoading
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

export default Identification
