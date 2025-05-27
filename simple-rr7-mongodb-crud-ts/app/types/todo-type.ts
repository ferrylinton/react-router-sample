export type Todo = {
	id: string;
	task: string;
	done: boolean;
	createdAt: Date;
	updatedAt?: Date;
};