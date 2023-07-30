import { useCallback, useLayoutEffect, useState } from 'react'
import assets from '../../assets'

type themeType = 'dark' | 'light'

const ThemeButton = () => {
    const { themeDarkIcon, themeLightIcon } = assets
    const [theme, setTheme] = useState<themeType>()
    const systemThem = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    const setTheming = useCallback((str: themeType) => {
        const rootElClasses = document.documentElement.classList

        setTheme(str)

        localStorage.setItem('theme', str)

        if (str === 'dark' && !rootElClasses.contains('dark')) {
            rootElClasses.add('dark')
        }

        if (!(str === 'dark') && rootElClasses.contains('dark')) {
            rootElClasses.remove('dark')
        }
    }, [])

    useLayoutEffect(() => {
        const themeSelected = (localStorage.getItem('theme') || systemThem) as themeType

        setTheming(themeSelected)
    }, [setTheming, systemThem])

    const toggleTheme = () => {
        theme === 'dark' ? setTheming('light') : setTheming('dark')
    }

    return (
        <div className='cursor-pointer flex justify-center' onClick={toggleTheme}>
            <img src={theme === 'dark' ? themeDarkIcon : themeLightIcon} alt='them-icon' />
        </div>
    )
}

export default ThemeButton
