import SignUpAs from './SignUpAs'
import SignUpForm from './SignUpForm'
import SignUpFormBusiness from './SignUpFormBusiness'

const SignUp = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Sign Up</h3>
                <p>And lets get started with your free trial</p>
            </div>
            <SignUpForm disableSubmit={false} />
            <SignUpFormBusiness disableSubmit={false} />
        </>
    )
}

export default SignUp
