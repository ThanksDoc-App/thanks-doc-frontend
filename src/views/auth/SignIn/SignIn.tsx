import Simple from '@/components/layouts/AuthLayout/Simple'
import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <div className="relative min-h-screen bg-gray-50 px-4">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
                <Simple>
                    <SignInForm disableSubmit={false} />
                </Simple>
            </div>
        </div>
    )
}

export default SignIn
