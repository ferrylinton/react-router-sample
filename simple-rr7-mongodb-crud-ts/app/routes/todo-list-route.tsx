import { redirect } from "react-router";
import { createTodo, findTodoes, updateTodo } from "@/services/todo-service";
import type { Route } from "./+types/todo-list-route";
import CreateFrom from "@/components/CreateFrom";
import TodoList from "@/components/TodoList";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "TODO" },
        { name: "description", content: "Simple React Router v7 CRUD APP With Mongodb" },
    ];
}

export async function action({
    request,
}: Route.ActionArgs) {
    const formData = await request.formData();
    const operation = formData.get("operation") as string;

    if (operation === 'create') {
        const task = formData.get("task") as string;

        if (task.length >= 3) {
            const result = await createTodo(task?.toString() || '');
            console.log(result);
        }
    } else if (operation === 'update') {
        const id = formData.get("id") as string;
        const done = formData.get("done") as string === 'true';
        const result = await updateTodo(id, done);
        console.log(result);
    }

    return redirect('/');
}

export async function loader({ }: Route.LoaderArgs) {
    let todoes = await findTodoes();
    return { todoes };
}

export default function TodoListRoute({ loaderData }: Route.ComponentProps) {
    return (
        <>
            <CreateFrom />
            <TodoList todoes={loaderData.todoes} />
        </>
    );
}
