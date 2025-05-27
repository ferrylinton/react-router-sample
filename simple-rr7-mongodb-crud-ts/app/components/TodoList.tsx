
import type { Todo } from '@/types/todo-type'
import clsx from 'clsx'
import type { ChangeEvent, ChangeEventHandler } from 'react'
import { Link, useSubmit } from 'react-router'

type TodoListProps = {
    todoes: Array<Todo>
}

export default function TodoList({ todoes }: TodoListProps) {

    const submit = useSubmit();

    const onCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
        submit(
            { id: event.currentTarget.value, done: event.currentTarget.checked, operation: "update" },
            { method: 'post', action: '' }
        );
    }

    if (todoes.length > 0) {
        return (
            <div className='todo-list-wrapper'>
                <ul>
                    {
                        todoes.map((todo) => {
                            return (
                                <li key={todo.id}>
                                    <input onChange={onCheckChange} value={todo.id} className='form-checkbox' type="checkbox" name="isdone" checked={todo.done}/>
                                    <span className={clsx(todo.done && 'line-through')}>{todo.task}</span>
                                    <Link to={`/todo/${todo.id}`}>Detail</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    } else {
        return (
            <div className='todo-list-wrapper'>
                <div>Empty Data</div>
            </div>
        )
    }

}
