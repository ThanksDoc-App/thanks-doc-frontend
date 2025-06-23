import React from 'react'
import { ListFilter, Search } from 'lucide-react'

interface SearchAndFilterProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    onFilterClick: () => void
}

const JobHistoryTool = ({
    searchTerm,
    onSearchChange,
    onFilterClick,
}: SearchAndFilterProps) => {
    return (
        <div className="flex md:flex-row flex-col items-center justify-center gap-6 mb-8">
            {/* Search Component */}
            <div className="flex items-center justify-center gap-2 md:w-[125px] w-full h-[50px] bg-white border border-[#D6DDEB] p-2 transition-colors">
                <Search className="text-[#25324B] w-5 h-5 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full text-sm font-medium text-gray-700 placeholder-[#25324B] bg-transparent border-none outline-none"
                />
            </div>

            {/* Filter Component */}
            <div
                className="flex items-center justify-center gap-2 md:w-[125px] w-full h-[50px] bg-white border border-[#D6DDEB] transition-colors cursor-pointer"
                onClick={onFilterClick}
            >
                <ListFilter className="w-5 h-5 text-[#25324B]" />
                <span className="text-sm font-medium text-[#25324B]">
                    Filter
                </span>
            </div>
        </div>
    )
}

export default JobHistoryTool
