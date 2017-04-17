/**
 * Gera uma lista dos comandos e suas descrições dinamicamente
 */
import _enabled from './enabledCommands';

const isValidHelpCommand = (command, session) => {
    if (!command) return false;
    if (!('isSlashCommand' in command)) return false;
    if (!('helpText' in command)) return false;
    if (!command.isSlashCommand) return false;
    if (command.adminOnly && !session.isAdmin) return false;
    return true;
};

export default {
    regex: /\/help/
    , run: (session) => new Promise(res => {
        const commands = _enabled.reduce((acc, cur) => {
            if (cur !== 'help') acc.push([cur, require(`./${cur}`).default]);
            return acc;
        }, [])
            .reduce((acc, cur) => {
                return isValidHelpCommand(cur[1], session) ? acc.add(`/${cur[0]}: ${cur[1].helpText}`) : acc;
            }, new Set());

        commands.add('/help: Mostra essa mensagem');

        const ret = `Comandos disponíveis:\n${Array.from(commands).join('\n')}`;
        res({text: ret});
    })
    , name: 'help'
    , isSlashCommand: true
};