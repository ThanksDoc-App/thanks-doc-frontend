import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import Statistic from './Statistic'
import SalesReport from './SalesReport'
import SalesByCategories from './SalesByCategories'
import LatestOrder from './LatestOrder'
import TopProduct from './TopProduct'
import { getSalesDashboardData, useAppSelector } from '../store'
import { useAppDispatch } from '@/store'

const SalesDashboardBody = () => {
    const dispatch = useAppDispatch()

    const dashboardData = useAppSelector(
        (state) => state.salesDashboard.data.dashboardData,
    )

    console.log('dashboardData', dashboardData)

    const loading = useAppSelector((state) => state.salesDashboard.data.loading)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        dispatch(getSalesDashboardData())
    }

    // Transform the API data to match what Statistic component expects
    const transformedStatisticData = dashboardData?.data
        ? {
              allJobs: {
                  value: dashboardData.data.totalJobs || 0,
                  growShrink: 0, // You can calculate this if you have previous period data
              },
              activeJobs: {
                  value: dashboardData.data.activeJobs || 0,
                  growShrink: 0, // You can calculate this if you have previous period data
              },
              pendingJobs: {
                  value: dashboardData.data.pendingJobs || 0,
                  growShrink: 0, // You can calculate this if you have previous period data
              },
          }
        : undefined

    return (
        <Loading loading={loading}>
            <Statistic data={transformedStatisticData} />
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <SalesReport
                    data={dashboardData?.salesReportData}
                    className="col-span-2"
                />
                <SalesByCategories
                    data={dashboardData?.salesByCategoriesData}
                />
            </div> */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <LatestOrder
                    data={dashboardData?.latestOrderData}
                    className="lg:col-span-2"
                />
                <TopProduct data={dashboardData?.topProductsData} />
            </div> */}
        </Loading>
    )
}

export default SalesDashboardBody
