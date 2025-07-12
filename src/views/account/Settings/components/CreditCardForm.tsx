import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'

export type CreditCardFormModel = {
    accountName: string
    sortCode: string
    accountNumber: string
}

export type CreditCardInfo = CreditCardFormModel & {
    cardId?: string
    cardHolderName?: string
    cardType?: string
    expMonth?: string
    expYear?: string
    last4Number?: string
    primary?: boolean
}

type CreditCardFormProps = {
    onUpdate: (bankDetails: CreditCardInfo) => void
    loading?: boolean
    card?: Partial<CreditCardInfo>
}

const CreditCardForm = ({
    onUpdate,
    loading = false,
    card,
}: CreditCardFormProps) => {
    const [formData, setFormData] = useState<CreditCardFormModel>({
        accountName: card?.accountName || '',
        sortCode: card?.sortCode || '',
        accountNumber: card?.accountNumber || '',
    })

    const [errors, setErrors] = useState<Partial<CreditCardFormModel>>({})

    const validateForm = () => {
        const newErrors: Partial<CreditCardFormModel> = {}

        if (!formData.accountName || formData.accountName.length < 2) {
            newErrors.accountName =
                'Account name is required and must be at least 2 characters'
        }

        // ✅ Flexible sort code validation for international use
        if (!formData.sortCode) {
            newErrors.sortCode = 'Sort code/routing number is required'
        } else if (
            !/^[\d-]+$/.test(formData.sortCode) ||
            formData.sortCode.length < 6
        ) {
            newErrors.sortCode =
                'Sort code must contain only digits and dashes, minimum 6 characters'
        }

        // ✅ International account number validation
        if (!formData.accountNumber) {
            newErrors.accountNumber = 'Account number is required'
        } else if (!/^[\d\s-]+$/.test(formData.accountNumber)) {
            newErrors.accountNumber =
                'Account number must contain only digits, spaces, and dashes'
        } else {
            const cleanAccountNumber = formData.accountNumber.replace(
                /[\s-]/g,
                '',
            )
            if (cleanAccountNumber.length < 4) {
                newErrors.accountNumber =
                    'Account number must be at least 4 digits'
            } else if (cleanAccountNumber.length > 34) {
                newErrors.accountNumber =
                    'Account number must be at most 34 digits'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (
        field: keyof CreditCardFormModel,
        value: string,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }))
        }
    }

    const handleSubmit = () => {
        console.log('Button clicked!')
        console.log('Form data:', formData)

        if (validateForm()) {
            // Clean the account number by removing spaces and dashes for processing
            const cleanAccountNumber = formData.accountNumber.replace(
                /[\s-]/g,
                '',
            )

            const cardInfo: CreditCardInfo = {
                ...formData,
                accountNumber: cleanAccountNumber, // Store clean version
                cardId: card?.cardId || `card_${Date.now()}`,
                cardHolderName: formData.accountName,
                cardType: 'bank',
                expMonth: '',
                expYear: '',
                last4Number: cleanAccountNumber.slice(-4),
                primary: card?.primary || false,
            }

            console.log('Calling onUpdate with:', cardInfo)
            onUpdate(cardInfo)
        }
    }

    return (
        <div className="space-y-6">
            <FormContainer>
                <FormItem
                    label="Account Name"
                    invalid={!!errors.accountName}
                    errorMessage={errors.accountName}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        value={formData.accountName}
                        onChange={(e) =>
                            handleInputChange('accountName', e.target.value)
                        }
                        placeholder="Enter your account name"
                        disabled={loading}
                    />
                </FormItem>
                <div className="grid grid-cols-2 gap-4">
                    <FormItem
                        label="Sort Code"
                        invalid={!!errors.sortCode}
                        errorMessage={errors.sortCode}
                    >
                        <Input
                            type="text"
                            autoComplete="off"
                            value={formData.sortCode}
                            onChange={(e) =>
                                handleInputChange('sortCode', e.target.value)
                            }
                            placeholder="12-34-56"
                            disabled={loading}
                        />
                    </FormItem>
                    <FormItem
                        label="Account Number"
                        invalid={!!errors.accountNumber}
                        errorMessage={errors.accountNumber}
                    >
                        <Input
                            type="text"
                            autoComplete="off"
                            value={formData.accountNumber}
                            onChange={(e) =>
                                handleInputChange(
                                    'accountNumber',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter your account number"
                            disabled={loading}
                        />
                    </FormItem>
                </div>
                <FormItem className="mb-0 text-right">
                    <Button
                        block
                        variant="solid"
                        type="button"
                        loading={loading}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? 'Adding Account...' : 'Add Account'}
                    </Button>
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default CreditCardForm
