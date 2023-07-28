import { Routes, Route, BrowserRouter } from 'react-router-dom'
import RequireAuth from './components/atoms/RequireAuth'
import Public from './components/atoms/Public'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/'>
                    <Route path='/' element={<Public />}>
                        <Route index path='login' element={<div>login page</div>} />
                    </Route>

                    <Route element={<RequireAuth />}>
                        <Route path='todo' element={<div>todo page</div>} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
