import Segment from '@/components/ui/Segment'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { FormItem, FormContainer } from '@/components/ui/Form'
import SvgIcon from '@/components/shared/SvgIcon'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import SegmentItemOption from '@/components/shared/SegmentItemOption'
import DatePicker from '@/components/ui/DatePicker'
import { DriversLicenseSvg, PassportSvg, NationalIdSvg } from '@/assets/svg'
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
            name: 'Mandatory Training Certificates',
            desc: 'Mandatory Training Certificates',
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
            name: 'Certificate for Completion of Training (CCT)',
            desc: 'Certificates',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },
        {
            name: 'Basic Life Support (BLS) Certificate',
            desc: 'Basic Life Support (BLS) Certificate',
            img: '/img/thumbs/file.png',
            type: 'Approved',
            active: false,
        },
        {
            name: 'Level 3 Adult & Child Safeguarding',
            desc: 'Level 3 Adult & Child Safeguarding',
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
    name: keyof IdentificationType
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

// Generate validation schema dynamically
const generateValidationSchema = () => {
    const schema: any = {
        documentType: Yup.string().required('Please select a document type'),
    }

    documentTypes.forEach((doc) => {
        const fieldName = doc.value
        schema[`${fieldName}Front`] = Yup.string().when('documentType', {
            is: fieldName,
            then: Yup.string().required(
                `Please upload your ${doc.label} front`,
            ),
            otherwise: Yup.string(),
        })
        schema[`${fieldName}Back`] = Yup.string().when('documentType', {
            is: fieldName,
            then: Yup.string().required(`Please upload your ${doc.label} back`),
            otherwise: Yup.string(),
        })
    })

    return Yup.object().shape(schema)
}

const validationSchema = generateValidationSchema()

// Generate document upload descriptions
const documentUploadDescription = settingIntergrationData.available.reduce(
    (acc, item) => {
        const key = item.name.toLowerCase().replace(/\s+/g, '')
        acc[key] = [
            `Uploaded ${item.name} image must be clearly visible & complete`,
            `${item.name} must be in valid period`,
            `Provided ${item.name} must include all required information`,
        ]
        return acc
    },
    {} as Record<string, string[]>,
)

const DocumentTypeIcon = ({ type }: { type: string }) => {
    // Default to NationalIdSvg for most documents
    return <NationalIdSvg />
}

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

const Identification = ({
    data = {
        documentType: '',
        ...documentTypes.reduce((acc, doc) => {
            acc[`${doc.value}Front`] = ''
            acc[`${doc.value}Back`] = ''
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
                                                                                className="w-full xl:w-[260px]"
                                                                                onSegmentItemClick={
                                                                                    onSegmentItemClick
                                                                                }
                                                                            >
                                                                                <div className="flex items-center">
                                                                                    <SvgIcon
                                                                                        className={classNames(
                                                                                            'text-4xl ltr:mr-3 rtl:ml-3',
                                                                                            active &&
                                                                                                textTheme,
                                                                                        )}
                                                                                    >
                                                                                        <DocumentTypeIcon
                                                                                            type={
                                                                                                value
                                                                                            }
                                                                                        />
                                                                                    </SvgIcon>
                                                                                    <h6>
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
                                <div className="mb-6">
                                    <h6>
                                        In order to complete upload and avoid
                                        delays when verifying account, please
                                        make sure below:
                                    </h6>
                                    <ul className="mt-4">
                                        {values.documentType &&
                                            documentUploadDescription[
                                                values.documentType
                                            ]?.map((desc, index) => (
                                                <li
                                                    key={desc + index}
                                                    className="mb-2 flex items-center"
                                                >
                                                    <Badge
                                                        className="rtl:ml-3 ltr:mr-3"
                                                        innerClass={bgTheme}
                                                    />
                                                    <span>{desc}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>

                                <FormItem
                                    label="Document Expiry Date"
                                    className="mb-6"
                                >
                                    <Field name="expiryDate">
                                        {({ field, form }: FieldProps) => (
                                            <DatePicker
                                                {...field}
                                                value={field.value || null}
                                                onChange={(date) =>
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
                                {values.documentType && (
                                    <div className="grid xl:grid-cols-2 gap-4">
                                        <DocumentUploadField
                                            name={`${values.documentType}Front`}
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
                                            name={`${values.documentType}Back`}
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
