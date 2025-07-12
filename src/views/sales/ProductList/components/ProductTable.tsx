import { useEffect, useMemo, useRef, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import {
    getProducts,
    setTableData,
    setSelectedProduct,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { updateJobStatus } from '../store/salesProductListSlice' // ✅ Import the updateJobStatus action
import useThemeClass from '@/utils/hooks/useThemeClass'
import ProductDeleteConfirmation from './ProductDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'

type Product = {
    id: string
    name: string
    productCode: string
    img: string
    category: string
    price: number
    stock: number
    status: number
}

const inventoryStatusColor: Record<
    number,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    0: {
        label: 'Active',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    1: {
        label: 'Pending',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    2: {
        label: 'Completed', // ✅ Changed from 'Closed' to 'Completed'
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500',
    },
}

const ActionColumn = ({ row }: { row: Product }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false)

    // ✅ Get updating status from Redux store
    const updatingStatus = useAppSelector(
        (state) => state.salesProductList.updatingStatus,
    )

    const onEdit = () => {
        navigate(`/app/sales/product-edit/${row.id}`)
        setShowDropdown(false)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedProduct(row.id))
        setShowDropdown(false)
    }

    const onView = () => {
        navigate(`/app/sales/order-details/${row.id}`)
        setShowDropdown(false)
    }

    // ✅ Handle mark as completed
    const onMarkAsCompleted = async () => {
        try {
            await dispatch(
                updateJobStatus({
                    id: row.id,
                    status: 'completed',
                }),
            ).unwrap()

            toast.push(
                <Notification title="Success" type="success" duration={2500}>
                    Job marked as completed successfully
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    Failed to update job status
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
        setShowDropdown(false)
    }

    return (
        <div className="flex justify-end text-lg relative">
            <span
                className="cursor-pointer p-2 hover:text-gray-600"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <BsThreeDotsVertical />
            </span>

            {/* ✅ Dropdown Menu */}
            {showDropdown && (
                <div className="absolute right-0 top-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="py-1">
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={onView}
                        >
                            <HiOutlineEye className="inline mr-2" />
                            View Details
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={onEdit}
                        >
                            <HiOutlinePencil className="inline mr-2" />
                            Edit
                        </button>

                        {/* ✅ Mark as Completed option - only show if not already completed */}
                        {row.status !== 2 && (
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 disabled:opacity-50"
                                onClick={onMarkAsCompleted}
                                disabled={updatingStatus}
                            >
                                {updatingStatus
                                    ? 'Updating...'
                                    : 'Mark as Completed'}
                            </button>
                        )}

                        <hr className="my-1" />
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={onDelete}
                        >
                            <HiOutlineTrash className="inline mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {/* ✅ Click outside to close dropdown */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    )
}

const ProductColumn = ({ row }: { row: Product }) => {
    const avatar = row.img ? (
        <Avatar src={row.img} />
    ) : (
        <Avatar icon={<FiPackage />} />
    )

    return (
        <div className="flex items-center">
            <span className="font-semibold">{row.name}</span>
        </div>
    )
}

const ProductTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesProductList.data.tableData,
    )

    const filterData = useAppSelector(
        (state) => state.salesProductList.data.filterData,
    )

    const loading = useAppSelector(
        (state) => state.salesProductList.data.loading,
    )

    const data = useAppSelector(
        (state) => state.salesProductList.data.productList,
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSorting()
        }
    }, [filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total],
    )

    const fetchData = () => {
        dispatch(getProducts({ pageIndex, pageSize, sort, query, filterData }))
    }

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: 'Jobs',
                accessorKey: 'jobs',
                cell: (props) => {
                    const row = props.row.original
                    return <ProductColumn row={row} />
                },
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.category}</span>
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Badge
                                className={
                                    inventoryStatusColor[status].dotClass
                                }
                            />
                            <span
                                className={`capitalize font-semibold ${inventoryStatusColor[status].textClass}`}
                            >
                                {inventoryStatusColor[status].label}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: (props) => {
                    const { price } = props.row.original
                    return <span>{price} GBP</span>
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        [],
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            <ProductDeleteConfirmation />
        </>
    )
}

export default ProductTable
