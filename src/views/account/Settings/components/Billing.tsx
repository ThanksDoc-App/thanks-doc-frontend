import { useState, useEffect } from 'react'
import classNames from 'classnames'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import Dialog from '@/components/ui/Dialog'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import CreditCardForm, { CreditCardInfo } from './CreditCardForm'
import BillingHistory from './BillingHistory'
import { Field, Form, Formik } from 'formik'
import { HiPlus } from 'react-icons/hi'
import isLastChild from '@/utils/isLastChild'
import { apiGetAccountSettingBillingData } from '@/services/AccountServices'
import type { FieldProps, FieldInputProps, FormikProps } from 'formik'

type CreditCard = {
    cardId: string
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

type OtherPayemnt = {
    id: string
    identifier: string
    redirect: string
    type: string
}

type Bill = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

type BillingData = {
    paymentMethods: CreditCard[]
    otherMethod: OtherPayemnt[]
    billingHistory: Bill[]
}

type BillingFormModel = BillingData

type GetAccountSettingBillingDataResponse = BillingData

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const Billing = () => {
    const [data, setData] = useState<BillingData>({
        paymentMethods: [],
        otherMethod: [],
        billingHistory: [],
    })
    const [selectedCard, setSelectedCard] = useState<Partial<CreditCardInfo>>(
        {},
    )
    const [ccDialogType, setCcDialogType] = useState<'NEW' | 'EDIT' | ''>('')

    const fetchData = async () => {
        const response =
            await apiGetAccountSettingBillingData<GetAccountSettingBillingDataResponse>()
        setData(response.data)
    }

    const onFormSubmit = (
        _: BillingFormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        toast.push(
            <Notification
                title={'Billing information updated'}
                type="success"
            />,
            {
                placement: 'top-center',
            },
        )
        setSubmitting(false)
    }

    const onCreditCardDialogClose = () => {
        setCcDialogType('')
        setSelectedCard({})
    }

    const onEditCreditCard = (
        card: Partial<CreditCard>,
        type: 'EDIT' | 'NEW',
    ) => {
        setCcDialogType(type)
        setSelectedCard(card)
    }

    const onCardUpdate = (
        cardValue: CreditCardInfo,
        form: FormikProps<BillingData>,
        field: FieldInputProps<BillingData>,
    ) => {
        let paymentMethodsValue = form.values[
            field.name as keyof BillingData
        ] as CreditCard[]

        if (cardValue.primary) {
            paymentMethodsValue.forEach((card) => {
                card.primary = false
            })
        }

        if (
            !paymentMethodsValue.some(
                (card) => card.cardId === cardValue.cardId,
            )
        ) {
            paymentMethodsValue.push(cardValue)
        }

        paymentMethodsValue = paymentMethodsValue.map((card) => {
            if (card.cardId === cardValue.cardId) {
                card = { ...card, ...cardValue }
            }
            return card
        })

        let cardTemp = {}
        paymentMethodsValue = paymentMethodsValue.filter((card) => {
            if (card.primary) {
                cardTemp = card
            }
            return !card.primary
        })
        paymentMethodsValue = [
            ...[cardTemp as CreditCard],
            ...paymentMethodsValue,
        ]
        form.setFieldValue(field.name, paymentMethodsValue)
        onCreditCardDialogClose()
    }

    const onRedirect = (url: string) => {
        const win = window.open(url, '_blank')
        win?.focus()
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Formik
            enableReinitialize
            initialValues={data}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                setTimeout(() => {
                    onFormSubmit(values, setSubmitting)
                }, 1000)
            }}
        >
            {({ values, touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form>
                        <FormContainer>
                            <FormDesription
                                title="Account details"
                                desc="This is bank account information that you can update anytime."
                            />
                            <FormRow
                                border={false}
                                name="otherMethod"
                                alignCenter={false}
                                label="Payment Details"
                                {...validatorProps}
                            >
                                <Field name="paymentMethods">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<BillingFormModel>) => {
                                        return (
                                            <CreditCardForm
                                                type={ccDialogType}
                                                card={
                                                    selectedCard as CreditCardInfo
                                                }
                                                onUpdate={(cardValue) =>
                                                    onCardUpdate(
                                                        cardValue,
                                                        form,
                                                        field,
                                                        
                                                    )
                                                }
                                            />
                                        )
                                    }}
                                </Field>
                            </FormRow>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default Billing
