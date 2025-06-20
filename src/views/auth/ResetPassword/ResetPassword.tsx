import Simple from '@/components/layouts/AuthLayout/Simple'
import ResetPasswordForm from './ResetPasswordForm'

const ResetPassword = () => {
    return (
        <Simple>
            <ResetPasswordForm disableSubmit={false} />
        </Simple>
    )
}

export default ResetPassword
