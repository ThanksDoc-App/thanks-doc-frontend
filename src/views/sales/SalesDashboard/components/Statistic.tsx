import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import { useAppSelector } from '../store'
import dayjs from 'dayjs'

type StatisticCardProps = {
    data?: {
        value: number
        growShrink: number
    }
    label: string
    valuePrefix?: string
    date: number
}

type StatisticProps = {
    data?: {
        allJobs?: {
            value: number
            growShrink: number
        }
        activeJobs?: {
            value: number
            growShrink: number
        }
        pendingJobs?: {
            value: number
            growShrink: number
        }
        revenue?: {
            value: number
            growShrink: number
        }
        orders?: {
            value: number
            growShrink: number
        }
        purchases?: {
            value: number
            growShrink: number
        }
    }
}

const StatisticCard = ({
    data = { value: 0, growShrink: 0 },
    label,
    valuePrefix,
    date,
}: StatisticCardProps) => {
    return (
        <Card>
            <h6 className="font-semibold mb-4 text-sm">{label}</h6>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={data.value}
                            prefix={valuePrefix}
                        />
                    </h3>
                    {/* Removed the comparison text */}
                </div>
                {/* Removed the GrowShrinkTag component */}
            </div>
        </Card>
    )
}

const Statistic = ({ data = {} }: StatisticProps) => {
    const startDate = useAppSelector(
        (state) => state.salesDashboard.data.startDate,
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatisticCard
                data={data.allJobs || { value: 0, growShrink: 0 }}
                label="All Jobs"
                date={startDate}
            />
            <StatisticCard
                data={data.activeJobs || { value: 0, growShrink: 0 }}
                label="Active Jobs"
                date={startDate}
            />
            <StatisticCard
                data={data.pendingJobs || { value: 0, growShrink: 0 }}
                label="Pending Jobs"
                date={startDate}
            />
        </div>
    )
}

export default Statistic
