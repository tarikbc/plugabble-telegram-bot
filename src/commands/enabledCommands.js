/**
 * Carrega os comandos disponíveis no bot
 */
import fs from 'fs';
const ignoredFiles = ['index.js', 'enabledCommands.js']; // Arquivos que não devem ser carregados como comandos
const exp = [];

fs.readdirSync(__dirname)
    .filter(x => ignoredFiles.indexOf(x) < 0 && x != 'enabled.js')
    .forEach(file => {
        exp.push(file.split('.')[0]);
    });

export default exp;
