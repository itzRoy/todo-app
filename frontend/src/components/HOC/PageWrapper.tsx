import { FC } from 'react'
import { Header } from '../molecules'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentProps = Record<string, any>

const PageWrapper = <T extends ComponentProps>(Component: FC<T>, idName: string) =>
    function HOC(props: T) {
        return (
            <div
                className='h-[100vh] max-h[100vh] flex flex-col px-[30px] md:px-[80px] py-[30px] md:py-[70px] dark:text-white-text bg-white dark:bg-background'
                id={idName}
            >
                <Header />
                <Component {...props} />
            </div>
        )
    }

export default PageWrapper
