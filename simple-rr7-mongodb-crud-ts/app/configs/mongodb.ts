import {
	type Document,
	MongoClient,
	type MongoClientOptions
} from 'mongodb';

// These variables are usually written in the .env file.
const MONGODB_URL = "mongodb://127.0.0.1:27017";
const MONGODB_AUTH_SOURCE = "admin";
const MONGODB_DATABASE = "practice";
const MONGODB_USERNAME = "admin007";
const MONGODB_PASSWORD = "password007";

const mongoClientOptions: MongoClientOptions = {
	authMechanism: 'DEFAULT',
	authSource: MONGODB_AUTH_SOURCE,
	monitorCommands: true,
	auth: {
		username: MONGODB_USERNAME,
		password: MONGODB_PASSWORD,
	},
};

/**
 * @type {Promise<MongoClient>}
 */
let mongoClient: Promise<MongoClient>;

const getMongoClientInstance = () => {
	return new MongoClient(MONGODB_URL, mongoClientOptions);
};

export const getMongoClient = async () => {
	if (mongoClient) {
		return mongoClient;
	} else {
		try {
			mongoClient = getMongoClientInstance().connect();
		} catch (error) {
			console.error(error);
		}

		return mongoClient;
	}
};

export const getCollection = async <TSchema extends Document = Document>(name: string) => {
	const connection = await getMongoClient();
	const db = connection.db(MONGODB_DATABASE);
	return db.collection<TSchema>(name);
};
