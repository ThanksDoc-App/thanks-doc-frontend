import React from 'react'

const SkeletonTable = ({ className }: any) => {
    return (
        <div className={`w-full mx-auto ${className}`}>
            <div className="overflow-x-auto scrollbar-hidden">
                <table className="min-w-[700px] w-full border border-[#D6DDEB]">
                    <thead className="border-b border-gray-200">
                        <tr>
                            {/* <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Category
                            </th> */}
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Generate skeleton rows */}
                        {Array.from({ length: 10 }).map((_, index) => (
                            <tr
                                key={index}
                                className={`text-[13px] whitespace-nowrap cursor-pointer transition-colors ${
                                    (index + 1) % 2 === 0
                                        ? 'bg-[#F8F8FD] dark:bg-transparent'
                                        : ''
                                }`}
                            >
                                <td className="px-6 py-4">
                                    <div className="animate-pulse">
                                        <div
                                            className="h-4 bg-gray-200 rounded"
                                            style={{
                                                width: `${
                                                    Math.random() * 100 + 80
                                                }px`,
                                            }}
                                        ></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="animate-pulse">
                                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Skeleton Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border border-[#D6DDEB]">
                {/* View dropdown skeleton */}
                <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#8c91a0]">View</span>
                    <div className="animate-pulse">
                        <div className="w-12 h-8 bg-gray-200 rounded border"></div>
                    </div>
                </div>

                {/* Page navigation skeleton */}
                <div className="flex items-center gap-2">
                    <div className="animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                    <div className="animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonTable
