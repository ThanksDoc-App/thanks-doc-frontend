import Simple from '@/components/layouts/AuthLayout/Simple'
import ResetPasswordForm from './ResetPasswordForm'

const ResetPassword = () => {
    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <Simple>
                <ResetPasswordForm disableSubmit={false} />
            </Simple>
        </div>
    )
}

export default ResetPassword
