import fs from 'fs-extra';
import childProcess from 'child_process';


/**
 * Start
 */
(async () => {
  try {
    await exec('npm run typecheck', './');
    await exec('react-router build', './');
    await copy('./express/server.js', './build/server.js');
    await copy('./.env', './build/.env');
    await copy('./package.json', './build/package.json');
    await exec('npm pkg delete devDependencies', './build');
    await exec('npm pkg set type="commonjs"', './build');
   
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
})();


function copy(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.copy(src, dest, err => {
      return (!!err ? rej(err) : res());
    });
  });
}

function exec(cmd: string, loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return childProcess.exec(cmd, {cwd: loc}, (err, stdout, stderr) => {
      if (!!stdout) {
        console.log(stdout);
      }
      if (!!stderr) {
        console.log(stderr);
      }
      return (!!err ? rej(err) : res());
    });
  });
}