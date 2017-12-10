import ncp from 'ncp';
import { resolve } from 'path';
import { sync } from 'mkpath';
import chalk from 'chalk';
import { exec } from 'child_process';
import animate from 'chalk-animation';

const PROJECT_TEMPLATE_PATH = resolve(__dirname, '../../templates/project');
let INSTALL_DEPS_MESSAGE = 'Installing dependencies';
const INSTALL_DEPS_ANIMATION = animate.glitch(`${chalk.yellowBright(INSTALL_DEPS_MESSAGE)}`, 0.3);

const npmInstall = (projectPath, animationInterval) =>
	exec(`cd ${projectPath} && npm install`, (err, stdout, stderr) => {
		if (err) throw err;

		INSTALL_DEPS_ANIMATION.stop();
		clearInterval(animationInterval);
		console.log(`${chalk.greenBright(`Your project is ready! Happy coding <3`)}`);
	});

const addDots = () =>
	setInterval(() => {
		INSTALL_DEPS_ANIMATION.replace((INSTALL_DEPS_MESSAGE += '.'));
	}, 300);

export const generateProject = (appName) => {
	const PROJECT_PATH = `${process.cwd()}/${appName}`;

	sync(appName, parseInt(`0777`, 8));

	ncp(PROJECT_TEMPLATE_PATH, appName, (err) => {
		if (err) throw err;

		console.log(`${chalk.greenBright('create')} ${chalk.gray(PROJECT_PATH)}`);
		console.log(`${chalk.gray('Please wait a while. ')}`);
		INSTALL_DEPS_ANIMATION.start();

		npmInstall(PROJECT_PATH, addDots());
	});
};
