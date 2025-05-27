import { getCollection } from "@/configs/mongodb";
import type { Todo } from "@/types/todo-type";
import { ObjectId, type DeleteResult, type UpdateResult } from "mongodb";

const TODO_COLLECTION = 'todoes';

export const createTodo = async (task: string) => {
	const todo: Omit<Todo, 'id'> = {
		task,
		done: false,
		createdAt: new Date(),
	};

	const todoCollection = await getCollection<Omit<Todo, 'id'>>(TODO_COLLECTION);
	return await todoCollection.insertOne(todo);
};

export const findTodoes = async (): Promise<Array<Todo>> => {
	const todoCollection = await getCollection<Omit<Todo, 'id'>>(TODO_COLLECTION);
	const docs = await todoCollection.find().sort({ task: 1 }).toArray();
	return docs.map(docs => {
		const { _id, ...rest } = docs;
		return { ...rest, id: _id.toHexString() };
	})
};

export const findTodoById = async (id: string): Promise<Todo | null> => {
	if (!ObjectId.isValid(id)) {
		return null;
	}

	const todoCollection = await getCollection<Omit<Todo, 'id'>>(TODO_COLLECTION);
	const doc = await todoCollection.findOne({ _id: new ObjectId(id) });

	if (doc) {
		const { _id, ...rest } = doc;
		return { ...rest, id: _id.toHexString() };
	}

	return null;
};

export const updateTodo = async (id: string, done: boolean): Promise<UpdateResult | null> => {
	if (!ObjectId.isValid(id)) {
		return null;
	}
	const todoCollection = await getCollection<Omit<Todo, 'id'>>(TODO_COLLECTION);

	const newData = {
		done,
		updatedAt: new Date()
	};

	return await todoCollection.updateOne({ _id: new ObjectId(id) }, { $set: newData });
};

export const deleteTodoById = async (id: string): Promise<DeleteResult> => {
	if (!ObjectId.isValid(id)) {
		return { acknowledged: false, deletedCount: 0 };
	}

	const todoCollection = await getCollection<Omit<Todo, 'id'>>(TODO_COLLECTION);
	return await todoCollection.deleteOne({ _id: new ObjectId(id) });
};