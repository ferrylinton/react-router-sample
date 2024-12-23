import { ActionFunctionArgs } from 'react-router';
import { countTodoes, createTodo } from '~/.server/services/todo-service';
import { commitSession, getSession } from '~/.server/sessions';

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));

	try {
		const total = await countTodoes();
		if(total >= 20){
			throw new Error("Data has exceeded the maximum amount (20 records)")
		}

		const formData = await request.formData();
		const task = formData.get("task") as string;

		await createTodo(task);
		session.flash("flashData", { message: `Data [task="${task}"] is created` });

		return new Response(null, {
			status: 200,
			headers: {
				Location: "/",
				'Content-Type': 'application/json',
				"Set-Cookie": await commitSession(session)
			},
		});
	} catch (error: any) {
		session.flash("flashData", { "errorMessage": error.message });
		return new Response(null, {
			status: 500,
			headers: {
				Location: "/",
				'Content-Type': 'application/json',
				"Set-Cookie": await commitSession(session)
			},
		});
	}
}

export const loader = () => {
	return new Response(null, {
		status: 302,
		headers: { Location: "/", 'Content-Type': 'application/json' },
	})
};
