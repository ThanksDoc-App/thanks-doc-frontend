import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Segment from '@/components/ui/Segment'
import Badge from '@/components/ui/Badge'
import Loading from '@/components/shared/Loading'
import Chart from '@/components/shared/Chart'
import { COLORS } from '@/constants/chart.constant'
import isEmpty from 'lodash/isEmpty'
import { useAppSelector } from '../store'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import { HiOutlineSearch } from 'react-icons/hi'



interface TaskOverviewProps {
    data?: Record<string, any>;
    className?: string;
}

const TaskOverview = ({ data = {}, className }: TaskOverviewProps) => {
    const [timeRange, setTimeRange] = useState(['weekly'])

    const [repaint, setRepaint] = useState(false)

    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse,
    )

    useEffect(() => {
        setRepaint(true)
        const timer1 = setTimeout(() => setRepaint(false), 300)

        return () => {
            clearTimeout(timer1)
        }
    }, [data, sideNavCollapse])

    return (
        <Card className={className}>
        <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-lg">Explore Jobs</h4>
        </div>
             <InputGroup className="mb-4">
                <Input
                    prefix={
                        <HiOutlineSearch className="text-xl text-indigo-600 cursor-pointer" />
                    }
                />
                <Button>Search</Button>
            </InputGroup>
            
        </Card>
    )
}

export default TaskOverview
