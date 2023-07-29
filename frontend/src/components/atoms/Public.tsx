import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import config from '../../../config'

const Public = () => {
    const token = useSelector<RootState>((state) => state.user.access_token)

    return !token ? <Outlet /> : <Navigate to={config.routes.todo} />
}

export default Public
