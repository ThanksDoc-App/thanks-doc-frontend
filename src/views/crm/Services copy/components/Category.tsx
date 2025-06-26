import React from 'react'
import ServiceTable from './ServiceTable'
import { useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { Button } from '@/components/ui'

const Service = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
                <h3>Services</h3>
                <Button
                    variant="solid"
                    className="w-full md:w-auto flex items-center justify-center gap-2"
                    onClick={() => navigate('/app/crm/create-service')}
                >
                    <FiPlus size={20} />
                    Create a service{' '}
                </Button>
            </div>

            <ServiceTable />
        </div>
    )
}

export default Service
