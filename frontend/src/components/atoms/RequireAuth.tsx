import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const RequireAuth = () => {
    const token = useSelector<RootState>((state) => state.user.access_token)
    const location = useLocation()

    return token ? (
        <Outlet />
    ) : (
        <Navigate
            to='/login'
            replace
            state={{
                from: location,
            }}
        />
    )
}

export default RequireAuth
