import { WithId } from 'mongodb';

export const mapToObject = <T extends { id: string }>(t: WithId<T>) => {
	const { _id, ...rest } = t;
	return { ...rest, id: _id.toHexString() };
};
