/* eslint-disable no-console */
import chalk from 'chalk';

const error = text => console.log(chalk.red(text));

const warn = text => console.log(chalk.yellow(text));

const info = text => console.log(chalk.cyan(text));

const log = text => console.log(chalk.blue(text));

export {
    error
    , warn
    , info
    , log
};