/* eslint-disable no-console */
import chalk from 'chalk';

const error = text => console.error(chalk.red(text));

const warn = text => console.warn(chalk.yellow(text));

const info = text => console.info(chalk.cyan(text));

const log = text => console.log(chalk.blue(text));

export {
    error
    , warn
    , info
    , log
};