// src/views/auth/SignInForm.tsx
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { ROLE_BASED_PATHS } from '@/configs/app.config'
import { Field, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
// useEffect import removed since we no longer need it
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type SignInFormSchema = {
    email: string
    password: string
    rememberMe: boolean
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Please enter your email'),
    password: Yup.string().required('Please enter your password'),
    rememberMe: Yup.bool(),
})

const SignInForm = ({
    disableSubmit = false,
    className,
    forgotPasswordUrl = '/forgot-password',
    signUpUrl = '/sign-up-as',
}: SignInFormProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const { signIn } = useAuth()
    const navigate = useNavigate()

    // This useEffect can be removed since we're getting role from API response
    // useEffect(() => {
    //     // No longer needed - role check happens after API response
    // }, [navigate])

    const onSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(true)
        try {
            const result = await signIn({
                email: values.email,
                password: values.password,
            })

            if (result?.status === false) {
                setMessage(result.message)
            } else if (result?.status === true && result?.data?.signedUpAs) {
                // Get signedUpAs from the API response data
                const signedUpAs = result.data.signedUpAs

                console.log('User signedUpAs:', signedUpAs) // Debug log

                if (signedUpAs === 'doctor') {
                    console.log('Redirecting to doctor dashboard')
                    navigate(ROLE_BASED_PATHS.doctor, { replace: true })
                } else if (signedUpAs === 'business') {
                    console.log('Redirecting to business dashboard')
                    navigate(ROLE_BASED_PATHS.business, { replace: true })
                } else {
                    // No valid role found in API response
                    console.warn(
                        'Invalid role found in API response:',
                        signedUpAs,
                    )
                    setMessage(
                        `Invalid user role: ${signedUpAs}. Please contact support.`,
                    )
                }
            } else {
                // Handle case where API response doesn't have expected structure
                console.error('API response missing signedUpAs data:', result)
                setMessage('Invalid response from server. Please try again.')
            }
        } catch (error) {
            setMessage(
                'Sign-in failed. Please check your credentials and try again.',
            )
        }
        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{ email: '', password: '', rememberMe: false }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) onSignIn(values, setSubmitting)
                    else setSubmitting(false)
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Email"
                                invalid={!!errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={!!errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="current-password"
                                    name="password"
                                    placeholder="Enter your password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <div className="flex justify-between mb-6">
                                <Field
                                    className="mb-0"
                                    name="rememberMe"
                                    component={Checkbox}
                                >
                                    Remember Me
                                </Field>
                                <ActionLink to={forgotPasswordUrl}>
                                    Forgot Password?
                                </ActionLink>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Don't have an account yet? </span>
                                <ActionLink to={signUpUrl}>Sign up</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
