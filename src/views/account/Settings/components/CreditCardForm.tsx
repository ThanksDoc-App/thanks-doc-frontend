import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

export type CreditCardFormModel = {
    bankName?: string
    sortCode?: string
    accountNumber?: string
}

type CreditCardFormProps = {
    onUpdate: (bankDetails: CreditCardFormModel) => void
}

const validationSchema = Yup.object().shape({
    bankName: Yup.string(),
    sortCode: Yup.string(),
    accountNumber: Yup.string(),
})

const CreditCardForm = ({ onUpdate }: CreditCardFormProps) => {
    return (
        <Formik<CreditCardFormModel>
            initialValues={{
                bankName: '',
                sortCode: '',
                accountNumber: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onUpdate(values)
                setSubmitting(false)
            }}
        >
            {({ touched, errors }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Account Name"
                            invalid={errors.bankName && touched.bankName}
                            errorMessage={errors.bankName}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="accountName"
                                component={Input}
                                placeholder="Enter your account name"
                            />
                        </FormItem>
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem
                                label="Sort Code"
                                invalid={errors.sortCode && touched.sortCode}
                                errorMessage={errors.sortCode}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="sortCode"
                                    component={Input}
                                    placeholder="Enter sort code"
                                />
                            </FormItem>
                            <FormItem
                                label="Account Number"
                                invalid={errors.accountNumber && touched.accountNumber}
                                errorMessage={errors.accountNumber}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="accountNumber"
                                    component={Input}
                                    placeholder="Enter account number"
                                />
                            </FormItem>
                        </div>
                        <FormItem className="mb-0 text-right">
                            <Button block variant="solid" type="submit">
                                Edit
                            </Button>
                        </FormItem>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default CreditCardForm