import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./server/app.ts",
        }
      : undefined,
  },
  plugins: [
			reactRouter(),
			tsconfigPaths(),
			{
				name: 'custom-middleware',
				configureServer(server) {
					server.middlewares.use((req, res, next) => {
						if (req.url?.startsWith('/.well-known')) {
							res.statusCode = 404;
							return res.end('Not Found');
						}
						next();
					});
				},
			},
		],
		optimizeDeps: {
			exclude: ['@mapbox'],
		},
		ssr: {
			noExternal: ['react-datepicker', 'clsx', 'validator'],
		},
}));
