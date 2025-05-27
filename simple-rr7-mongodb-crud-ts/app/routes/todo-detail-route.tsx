import { deleteTodoById, findTodoById } from "@/services/todo-service";
import { redirect, useNavigate, useSubmit } from "react-router";
import type { Route } from "./+types/todo-detail-route";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "TODO" },
		{ name: "description", content: "Simple React Router v7 CRUD APP With Mongodb" },
	];
}

export async function action({
	params,
}: Route.ActionArgs) {
	await deleteTodoById(params.id || '0');
	return redirect('/');
}

export async function loader({ params }: Route.LoaderArgs) {
	const todo = await findTodoById(params.id || '');
	return { todo };
}

export default function TodoDetailRoute({ loaderData }: Route.ComponentProps) {

	const todo = loaderData.todo;

	const navigate = useNavigate();

	const submit = useSubmit();

	const onBackHandler = () => {
		navigate("/");
	}

	const onDeleteHandler = () => {
		if (todo) {
			submit(
				{ id: todo.id },
				{ method: 'post', action: `/todo/${todo.id}` }
			);
		}
	}

	if (todo) {
		return (
			<div className="todo-detail-wrapper">
				<table>
					<tbody>
						<tr>
							<th>ID</th>
							<td>{todo.id}</td>
						</tr>
						<tr>
							<th>Task</th>
							<td>{todo.task}</td>
						</tr>
						<tr>
							<th>Done</th>
							<td>{todo.done ? 'Yes' : 'No'}</td>
						</tr>
						<tr>
							<th>Created Date</th>
							<td>{todo.createdAt.toDateString()}</td>
						</tr>
						<tr>
							<th>Updated Date</th>
							<td>{todo.updatedAt?.toDateString() || '-'}</td>
						</tr>
					</tbody>
				</table>
				<div className="w-full flex gap-2 justify-center">
					<button type="button" className="btn btn-secondary" onClick={() => onBackHandler()}>
						Back
					</button>
					<button type="button" className="btn btn-danger" onClick={() => onDeleteHandler()}>
						Delete
					</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className="todotodo-detail-wrapper">
				<div className="not-found">Data is not Found</div>
				<div className="w-full flex gap-2 justify-center">
					<button type="button" className="btn btn-secondary" onClick={() => onBackHandler()}>
						Back
					</button>
				</div>
			</div>
		)
	}

}
