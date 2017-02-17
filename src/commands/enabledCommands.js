/**
 * Carrega os comandos disponíveis no bot
 */
import fs from 'fs';
const ignoredFiles = ['index.js', 'enabledCommands.js']; // Arquivos que não devem ser carregados como comandos
const exp = [];

const ignore = x => {
    return ignoredFiles.indexOf(x) < 0 &&
        x != 'enabled.js' &&
        x.endsWith('.js');
};

fs
    .readdirSync(__dirname)
    .filter(ignore)
    .forEach(file => exp.push(file.split('.')[0]));

export default exp;
