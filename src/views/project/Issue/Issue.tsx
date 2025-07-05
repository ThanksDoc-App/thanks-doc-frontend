import { useEffect, useState, useCallback, useRef, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Timeline from '@/components/ui/Timeline'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import RichTextEditor from '@/components/shared/RichTextEditor'
import IconText from '@/components/shared/IconText'
import {
    HiPencil,
    HiClock,
    HiCalendar,
    HiTag,
    HiTicket,
    HiUserCircle,
    HiLightningBolt,
    HiLocationMarker,
    HiArrowLeft,
} from 'react-icons/hi'
import {
    apiGetScrumBoardtTicketDetail,
    apiAcceptJob,
} from '@/services/ProjectService'
import ReactHtmlParser from 'html-react-parser'
import isLastChild from '@/utils/isLastChild'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import type { AvatarProps } from '@/components/ui/Avatar'
import type { TimeLineItemProps } from '@/components/ui/Timeline'

type Activity = {
    type: string
    name: string
    time: string
    img?: string
    assignees?: string[]
    labels?: {
        title: string
        class: string
    }[]
    comment?: string
}

type TicketDetail = {
    _id?: string
    name?: string
    service?: {
        _id: string
        name: string
    }
    category?: {
        _id: string
        name: string
    }
    businessOwner?: {
        _id: string
        name: string
        email: string
        profileImage?: {
            url: string
            public_id: string
        }
    }
    status?: string
    amount?: number
    currency?: string
    description?: string
    location?: {
        country: string
        state: string
        city: string
        zipCode: string
    }
    time?: string
    date?: string
    createdAt?: string
    updatedAt?: string
}

type GetScrumBoardtTicketDetailResponse = {
    status: boolean
    statusCode: number
    message: string
    data: TicketDetail
}

const Issue = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [data, setData] = useState<TicketDetail>({})
    const [loading, setLoading] = useState(true)
    const [acceptLoading, setAcceptLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const commentInput = useRef<HTMLInputElement>(null)

    const debounceFn = debounce(handleDebounceFn, 1000)

    function handleDebounceFn(val: string) {
        setData((prevState) => ({ ...prevState, ...{ description: val } }))
    }

    useEffect(() => {
        if (id) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchData = useCallback(async () => {
        if (!id) return

        setLoading(true)
        try {
            const resp = await apiGetScrumBoardtTicketDetail(id)
            if (resp.data && resp.data.status) {
                setData(resp.data.data)
            }
        } catch (error) {
            console.error('Error fetching job details:', error)
        } finally {
            setLoading(false)
        }
    }, [id])

    const handleAcceptJob = async () => {
        if (!id) return

        setAcceptLoading(true)
        try {
            const resp = await apiAcceptJob(id)
            if (resp.data && resp.data.status) {
                // Update local state to reflect acceptance
                setData((prevData) => ({ ...prevData, status: 'accepted' }))

                // Show success toast notification
                toast.success('Job accepted successfully! 🎉', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                })

                console.log('Job accepted successfully')
                navigate('/app/project/dashboard')
            }
        } catch (error) {
            console.error('Error accepting job:', error)

            // Show error toast notification
            toast.error('Failed to accept job. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        } finally {
            setAcceptLoading(false)
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Date not available'
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const formatLocation = (location?: TicketDetail['location']) => {
        if (!location) return '22B Ealing Road, London, W1 3AD'
        return `${location.city || ''}, ${location.state || ''}, ${
            location.country || ''
        }`.replace(/^,\s*|,\s*$/g, '')
    }

    const handleGoBack = () => {
        navigate(-1) // Go back to previous page
    }

    return (
        <Container className="h-full">
            {/* Back Button */}
            <div className="mb-6">
                <Button
                    variant="plain"
                    size="sm"
                    icon={<HiArrowLeft />}
                    onClick={handleGoBack}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Back
                </Button>
            </div>

            <Loading loading={loading}>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <AdaptableCard rightSideBorder bodyClass="p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="mb-2 font-bold">
                                        {data.service?.name ||
                                            data.name ||
                                            'Job Title'}
                                    </h3>
                                    <p>
                                        {formatLocation(data.location)} •{' '}
                                        <span className="font-semibold text-gray-900 dark:text-gray-100 mx-1 cursor-pointer">
                                            {data.amount
                                                ? `${data.amount} ${
                                                      data.currency || 'GBP'
                                                  }`
                                                : '200 GBP'}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                    <Button
                                        variant="solid"
                                        className="w-full max-w-xs md:w-auto"
                                        onClick={handleAcceptJob}
                                        loading={acceptLoading}
                                        disabled={data.status === 'accepted'}
                                    >
                                        {data.status === 'accepted'
                                            ? 'Accepted'
                                            : 'Accept'}
                                    </Button>
                                    <Button
                                        variant="plain"
                                        className="w-full max-w-xs md:w-auto"
                                        disabled={data.status === 'accepted'}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </div>
                            <hr className="my-6" />
                            <div className="text-base">
                                <div className="prose dark:prose-invert max-w-none">
                                    {ReactHtmlParser(
                                        data.description ||
                                            'No description available',
                                    )}
                                </div>
                            </div>
                        </AdaptableCard>
                    </div>
                    <div>
                        <AdaptableCard bodyClass="p-5">
                            <h4 className="mb-6">Details</h4>
                            <IconText
                                className="mb-4"
                                icon={<HiClock className="text-lg" />}
                            >
                                <span className="font-semibold">
                                    {data.time || '2 Hours'}
                                </span>
                            </IconText>
                            <IconText
                                className="mb-4"
                                icon={
                                    <HiTicket className="text-lg opacity-70" />
                                }
                            >
                                <span className="font-semibold cursor-pointer">
                                    {data.amount
                                        ? `${data.amount} ${
                                              data.currency || 'GBP'
                                          }`
                                        : '200 GBP'}
                                </span>
                            </IconText>
                            <IconText
                                className="mb-4"
                                icon={
                                    <HiLocationMarker className="text-lg opacity-70" />
                                }
                            >
                                <span className="font-semibold">
                                    {formatLocation(data.location)}
                                </span>
                            </IconText>
                            <IconText
                                className="mb-4"
                                icon={
                                    <HiCalendar className="text-lg opacity-70" />
                                }
                            >
                                <span className="font-semibold">
                                    Date posted {formatDate(data.createdAt)}
                                </span>
                            </IconText>
                            {data.businessOwner && (
                                <>
                                    <hr className="my-6" />
                                    <p className="font-semibold mb-4">
                                        Posted by
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            size="sm"
                                            src={
                                                data.businessOwner.profileImage
                                                    ?.url
                                            }
                                            alt={data.businessOwner.name}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                {data.businessOwner.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {data.businessOwner.email}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                            <hr className="my-6" />
                            <p className="font-semibold mb-4 mt-8">
                                Categories
                            </p>
                            {data.category && (
                                <Tag className="mr-2 rtl:ml-2 cursor-pointer">
                                    {data.category.name}
                                </Tag>
                            )}
                            {data.status && (
                                <>
                                    <p className="font-semibold mb-4 mt-6">
                                        Status
                                    </p>
                                    <Tag
                                        className={`mr-2 rtl:ml-2 ${
                                            data.status === 'pending'
                                                ? 'text-amber-600 bg-amber-100'
                                                : data.status === 'accepted'
                                                  ? 'text-green-600 bg-green-100'
                                                  : 'text-gray-600 bg-gray-100'
                                        }`}
                                    >
                                        {data.status}
                                    </Tag>
                                </>
                            )}
                        </AdaptableCard>
                    </div>
                </div>
            </Loading>
        </Container>
    )
}

export default Issue
