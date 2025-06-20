import Simple from '@/components/layouts/AuthLayout/Simple'
import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <div>
            <Simple>
                <SignInForm disableSubmit={false} />
            </Simple>
        </div>
    )
}

export default SignIn
