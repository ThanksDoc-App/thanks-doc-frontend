import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import CreditCardForm, { CreditCardInfo } from './CreditCardForm'
import { Field, Form, Formik } from 'formik'
// ✅ Redux imports only
import { useAppDispatch, useAppSelector } from '@/store'
import {
    addUserAccount,
    resetAddAccountStatus,
    clearAddAccountError,
} from '@/views/account/Settings/store/SettingsSlice'
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

type BillingData = {
    paymentMethods: CreditCard[]
}

type BillingFormModel = BillingData

const Billing = () => {
    // ✅ Redux state only
    const dispatch = useAppDispatch()
    const { addAccountLoading, addAccountSuccess, addAccountError } =
        useAppSelector((state) => state.settings)

    const [data, setData] = useState<BillingData>({
        paymentMethods: [],
    })
    const [selectedCard, setSelectedCard] = useState<Partial<CreditCardInfo>>(
        {},
    )

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

    // ✅ Enhanced onCardUpdate to use Redux only
    const onCardUpdate = async (
        cardValue: CreditCardInfo,
        form: FormikProps<BillingData>,
        field: FieldInputProps<BillingData>,
    ) => {
        try {
            // Dispatch the addUserAccount action
            await dispatch(
                addUserAccount({
                    accountName: cardValue.accountName || '',
                    accountNumber: cardValue.accountNumber || '',
                    sortCode: cardValue.sortCode || '',
                }),
            ).unwrap()

            // Show success notification
            toast.push(
                <Notification
                    title={'Bank account added successfully'}
                    type="success"
                />,
                {
                    placement: 'top-center',
                },
            )

            // Update local form state
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
                paymentMethodsValue.push(cardValue as CreditCard)
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
        } catch (error) {
            // Show error notification
            toast.push(
                <Notification
                    title={'Failed to add bank account'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                },
            )
            console.error('Failed to add account:', error)
        }
    }

    // ✅ Clear error when component unmounts
    useEffect(() => {
        return () => {
            if (addAccountError) {
                dispatch(clearAddAccountError())
            }
        }
    }, [addAccountError, dispatch])

    // ✅ Handle success state
    useEffect(() => {
        if (addAccountSuccess) {
            // Reset the success state after showing notification
            setTimeout(() => {
                dispatch(resetAddAccountStatus())
            }, 3000)
        }
    }, [addAccountSuccess, dispatch])

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

                            {/* ✅ Error Display */}
                            {addAccountError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-red-600 text-sm">
                                            {addAccountError}
                                        </span>
                                        <button
                                            onClick={() =>
                                                dispatch(clearAddAccountError())
                                            }
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}

                            <FormRow
                                border={false}
                                name="paymentMethods"
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
                                                card={
                                                    selectedCard as CreditCardInfo
                                                }
                                                loading={addAccountLoading}
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
