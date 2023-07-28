import { Routes, Route, BrowserRouter } from 'react-router-dom'
import RequireAuth from './components/atoms/RequireAuth'
import Public from './components/atoms/Public'
import config from '../config'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    <Route path={config.routes.login} element={<Public />}>
                        <Route index element={<div>login page</div>} />
                    </Route>

                    <Route element={<RequireAuth />}>
                        <Route path={config.routes.todo} element={<div>todo page</div>} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
