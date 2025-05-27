import type { Config } from '@react-router/dev/config';
import fs from 'fs-extra';
import childProcess from 'child_process';

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  buildEnd: async () => {
		await copy('./build/server/assets', './build/assets');
		await copy('./build/server/index.js', './build/server.js');
		await remove('./build/server');
		await copy('./package.json', './build/package.json');
		await exec('npm pkg delete devDependencies', './build');
		await exec('npm pkg delete lint-staged', './build');
		await exec('npm pkg delete simple-git-hooks', './build');
	},
} satisfies Config;

function copy(src: string, dest: string): Promise<void> {
	return new Promise((res, rej) => {
		return fs.copy(src, dest, err => {
			return !!err ? rej(err) : res();
		});
	});
}

function remove(loc: string): Promise<void> {
	return new Promise((res, rej) => {
		return fs.remove(loc, err => {
			return !!err ? rej(err) : res();
		});
	});
}

function exec(cmd: string, loc: string): Promise<void> {
	return new Promise((res, rej) => {
		return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
			if (!!stdout) {
				console.log(stdout);
			}
			if (!!stderr) {
				console.log(stderr);
			}
			return !!err ? rej(err) : res();
		});
	});
}
