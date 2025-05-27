import compression from 'compression';
import express from 'express';
import { NODE_ENV, PORT } from '@/app/configs/constant.server';

(async () => {
	try {
		console.log('[SERVER] starting HTTP server...');

		const app = express();
		app.use(compression());
		app.disable('x-powered-by');

		const viteDevServer = await import('vite').then(vite =>
			vite.createServer({
				server: { middlewareMode: true },
			})
		);
		app.use(viteDevServer.middlewares);
		app.use(async (req, res, next) => {
			try {
				const source = await viteDevServer.ssrLoadModule('./server/app.ts');
				return await source.app(req, res, next);
			} catch (error) {
				if (typeof error === 'object' && error instanceof Error) {
					viteDevServer.ssrFixStacktrace(error);
				}
				next(error);
			}
		});

		app.listen(PORT, () => {
			console.log(`[SERVER] Server is running at 'http://127.0.0.1:${PORT}'`);
			console.log(`[SERVER] NODE_ENV = ${NODE_ENV}`);
		});
	} catch (error) {
		console.error('[SERVER] Error during shutdown:', error);
		process.exit(1);
	}
})();
