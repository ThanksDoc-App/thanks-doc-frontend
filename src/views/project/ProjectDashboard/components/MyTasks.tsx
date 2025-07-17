import { useMemo, useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/ui/Input'
import InputGroup from '@/components/ui/InputGroup'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import ActionLink from '@/components/shared/ActionLink'
import { useAppDispatch } from '@/store'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getUserProfile } from '@/views/account/Settings/store/SettingsSlice'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table'

type Task = {
    taskId: string
    taskSubject: string
    priority: number
    date?: string
    amount?: number
    location?: string
    assignees: {
        id: string
        name: string
        email: string
        img: string
    }[]
}

type MyTasksProps = {
    data?: Task[]
}

const { Tr, Th, Td, THead, TBody } = Table

const PriorityTag = ({ priority }: { priority: number }) => {
    switch (priority) {
        case 0:
            return (
                <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 rounded-sm border-0">
                    High
                </Tag>
            )
        case 1:
            return (
                <Tag className="text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20 rounded-sm border-0">
                    Medium
                </Tag>
            )
        case 2:
            return (
                <Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 rounded-sm border-0">
                    Low
                </Tag>
            )
        default:
            return null
    }
}

const MyTasks = ({ data = [] }: MyTasksProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [searchTerm, setSearchTerm] = useState('')
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    // Get profile data from Redux
    const { profileData, getProfileLoading } = useSelector(
        (state: RootState) => state.settings,
    )

    // Fetch profile data on component mount
    useEffect(() => {
        if (!profileData) {
            dispatch(getUserProfile())
        }
    }, [dispatch, profileData])

    // Extract user location for prefilling search on initial load only
    useEffect(() => {
        if (profileData?.data?.location && isInitialLoad) {
            const { location } = profileData.data
            // Use address1 and zipCode as per your requirement
            const locationString = [location.city].filter(Boolean).join(', ')

            if (locationString) {
                setSearchTerm(locationString)
            }
            setIsInitialLoad(false) // Mark initial load as complete
        }
    }, [profileData, isInitialLoad])

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) {
            return data
        }
        const searchLower = searchTerm.toLowerCase()
        return data.filter((task) => {
            return (
                task.taskSubject?.toLowerCase().includes(searchLower) ||
                task.location?.toLowerCase().includes(searchLower)
            )
        })
    }, [data, searchTerm])

    const columns: ColumnDef<Task>[] = useMemo(
        () => [
            {
                header: 'Job',
                accessorKey: 'taskSubject',
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: (props) => {
                    const { location } = props.row.original
                    return (
                        <span>
                            {location || '22B Ealing Road, London, W1 3AD'}
                        </span>
                    )
                },
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: (props) => {
                    const { amount } = props.row.original
                    return <span>{amount ? `${amount} GBP` : '200 GBP'}</span>
                },
            },
            {
                header: 'Date Posted',
                accessorKey: 'date',
                cell: (props) => {
                    const { date } = props.row.original
                    return <span>{date || '10 July, 2025'}</span>
                },
            },
            {
                header: 'Action',
                accessorKey: 'Action',
                cell: (props) => (
                    <Button
                        size="sm"
                        color="primary"
                        onClick={() =>
                            onViewJobDetails(props.row.original.taskId)
                        }
                    >
                        Details
                    </Button>
                ),
            },
        ],
        [],
    )

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const onViewAllTask = () => {
        navigate('/app/project/job-details')
    }

    const onViewJobDetails = (id: string) => {
        navigate(`/app/project/job-details/${id}`)
    }

    const handleSearch = () => {
        console.log('Searching for:', searchTerm)
        // Add your search logic here
    }

    // Create placeholder text from user location or use default

    // Handle input change - allows clearing and typing new values
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>Explore Jobs ({filteredData.length})</h4>
            </div>
            <InputGroup className="mb-4">
                <Input
                    prefix={
                        <HiOutlineLocationMarker className="text-xl text-indigo-600 cursor-pointer" />
                    }
                    placeholder="Enter a city"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch()
                        }
                    }}
                />
                <Button color="primary" onClick={handleSearch}>
                    Search
                </Button>
            </InputGroup>
            <Table className="whitespace-nowrap">
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.length === 0 ? (
                        <Tr>
                            <Td
                                colSpan={columns.length}
                                className="text-center py-8"
                            >
                                <span className="text-gray-400">
                                    {searchTerm
                                        ? `No jobs found matching "${searchTerm}"`
                                        : 'No jobs found'}
                                </span>
                            </Td>
                        </Tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    )}
                </TBody>
            </Table>
        </Card>
    )
}

export default MyTasks
