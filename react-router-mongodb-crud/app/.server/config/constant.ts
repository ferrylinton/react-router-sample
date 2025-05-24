import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URL) {
	throw new Error('Invalid environment variable: "MONGODB_URL"');
}

if (!process.env.MONGODB_AUTH_SOURCE) {
	throw new Error('Invalid environment variable: "MONGODB_AUTH_SOURCE"');
}

if (!process.env.MONGODB_USERNAME) {
	throw new Error('Invalid environment variable: "MONGODB_USERNAME"');
}

if (!process.env.MONGODB_PASSWORD) {
	throw new Error('Invalid environment variable: "MONGODB_PASSWORD"');
}

if (!process.env.MONGODB_DATABASE) {
	throw new Error('Invalid environment variable: "MONGODB_DATABASE"');
}

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || '3000';

export const MONGODB_URL = process.env.MONGODB_URL;
export const MONGODB_AUTH_SOURCE = process.env.MONGODB_AUTH_SOURCE;
export const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE;