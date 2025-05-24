type Todo = {
	id: string;
	task: string;
	done: boolean;
	createdAt: Date;
	updatedAt?: Date;
};

type ResponseMessage = {
	message? : string,
	errorMessage? : string
}
