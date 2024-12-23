import clsx from "clsx";
import { useEffect, useRef } from "react";
import { data, Form, useActionData, useSubmit } from "react-router";
import { countTodoes, deleteTodoById, findTodoes, updateTodo } from "~/.server/services/todo-service";
import { commitSession, getSession } from "~/.server/sessions";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "React Router CRUD App" },
    { name: "description", content: "Simple CRUD With React Router V7 (Framework), Express JS and MongoDB" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const payload = Object.fromEntries(await request.formData());

  if (payload.action === "delete") {
    const id = payload.id;
    if (id) {
      await deleteTodoById(id.valueOf() as string);
      return { message: "Data is deleted" };
    }
  } else if (payload.action === "done") {
    const id = payload.id;
    if (id) {
      await updateTodo(id.valueOf() as string);
      return { message: "Data is updated" };
    }
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const flashData = session.get("flashData");

  const todoes = await findTodoes();
  const total = await countTodoes();
  return data({ flashData, total, todoes },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  )
}

export default function Home({ loaderData }: Route.ComponentProps) {

  const formRef = useRef<HTMLFormElement>(null)

  const submit = useSubmit();

  const actionData = useActionData<ResponseMessage>();

  useEffect(() => {
    if (loaderData.flashData?.message) {
      formRef.current?.reset();
    }
  }, [loaderData])

  const deleteHandler = (id: string) => {
    submit(
      { id, action: "delete" },
      { method: 'post', action: "" }
    );
  }

  const doneHandler = (id: string) => {
    submit(
      { id, action: "done" },
      { method: 'post', action: "" }
    );
  }

  return <>
    <div className="w-full h-dvh flex justify-center">
      <div className="w-full max-w-xl flex flex-col gap-2 p-2">
        <div className="flex pt-5 pb-3 justify-between items-baseline">
          <h1 className="text-2xl font-bold">TODO</h1>
          <span className="text-neutral-500 leading-none">Total : {loaderData.total} (max. 20)</span>
        </div>

        {
          loaderData.flashData?.message && <div className="w-full text-center bg-green-500 text-white mb-4 py-2 px-4 rounded">
            {loaderData.flashData?.message}
          </div>
        }

        {
          loaderData.flashData?.errorMessage && <div className="w-full text-center bg-red-500 text-white mb-4 py-2 px-4 rounded">
            {loaderData.flashData?.errorMessage}
          </div>
        }

        {
          actionData?.message && <div className="w-full text-center bg-green-500 text-white mb-4 py-2 px-4 rounded">
            {actionData?.message}
          </div>
        }

        {
          actionData?.errorMessage && <div className="w-full text-center bg-red-500 text-white mb-4 py-2 px-4 rounded">
            {actionData?.errorMessage}
          </div>
        }

        <Form
          method="post"
          action="/create"
          noValidate
          autoComplete="off"
          ref={formRef}
          className="w-full max-w-sm mx-auto px-4 py-2">

          <div className="flex items-center border-b-2 border-neutral-400 py-1 focus-within:border-blue-500">
            <input
              name="task"
              maxLength={100}
              type="text"
              autoComplete="off"
              placeholder="Add a task"
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            />
            <button
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 font-bold hover:border-blue-700 text-white text-sm py-1 px-4 rounded-sm"
              type="submit">
              ADD
            </button>
          </div>

        </Form>

        <div className="flex flex-col">
          {
            loaderData.total === 0 && <div className="w-full text-center bg-neutral-500 text-white mb-4 p-4 rounded">No records is found</div>
          }
          {
            loaderData.todoes && loaderData.todoes.map((todo, index) => {
              return <div key={todo.id} className="flex justify-between items-center gap-2">
                <div className="flex-none w-6 h-6 leading-6 text-sm text-center text-neutral-500">{index + 1}</div>
                <div className="flex-1 flex justify-between items-center p-2 break-words border-b border-neutral-300">
                  <div className={clsx("flex-1", todo.done && "line-through")}>{todo.task}</div>
                  <div className="flex-none flex gap-1 text-xs">
                    {
                      !todo.done && <button
                        onClick={() => doneHandler(todo.id)}
                        type="button"
                        className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-sm">
                        DONE
                      </button>
                    }
                    <button
                      onClick={() => deleteHandler(todo.id)}
                      type="button"
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-sm">
                      DELETE
                    </button>
                  </div>
                </div>
              </div>

            })
          }
        </div>
      </div>
    </div>
  </>;
}
