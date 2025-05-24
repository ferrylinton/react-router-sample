import {
	ConnectionPoolMonitoringEvent,
	Db,
	Document,
	MongoClient,
	MongoClientOptions,
	TransactionOptions,
} from 'mongodb';
import {
	MONGODB_AUTH_SOURCE,
	MONGODB_DATABASE,
	MONGODB_PASSWORD,
	MONGODB_URL,
	MONGODB_USERNAME,
} from './constant';

const mongoClientOptions: MongoClientOptions = {
	authMechanism: 'DEFAULT',
	authSource: MONGODB_AUTH_SOURCE,
	monitorCommands: true,
	auth: {
		username: MONGODB_USERNAME,
		password: MONGODB_PASSWORD,
	},
};

export const transactionOptions: TransactionOptions = {
	readConcern: { level: 'snapshot' },
	writeConcern: { w: 'majority' },
	readPreference: 'primary',
};

/**
 * @type {Promise<MongoClient>}
 */
let mongoClient: Promise<MongoClient>;

const log = (event: ConnectionPoolMonitoringEvent) => {
	try {
		console.log(JSON.stringify(event, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));
	} catch (error) {
		console.log(error);
	}
};

const getMongoClientInstance = () => {
	const instance = new MongoClient(MONGODB_URL, mongoClientOptions);

	instance.on('connectionPoolReady', log);

	return instance;
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

export const getDb = async () => {
	const connection = await getMongoClient();
	return connection.db(MONGODB_DATABASE);
};

export const getCollection = async <TSchema extends Document = Document>(name: string, db?: Db) => {
	if (db) {
		return db.collection<TSchema>(name);
	} else {
		const db = await getDb();
		return db.collection<TSchema>(name);
	}
};
