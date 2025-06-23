import { useEffect, useState, useCallback, useRef, Fragment } from 'react'
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
} from 'react-icons/hi'
import { apiGetScrumBoardtTicketDetail } from '@/services/ProjectService'
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
    ticketId?: string
    title?: string
    createdBy?: string
    underProject?: string
    description?: string
    date?: string
    location?: string
    assignees?: {
        id: string
        name: string
        email: string
        img: string
    }[]
    labels?: {
        title: string
        class: string
    }[]
    activity?: Activity[]
}

type GetScrumBoardtTicketDetailResponse = TicketDetail

const Issue = () => {
    const [data, setData] = useState<TicketDetail>({})
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)

    const commentInput = useRef<HTMLInputElement>(null)

    const debounceFn = debounce(handleDebounceFn, 1000)

    function handleDebounceFn(val: string) {
        setData((prevState) => ({ ...prevState, ...{ description: val } }))
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true)
        const resp =
            await apiGetScrumBoardtTicketDetail<GetScrumBoardtTicketDetailResponse>()
        setData(resp.data)
        setLoading(false)
    }, [])

    return (
        <Container className="h-full">
            hghgh
            <Loading loading={loading}>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <AdaptableCard rightSideBorder bodyClass="p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="mb-2 font-bold">
                                        {data.title}
                                    </h3>
                                    <p>
                                        22B Ealing Road, London, W1 3AD •{' '}
                                        <span className="font-semibold text-gray-900 dark:text-gray-100 mx-1 cursor-pointer">
                                            200 GBP
                                        </span>
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                    <Button
                                        variant="solid"
                                        className="w-full max-w-xs md:w-auto"
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="plain"
                                        className="w-full max-w-xs md:w-auto"
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </div>
                            <hr className="my-6" />
                            <div className="text-base">
                                <div className="prose dark:prose-invert max-w-none">
                                    {ReactHtmlParser(data.description || '')}
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
                                <span className="font-semibold">2 Hours</span>
                            </IconText>
                            <IconText
                                className="mb-4"
                                icon={
                                    <HiTicket className="text-lg opacity-70" />
                                }
                            >
                                <span className="font-semibold cursor-pointer">
                                    200 GBP
                                </span>
                            </IconText>
                            <IconText
                                className="mb-4"
                                icon={
                                    <HiLocationMarker className="text-lg opacity-70" />
                                }
                            >
                                <span className="font-semibold">
                                    {data.location ||
                                        '22B Ealing Road, London, W1 3AD'}
                                </span>
                            </IconText>
                            <IconText
                                className="mb-4"
                                icon={
                                    <HiCalendar className="text-lg opacity-70" />
                                }
                            >
                                <span className="font-semibold">
                                    Date posted {data.date}
                                </span>
                            </IconText>
                            <hr className="my-6" />
                            <p className="font-semibold mb-4 mt-8">
                                Categories
                            </p>
                            {data.labels?.map((label) => (
                                <Tag
                                    key={label.title}
                                    prefix
                                    className="mr-2 rtl:ml-2 cursor-pointer"
                                    prefixClass={label.class}
                                >
                                    {label.title}
                                </Tag>
                            ))}
                        </AdaptableCard>
                    </div>
                </div>
            </Loading>
        </Container>
    )
}

export default Issue
