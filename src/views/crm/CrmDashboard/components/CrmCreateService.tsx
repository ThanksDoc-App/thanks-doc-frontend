import { Button } from '@/components/ui'
import React from 'react'
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const CrmCreateService = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className="ml-[-26px]">
                <Button
                    className="flex items-center justify-center gap-2 border-0 "
                    onClick={() => navigate(-1)}
                >
                    <IoMdArrowRoundBack size={30} color="#25324B" />
                    <span className="text-[#25324B] text-[18px]">
                        Create a service{' '}
                    </span>
                </Button>
            </div>
            <div className="mt-7">
                <form action="" className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[#515B6F] font-[15px] font-[600]">
                            Select a Category{' '}
                        </label>
                        <select
                            className="border-[#D6DDEB] border placeholder:text-[#A8ADB7] text-[13px] h-[40px] pl-1.5 outline-0"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            <option value="engineering">Engineering</option>
                            <option value="design">Design</option>
                            <option value="marketing">Marketing</option>
                            <option value="sales">Sales</option>
                            <option value="product">Product Management</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[#515B6F] font-[15px] font-[600]">
                            Enter Job
                        </label>
                        <input
                            type="text"
                            placeholder="Enter service title"
                            className="border-[#D6DDEB] border placeholder:text-[#A8ADB7] text-[13px] h-[40px] pl-2 outline-0"
                        />
                    </div>
                    <Button
                        variant="solid"
                        className="w-[207px] mt-4"
                        // onClick={() => navigate('/app/sales/product-new')}
                    >
                        Create a service{' '}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CrmCreateService
