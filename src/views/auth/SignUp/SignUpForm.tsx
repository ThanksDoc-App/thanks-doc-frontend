import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { apiSignUp } from '@/services/AuthService'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type SignUpFormSchema = {
    userName: string
    password: string
    confirmPassword: string
    email: string
    gmcNumber?: string
}

const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
        hasUppercase,
        hasNumber,
        hasSymbol,
        isLongEnough: password.length >= 8,
    }
}

const getValidationSchema = (signedUpAs: string) => {
    const baseSchema = {
        userName: Yup.string().required('Please enter your full name'),
        email: Yup.string()
            .email('Invalid email')
            .required('Please enter your email'),
        password: Yup.string().required('Please enter your password'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Your passwords do not match')
            .required('Please confirm your password'),
    }

    if (signedUpAs === 'doctor') {
        return Yup.object().shape({
            ...baseSchema,
            gmcNumber: Yup.string().required('Please enter your GMC number'),
        })
    }

    return Yup.object().shape(baseSchema)
}

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const location = useLocation()
    const navigate = useNavigate()

    const [message, setMessage] = useTimeOutMessage()
    const [signUpSuccess, setSignUpSuccess] = useState(false)
    const [selectedRole, setSelectedRole] = useState('')
    const [loader, setLoader] = useState(false)
    const [passwordError, setPasswordError] = useState('')

    useEffect(() => {
        let role = ''
        const savedRole = localStorage.getItem('signedUpAs')
        if (savedRole) {
            role = savedRole
        }
        if (location.state?.signedUpAs) {
            role = location.state.signedUpAs
        }
        setSelectedRole(role)
    }, [location])

    const handlePasswordChange = (
        value: string,
        setFieldValue: (field: string, value: any) => void,
    ) => {
        setFieldValue('password', value)

        const { hasUppercase, hasNumber, hasSymbol, isLongEnough } =
            validatePassword(value)

        if (!isLongEnough) {
            setPasswordError('Password must be at least 8 characters.')
        } else if (!hasUppercase || !hasNumber || !hasSymbol) {
            let errorMessage = 'Password must include '
            const parts = []
            if (!hasUppercase) parts.push('an uppercase letter')
            if (!hasNumber) parts.push('a number')
            if (!hasSymbol) parts.push('a symbol')
            errorMessage += parts.join(', ')
            setPasswordError(errorMessage)
        } else {
            setPasswordError('')
        }
    }

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        const { userName, password, email, gmcNumber, confirmPassword } = values
        setLoader(true)
        setSubmitting(true)

        // Additional validation before submission
        const { hasUppercase, hasNumber, hasSymbol, isLongEnough } =
            validatePassword(password)

        if (!isLongEnough) {
            setMessage('Password must be at least 8 characters.')
            setSubmitting(false)
            setLoader(false)
            return
        }

        if (!hasUppercase || !hasNumber || !hasSymbol) {
            setMessage(
                'Password must include an uppercase, number, and symbol.',
            )
            setSubmitting(false)
            setLoader(false)
            return
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
            setSubmitting(false)
            setLoader(false)
            return
        }

        try {
            const requestBody = {
                name: userName,
                contactName: userName,
                email,
                password,
                signedUpAs: selectedRole,
                ...(selectedRole === 'doctor' && gmcNumber && { gmcNumber }),
            }

            const response = await apiSignUp(requestBody)

            if (response.data.status === true) {
                localStorage.removeItem('signedUpAs')
                setSignUpSuccess(true)
                navigate('/verify-email')
            } else {
                throw new Error(response?.data?.message)
            }
        } catch (error: any) {
            console.error('Signup failed:', error)
            setMessage(
                error?.response?.data?.message ||
                    error?.message ||
                    'Signup failed',
            )
        } finally {
            setSubmitting(false)
            setLoader(false)
        }
    }

    if (!selectedRole) {
        return (
            <div className={className}>
                <Alert showIcon className="mb-4" type="warning">
                    Please select a role first. Redirecting...
                </Alert>
            </div>
        )
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            {signUpSuccess && (
                <Alert showIcon className="mb-4" type="success">
                    Account created successfully! Redirecting to verify email...
                </Alert>
            )}

            <Formik
                initialValues={{
                    userName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    gmcNumber: '',
                }}
                validationSchema={getValidationSchema(selectedRole)}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting, setFieldValue, values }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="FullName"
                                invalid={errors.userName && touched.userName}
                                errorMessage={errors.userName}
                            >
                                <Field
                                    type="text"
                                    name="userName"
                                    autoComplete="off"
                                    placeholder="First and Last Name"
                                    component={Input}
                                    disabled={signUpSuccess}
                                />
                            </FormItem>

                            <FormItem
                                label="Email"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    placeholder="Email"
                                    component={Input}
                                    disabled={signUpSuccess}
                                />
                            </FormItem>

                            {selectedRole === 'doctor' && (
                                <FormItem
                                    label="GMC Number"
                                    invalid={
                                        errors.gmcNumber && touched.gmcNumber
                                    }
                                    errorMessage={errors.gmcNumber}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="gmcNumber"
                                        placeholder="GMC Number"
                                        component={Input}
                                        disabled={signUpSuccess}
                                    />
                                </FormItem>
                            )}

                            <FormItem
                                label="Password"
                                invalid={
                                    (errors.password && touched.password) ||
                                    !!passwordError
                                }
                                errorMessage={passwordError || errors.password}
                                style={
                                    passwordError
                                        ? { marginBottom: '7px' }
                                        : undefined
                                }
                            >
                                <Field name="password">
                                    {({ field }: any) => (
                                        <PasswordInput
                                            {...field}
                                            autoComplete="off"
                                            placeholder="Password"
                                            disabled={signUpSuccess}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) => {
                                                handlePasswordChange(
                                                    e.target.value,
                                                    setFieldValue,
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem
                                label="Confirm Password"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    name="confirmPassword"
                                    autoComplete="off"
                                    placeholder="Confirm Password"
                                    component={PasswordInput}
                                    disabled={signUpSuccess}
                                />
                            </FormItem>

                            <Button
                                block
                                loading={isSubmitting || loader}
                                variant="solid"
                                type="submit"
                            >
                                Sign Up
                            </Button>

                            <div className="mt-4 text-center">
                                <span>Already have an account? </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm
