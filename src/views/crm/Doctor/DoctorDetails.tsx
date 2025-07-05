import React, { useState, useEffect } from 'react'
import { Star, Mail, Phone, X, FileText, Download, Eye } from 'lucide-react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { FaStar } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'
import { BsPhone } from 'react-icons/bs'
import { IoIosArrowForward } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const documents = [
    {
        id: 1,
        name: 'Right to Work in the UK (Passport/Visa if applicable)',
        type: 'PDF',
    },
    { id: 2, name: 'GP CV', type: 'PDF' },
    { id: 3, name: 'Occupational Health Clearance', type: 'PDF' },
    { id: 4, name: 'Professional References – 2 references', type: 'PDF' },
    { id: 5, name: 'Appraisal & Revalidation Evidence', type: 'PDF' },
    { id: 6, name: 'Mandatory Training Certificates', type: 'PDF' },
    { id: 7, name: 'DBS Certificate', type: 'PDF' },
    { id: 8, name: 'Medical Indemnity Insurance', type: 'PDF' },
]

const DoctorDetails = () => {
    const [doctor, setDoctor] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDocument, setSelectedDocument] =
        useState<DocumentItem | null>(null)

    const navigate = useNavigate()

    // const handleBack = () => {
    //     navigate(-1)
    // }

    interface DocumentItem {
        id: number
        name: string
        type: string
    }

    interface SelectedDocument extends DocumentItem {}

    const handleViewDocument = (document: DocumentItem): void => {
        setSelectedDocument(document)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedDocument(null)
    }

    const handleAccept = () => {
        console.log('Document accepted:', selectedDocument?.name)
        handleCloseModal()
    }

    const handleDecline = () => {
        console.log('Document declined:', selectedDocument?.name)
        handleCloseModal()
    }

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-6">
                <button
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <IoMdArrowRoundBack size={24} />
                    <span className="text-lg font-medium">Doctor Details</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-10 w-full gap-3 mt-5">
                <div className="md:col-span-3 border border-[#D6DDEB] p-5 h-fit">
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
                    <div className="border-b border-[#D6DDEB] py-3">
                        <p className="text-[#25324B] text-[14px] font-[600] mb-2">
                            Contact
                        </p>
                        <div className="flex gap-3">
                            <CiMail />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Email
                                </p>
                                <p className="text-[#25324B] text-[11.5px] break-all">
                                    jeromeBell45@email.com
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <BsPhone />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Phone
                                </p>
                                <p className="text-[#25324B] text-[11.5px]">
                                    +44 1245 5721 1353{' '}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-[#25324B] text-[14px] font-[600] mb-2">
                            Bank Details{' '}
                        </p>
                        <div className="flex gap-3">
                            <BsPhone />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Sort Code
                                </p>
                                <p className="text-[#25324B] text-[11.5px]">
                                    22-33-44{' '}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <BsPhone />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Account Number{' '}
                                </p>
                                <p className="text-[#25324B] text-[11.5px]">
                                    245572135{' '}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <BsPhone />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Account Name{' '}
                                </p>
                                <p className="text-[#25324B] text-[11.5px]">
                                    Jermoe Bell{' '}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Documents List */}
                <div className="md:col-span-7">
                    <div className="space-y-3">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow"
                            >
                                <p className="text-sm font-medium text-gray-800 flex-1">
                                    {document.name}
                                </p>
                                <button
                                    onClick={() => handleViewDocument(document)}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors w-full sm:w-auto"
                                >
                                    View
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#2155A329] bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-[90vw] md:max-w-[45vw] md:w-[45vw] p-5 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4">
                            <h3 className="text-[17px] font-semibold text-[#272D37]">
                                View Document
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" color="#0A1629" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 mt-[-20px]">
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-[#344054] mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={selectedDocument?.name || ''}
                                    readOnly
                                    className="w-full px-3 py-2 border border-[#D6DDEB] rounded-md text-[#25324B] text-[13px]"
                                />
                            </div>

                            <div className="flex items-center justify-between px-3 py-4 border border-gray-200 mb-6 w-fit">
                                <div className="flex items-center gap-4 ">
                                    {/* <FileText className="w-5 h-5 text-red-500" /> */}
                                    <span className="text-sm font-bold text-[#000000]">
                                        {selectedDocument?.type}
                                    </span>
                                    <span className="text-[#25324B] text-[13px] font-[500]">
                                        View Document
                                    </span>
                                    <IoIosArrowForward
                                        color="#25324B"
                                        size={20}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row h-[90px] gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 bg-[#0F9297] h-[40px] text-white rounded-md font-medium transition-colors"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 bg-[#DC3454] h-[40px] text-white rounded-md font-medium transition-colors"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DoctorDetails
