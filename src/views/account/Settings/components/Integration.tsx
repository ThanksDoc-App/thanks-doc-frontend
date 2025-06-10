import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Switcher from '@/components/ui/Switcher'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import isEmpty from 'lodash/isEmpty'
import { apiGetAccountSettingIntegrationData } from '@/services/AccountServices'
import cloneDeep from 'lodash/cloneDeep'

type IntegrationDetail = {
    name: string
    desc: string
    img: string
    type: string
    active: boolean
    installed?: boolean
}

type IntegrationType = {
    installed: IntegrationDetail[]
    available: IntegrationDetail[]
}

type GetAccountSettingIntegrationDataResponse = IntegrationType

const Integration = () => {
    const [data, setData] = useState<Partial<IntegrationType>>({})
    const [viewIntegration, setViewIntegration] = useState(false)
    const [intergrationDetails, setIntergrationDetails] = useState<
        Partial<IntegrationDetail>
    >({})
    const [installing, setInstalling] = useState(false)

    const fetchData = async () => {
        const response =
            await apiGetAccountSettingIntegrationData<GetAccountSettingIntegrationDataResponse>()
        setData(response.data)
    }

    useEffect(() => {
        if (isEmpty(data)) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleToggle = (
        bool: boolean,
        name: string,
        category: keyof IntegrationType,
    ) => {
        setData((prevState) => {
            const nextState = cloneDeep(prevState as IntegrationType)
            const nextCategoryValue = (prevState as IntegrationType)[
                category
            ].map((app) => {
                if (app?.name === name) {
                    app.active = !bool
                }
                return app
            })
            nextState[category] = nextCategoryValue
            return nextState
        })
    }

    const onViewIntegrationOpen = (
        details: IntegrationDetail,
        installed: boolean,
    ) => {
        setViewIntegration(true)
        setIntergrationDetails({ ...details, installed })
    }

    const onViewIntegrationClose = () => {
        setViewIntegration(false)
    }

    const handleInstall = (details: IntegrationDetail) => {
        setInstalling(true)
        setTimeout(() => {
            setData((prevState) => {
                const nextState = cloneDeep(prevState)
                const nextAvailableApp = prevState?.available?.filter(
                    (app) => app.name !== details.name,
                )
                nextState.available = nextAvailableApp
                nextState?.installed?.push(details)
                return nextState
            })
            setInstalling(false)
            onViewIntegrationClose()
            toast.push(<Notification title="App installed" type="success" />, {
                placement: 'top-center',
            })
        }, 1000)
    }

    return (
        <>
            <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg">My Documents</h4>
            </div>
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">
                    {data?.available?.map((app) => (
                            <Card
                                key={app.name}
                                bodyClass="p-0"
                                footerClass="flex justify-end p-2"
                                footer={
                                    <Button
                                        variant="plain"
                                        size="sm"
                                        onClick={() =>
                                            onViewIntegrationOpen(app, false)
                                        }
                                    >
                                        View Document
                                    </Button>
                                }
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Avatar
                                                className="bg-transparent dark:bg-transparent"
                                                src={app.img}
                                            />
                                            <div className="ltr:ml-2 rtl:mr-2">
                                                <h6>{app.name}</h6>
                                            </div>
                                        </div>
                                        {/* Tag added here */}
                                        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                                            {app.type}
                                        </span>
                                    </div>
                                    <p className="mt-6">{app.desc}</p>
                                </div>
                            </Card>
                    ))}
                </div>
            </div>
            <Dialog
                width={650}
                isOpen={viewIntegration}
                onClose={onViewIntegrationClose}
                onRequestClose={onViewIntegrationClose}
            >
                <div className="flex items-center">
                    <Avatar
                        className="bg-transparent dark:bg-transparent"
                        src={intergrationDetails.img}
                    />
                    <div className="ltr:ml-3 rtl:mr-3">
                        <h6>{intergrationDetails.name}</h6>
                        <span>{intergrationDetails.type}</span>
                    </div>
                </div>
                <div className="mt-6">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        Preview of {intergrationDetails.name}
                    </span>
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onViewIntegrationClose}
                    >
                        Cancel
                    </Button>
                    {intergrationDetails?.installed ? (
                        <Button disabled variant="solid">
                            Update
                        </Button>
                    ) : (
                        <Button
                            variant="solid"
                            loading={installing}
                        >
                            Update
                        </Button>
                    )}
                </div>
            </Dialog>
        </>
    )
}

export default Integration
