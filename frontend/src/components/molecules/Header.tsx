import { useDispatch } from 'react-redux'
import { profileIcon } from '../../assets'
import { ThemeButton } from '../atoms'
import { logOut } from '../../store/slice/userSlice'

const Header = () => {
    const dispatch = useDispatch()

    return (
        <header className='flex flex-col-reverse md:flex-row text-black dark:text-white-text w-full justify-between pb-[20px] mb-[20px] min-h-[60px] border-b-[1px] dark:border-opacity-10 border-opacity-10 border-[#23262C] dark:border-white-text'>
            <div>
                <h1 className='uppercase text-2xl font-bold'>to do app</h1>
                <p className='capitalize opacity-50 text-xs font-normal mt-2'>
                    stop procrastinating , start organizing
                </p>
            </div>
            <div className='flex gap-4'>
                <ThemeButton />
                <img
                    src={profileIcon}
                    alt='profile-icon'
                    onClick={() => dispatch(logOut())}
                    className='cursor-pointer'
                />
            </div>
        </header>
    )
}

export default Header
