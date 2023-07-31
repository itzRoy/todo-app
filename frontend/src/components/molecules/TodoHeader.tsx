import { useDispatch, useSelector } from 'react-redux'
import { hideIcon, showIcon } from '../../assets'
import { AppDispatch, RootState } from '../../store'
import { ITodos, setTodosFilter, triggerRefresh } from '../../store/slice/todoSlice'

const TodoHeader = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { completeCount, filter } = useSelector<RootState, ITodos>((state) => state.todos)

    const isFilterActive = filter && !!Object.keys(filter).length

    const handleHideShow = () => {
        if (isFilterActive) {
            dispatch(setTodosFilter({}))
        } else {
            dispatch(setTodosFilter({ complete: false }))
        }

        dispatch(triggerRefresh())
    }

    return (
        <div className='flex justify-between flex-col-reverse gap-2 items-start md:flex-row md:items-end my-5'>
            <div>
                {!isFilterActive && completeCount ? (
                    <p className='text-button-text'>{completeCount} completed</p>
                ) : null}
            </div>

            <div
                role='button'
                onClick={handleHideShow}
                className={`${
                    isFilterActive && 'justify-self-center'
                } button flex px-6 py-3 rounded-lg bg-dark-button dark:bg-text-black text-text-black shrink-0 w-auto`}
            >
                <img src={isFilterActive ? showIcon : hideIcon} alt='visiblity-icon' className='mr-2' />
                <p className='dark:text-button-text'>{isFilterActive ? 'Show Completed' : 'Hide Completed'}</p>
            </div>
        </div>
    )
}

export default TodoHeader
