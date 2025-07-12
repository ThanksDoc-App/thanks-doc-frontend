import React, { useState, useRef, useEffect } from 'react'
import { ListFilter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui'
import { FaArrowUpLong } from 'react-icons/fa6'

interface SearchAndFilterProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    onFilterClick: () => void
    selectedFilter?: string
    onFilterChange?: (filter: string) => void
}

const DoctorTool = ({
    searchTerm,
    onSearchChange,
    onFilterClick,
    selectedFilter = 'This Week',
    onFilterChange,
}: SearchAndFilterProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // ✅ Fixed filter options to match API expectations
    const filterOptions = [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
    ]

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleFilterSelect = (filter: string) => {
        if (onFilterChange) {
            onFilterChange(filter)
        }
        setIsDropdownOpen(false)
    }

    return (
        <div className="flex md:flex-row flex-col items-center justify-center gap-6">
            {/* Search Component */}

            {/* Filter Component with Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <div
                    className="flex items-center justify-between gap-2 md:w-[140px] w-full h-[45px] bg-white border border-[#D6DDEB] whitespace-nowrap px-3 transition-colors cursor-pointer hover:border-[#0F9297]"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <div className="flex items-center gap-2">
                        <ListFilter className="w-5 h-5 text-[#25324B]" />
                        <span className="text-sm font-medium text-[#25324B]">
                            {selectedFilter}
                        </span>
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-[#25324B] transition-transform ${
                            isDropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#D6DDEB] rounded-md shadow-lg z-10">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleFilterSelect(option.label)}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors  ${
                                    selectedFilter === option.label
                                        ? 'bg-[#F0F9FF] text-[#0F9297] font-medium'
                                        : 'text-[#25324B]'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Button
                variant="solid"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2"
                // onClick={() => navigate('/app/crm/create-service')}
            >
                <FaArrowUpLong size={17} />
                <span className="whitespace-nowrap">Export to excel</span>
            </Button>
        </div>
    )
}

export default DoctorTool
