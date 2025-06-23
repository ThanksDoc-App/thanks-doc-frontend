import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '@/utils/hooks/useAuth'
import appConfig from '@/configs/app.config'

const ProtectedRoute = () => {
    const { authenticated } = useAuth()
    const location = useLocation()

    if (!authenticated) {
        return (
            <Navigate
                to={appConfig.unAuthenticatedEntryPath}
                state={{ from: location }}
                replace
            />
        )
    }

    return <Outlet />
}

export default ProtectedRoute
