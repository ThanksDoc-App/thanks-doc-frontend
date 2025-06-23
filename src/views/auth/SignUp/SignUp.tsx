import SignUpAs from './SignUpAs'
import SignUpForm from './SignUpForm'
import SignUpFormBusiness from './SignUpFormBusiness'

const SignUp = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] px-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-8">
                    <h3 className="mb-1 text-white text-2xl font-semibold">
                        Sign Up
                    </h3>
                    <p className="text-[#ffffffb3] text-sm">
                        And let’s get started with your free trial
                    </p>
                </div>
                <SignUpForm disableSubmit={false} />
                <SignUpFormBusiness disableSubmit={false} />
            </div>
        </div>
    )
}

export default SignUp
