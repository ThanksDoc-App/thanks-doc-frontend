import { cloneElement } from 'react'
import { useLocation } from 'react-router-dom'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Logo from '@/components/template/Logo'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
    const { pathname } = useLocation()

    const isSignin = pathname.toLowerCase().includes('sign-in')
    const isResetPassword = pathname.toLowerCase().includes('reset-password')

    return (
        <div className="flex items-center justify-center py-7">
            <Container className="flex flex-col items-center justify-center min-w-0 w-full px-4">
                <Card
                    className="min-w-[320px] md:min-w-[450px]"
                    bodyClass="md:p-10"
                >
                    <div className="text-center">
                        <Logo type="streamline" imgClass="mx-auto" />
                    </div>

                    {/* Conditionally show signup welcome text */}
                    {isSignin && (
                        <div className="mb-8 text-center">
                            <h3 className="mb-1 text-2xl font-semibold">
                                Welcome back!
                            </h3>
                            <p>Please enter your credentials to sign in!</p>
                        </div>
                    )}
                    {/* {isResetPassword && (
                        <div className="mb-8 text-center">
                            <h3 className="mb-1 text-2xl font-semibold">
                                Set new password
                            </h3>
                            <p>
                                Your new password must different to previous
                                password
                            </p>{' '}
                        </div>
                    )} */}

                    <div className="text-center">
                        {content}
                        {children
                            ? cloneElement(children as ReactElement, {
                                  contentClassName: 'text-center',
                                  ...rest,
                              })
                            : null}
                    </div>
                </Card>
            </Container>
        </div>
    )
}

export default Simple
