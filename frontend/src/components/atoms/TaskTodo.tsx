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
                <Loader className='absolute w-5 h-5 top-[20%] let-1/2' />
            ) : null}
            <div className='flex px-10 py-3'>
                <div className='flex items-center'>
                    <input
                        onClick={() => onCheckboxClick(id)}
                        checked={complete}
                        id={id}
                        type='checkbox'
                        value=''
                        className='checkbox'
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