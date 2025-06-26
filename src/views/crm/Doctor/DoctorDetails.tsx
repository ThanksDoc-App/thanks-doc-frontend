import React, { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'
import { BsPhone } from 'react-icons/bs'

import { useParams, useNavigate } from 'react-router-dom'
import {
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    Briefcase,
    Smartphone,
} from 'lucide-react'
import { DoctorJob } from './doctorData'
import { Button } from '@/components/ui'
import { IoMdArrowRoundBack } from 'react-icons/io'

const DoctorDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [doctor, setDoctor] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const foundDoctor = DoctorJob.find((doc) => doc.id === parseInt(id))
        if (foundDoctor) {
            setDoctor(foundDoctor)
        }
        setLoading(false)
    }, [id])

    const handleBack = () => {
        navigate('/app/crm/doctor')
    }

    return (
        <div>
            <div className="ml-[-26px]">
                <Button
                    className="flex items-center justify-center gap-2 border-0"
                    onClick={() => navigate(-1)}
                >
                    <IoMdArrowRoundBack size={30} color="#25324B" />
                    <span className="text-[#25324B] text-[18px]">
                        Doctor Details{' '}
                    </span>
                </Button>
            </div>{' '}
            <div className="grid grid-cols-10 w-full gap-3 mt-5">
                <div className="col-span-3 border border-[#D6DDEB] p-5 h-[300px]">
                    <div className="flex items-center gap-4">
                        {' '}
                        <div>
                            <img
                                src="/public/img/avatars/Avatar.png"
                                alt=""
                                className="w-[65px] h-[65px] object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[#25324B] text-[18px] font-bold">
                                Dr Jerome Bell
                            </p>
                            <p className="text-[#7C8493] text-[12px]">
                                Medical Doctor
                            </p>
                            <div className="flex items-center gap-1">
                                <FaStar color="#FFB836" />
                                <p className="text-[12px] font-[500] text-[#25324B]">
                                    4.0
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[#0F9297] text-[11px] font-[400] mt-2 border-b border-[#D6DDEB] py-3">
                        Paediatrician
                    </p>
                    <div className="mt-3">
                        <p className="text-[#25324B] text-[14px] font-[600] mb-2">
                            Contact
                        </p>
                        <div className="flex gap-3">
                            <CiMail />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Email
                                </p>
                                <p className="text-[#25324B] text-[11.5px]">
                                    jeromeBell45@email.com
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <BsPhone />{' '}
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Phone
                                </p>
                                <p className="text-[#25324B] text-[11.5px]">
                                    +44 1245 572 135{' '}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-7 ">
                    <div className="flex items-center justify-between border border-[#D6DDEB] rounded-sm  p-5 mb-4">
                        <p className="text-[#25324B] text-[14px] font-[600]">
                            Right to Work in the UK (Passport/Visa if
                            applicable)
                        </p>
                        <button className="bg-[#0F9297] h-[30px] text-white w-[70px] rounded-sm text-[14px] font-[600]">
                            View
                        </button>
                    </div>
                    <div className="flex items-center justify-between border border-[#D6DDEB] rounded-sm  p-5 mb-4">
                        <p className="text-[#25324B] text-[14px] font-[600]">
                            GP CV{' '}
                        </p>
                        <button className="bg-[#0F9297] h-[30px] text-white w-[70px] rounded-sm text-[14px] font-[600]">
                            View
                        </button>
                    </div>
                    <div className="flex items-center justify-between border border-[#D6DDEB] rounded-sm  p-5 mb-4">
                        <p className="text-[#25324B] text-[14px] font-[600]">
                            Occupational Health Clearance
                        </p>
                        <button className="bg-[#0F9297] h-[30px] text-white w-[70px] rounded-sm text-[14px] font-[600]">
                            View
                        </button>
                    </div>
                    <div className="flex items-center justify-between border border-[#D6DDEB] rounded-sm  p-5 mb-4">
                        <p className="text-[#25324B] text-[14px] font-[600]">
                            Professional References – 2 references
                        </p>
                        <button className="bg-[#0F9297] h-[30px] text-white w-[70px] rounded-sm text-[14px] font-[600]">
                            View
                        </button>
                    </div>
                    <div className="flex items-center justify-between border border-[#D6DDEB] rounded-sm  p-5 mb-4">
                        <p className="text-[#25324B] text-[14px] font-[600]">
                            Appraisal & Revalidation Evidence
                        </p>
                        <button className="bg-[#0F9297] h-[30px] text-white w-[70px] rounded-sm text-[14px] font-[600]">
                            View
                        </button>
                    </div>
                    <div className="flex items-center justify-between border border-[#D6DDEB] rounded-sm  p-5 mb-4">
                        <p className="text-[#25324B] text-[14px] font-[600]">
                            Mandatory Training Certificates
                        </p>
                        <button className="bg-[#0F9297] h-[30px] text-white w-[70px] rounded-sm text-[14px] font-[600]">
                            View
                        </button>
                    </div>
                    <div className="flex items-center justify-between border border-[#D6DDEB] rounded-sm  p-5 mb-4">
                        <p className="text-[#25324B] text-[14px] font-[600]">
                            Right to Work in the UK (Passport/Visa if
                            applicable)
                        </p>
                        <button className="bg-[#0F9297] h-[30px] text-white w-[70px] rounded-sm text-[14px] font-[600]">
                            View
                        </button>
                    </div>
                    <div className="flex items-center justify-between border border-[#D6DDEB] rounded-sm  p-5 mb-4">
                        <p className="text-[#25324B] text-[14px] font-[600]">
                            Right to Work in the UK (Passport/Visa if
                            applicable)
                        </p>
                        <button className="bg-[#0F9297] h-[30px] text-white w-[70px] rounded-sm text-[14px] font-[600]">
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorDetails
