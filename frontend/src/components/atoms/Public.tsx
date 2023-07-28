import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

const Public = () => {
    const token = useSelector<RootState>((state) => state.user.access_token)
    const location = useLocation()

    return !token ? (
        <Outlet />
    ) : (
        <Navigate
            to='/todo'
            replace
            state={{
                from: location,
            }}
        />
    )
}

export default Public
