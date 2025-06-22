import Simple from '@/components/layouts/AuthLayout/Simple'
import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Simple>
                <SignInForm disableSubmit={false} />
            </Simple>
        </div>
    )
}

export default SignIn
