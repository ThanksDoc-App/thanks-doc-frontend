import SignUpForm from '@/views/auth/SignUp/SignUpForm'
import Side from '@/components/layouts/AuthLayout/Side'

const SignUpSide = () => {
    return (
        <Side
            content={
                <>
                    <h3 className="mb-1">Sign Up</h3>
                    <p>And start getting Doctors around you</p>
                </>
            }
        >
            <SignUpForm disableSubmit={true} signInUrl="/auth/sign-in-side" />
        </Side>
    )
}

export default SignUpSide
