import assets from '../../assets'
import ThemeButton from '../atoms/ThemeButton'

const Header = () => {
    const { profileIcon } = assets

    return (
        <header className='flex text-black dark:text-white-text w-full justify-between pb-[20px] mb-[20px] min-h-[60px] border-b-[1px] dark:border-opacity-10 border-opacity-10 border-[#23262C] dark:border-white-text'>
            <div>
                <h1 className='uppercase text-2xl font-bold'>to do app</h1>
                <p className='capitalize opacity-50 text-xs font-normal mt-2'>
                    stop procrastinating , start organizing
                </p>
            </div>
            <div className='flex gap-4'>
                <ThemeButton />
                <img src={profileIcon} alt='profile-icon' />
            </div>
        </header>
    )
}

export default Header
