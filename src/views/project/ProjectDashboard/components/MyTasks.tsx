import { useMemo } from 'react'
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
    location?: string // Add location property
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
        const navigate = useNavigate();
    
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
                    return <span>{location || '22B Ealing Road, London, W1 3AD'}</span>
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
            // {
            //     header: 'Status',
            //     accessorKey: 'priority',
            //     cell: (props) => {
            //         const { priority } = props.row.original
            //         return <PriorityTag priority={priority} />
            //     },
            // },
            {
                header: 'Action',
                accessorKey: 'Action',
                cell: (props) => (
                    <Button
                        size="sm"
                        color="primary"
                        onClick={onViewAllTask}
                    >
                        Details
                    </Button>
                ),
            },
        ],
        [],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const onViewAllTask = () => {
        navigate('/app/project/issue')
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>Explore Jobs</h4>
            </div>
            <InputGroup className="mb-4">
                <Input
                    prefix={
                        <HiOutlineLocationMarker className="text-xl text-indigo-600 cursor-pointer" />
                    }
                    placeholder="Enter postcode or location..."
                />
                 <Button color="primary">Search</Button>
            </InputGroup>
            <Table>
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
                            <Td colSpan={columns.length} className="text-center py-8">
                                <span className="text-gray-400">No tasks found.</span>
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
