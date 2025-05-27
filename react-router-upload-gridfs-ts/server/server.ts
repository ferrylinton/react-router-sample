import compression from 'compression';
import express from 'express';
import { NODE_ENV, PORT } from '@/app/configs/constant.server';

import { app as reactRouterApp } from '@/server/app';

(async () => {
	try {
		console.log('[SERVER] starting HTTP server...');

		const app = express();
		app.use(compression());
		app.disable('x-powered-by');
		app.use('/assets', express.static('client/assets', { immutable: true, maxAge: '1y' }));
		app.use(express.static('client', { maxAge: '1h' }));
		app.use(reactRouterApp);

		app.listen(PORT, () => {
			console.log(`[SERVER] Server is running at 'http://127.0.0.1:${PORT}'`);
			console.log(`[SERVER] NODE_ENV = ${NODE_ENV}`);
		});
	} catch (error) {
		console.error('[SERVER] Error during shutdown:', error);
		process.exit(1);
	}
})();
