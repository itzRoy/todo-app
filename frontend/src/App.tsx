import { Routes, Route, BrowserRouter } from 'react-router-dom'
import RequireAuth from './components/atoms/RequireAuth'
import Public from './components/atoms/Public'
import config from '../config'
import TodoPage from './components/pages/TodoPage'
import LoginSingup from './components/pages/LoginSignupPage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    <Route path={config.routes.login} element={<Public />}>
                        <Route index element={<LoginSingup />} />
                    </Route>

                    <Route element={<RequireAuth />}>
                        <Route path={config.routes.todo} element={<TodoPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
