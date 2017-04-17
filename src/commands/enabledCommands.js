/**
 * Carrega os comandos disponíveis no bot
 */
import fs from 'fs';
const ignoredFiles = ['index.js', 'enabledCommands.js']; // Arquivos que não devem ser carregados como comandos

const ignore = x => {
    return !ignoredFiles.includes(x) &&
        x != 'enabled.js' &&
        x.endsWith('.js');
};

export default fs
    .readdirSync(__dirname)
    .filter(ignore)
    .reduce((acc, cur) => {
        const command = cur.split('.')[0];
        if (!acc.includes(command)) acc.push(command);
        return acc;
    }, []);
