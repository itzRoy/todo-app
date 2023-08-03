import { Loader } from '.'
import { deleteIcon } from '../../assets'

type TaskType = {
    complete: boolean
    id: string
    text: string
    identifier: string
    isDeleteLoading?: boolean
    isToggleLoading?: boolean
    onDeleteClick: (id: string) => void
    onCheckboxClick: (id: string) => void
}

const TaskTodo = ({
    complete,
    id,
    text,
    onCheckboxClick,
    onDeleteClick,
    identifier,
    isDeleteLoading,
    isToggleLoading,
}: TaskType): JSX.Element => {
    return (
        <div className='relative'>
            {(isDeleteLoading || isToggleLoading) && id === identifier ? (
                <Loader className='absolute w-4 h-4 md:w-5 md:h-5 top-[30%] md:top-[25%] let-0' />
            ) : null}
            <div className='flex px-5 md:px-10 py-3'>
                <div className='flex items-center'>
                    <input
                        onClick={() => onCheckboxClick(id)}
                        checked={complete}
                        id={id}
                        type='checkbox'
                        value=''
                        className='checkbox'
                        readOnly
                    />

                    <label
                        htmlFor={id}
                        className={`ml-2 dark:text-white-text text-text-black text-[16px] cursor-pointer ${
                            complete && 'line-through'
                        }`}
                    >
                        {text}
                    </label>
                </div>

                <button onClick={() => onDeleteClick(id)} className='w-auto p-0  dark:bg-transparent ml-auto'>
                    <img src={deleteIcon} />
                </button>
            </div>
        </div>
    )
}

export default TaskTodo
