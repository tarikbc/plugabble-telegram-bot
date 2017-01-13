import _enabled from './enabled';

export default {
    regex: /\/help/
    , run: () => new Promise(res => {
        const _commands = new Map();
        let enabled;

        _enabled.filter(c => c != 'help')
          .forEach((command) => {
              _commands.set(command, require(`./${command}`).default);
          });

        const commands = new Set();

        enabled = _enabled.filter(c => {
            const cmmd = _commands.get(c);
            return (cmmd && 'isSlashCommad' in cmmd && 'helpText' in cmmd);
        });

        enabled.forEach(command => {
            const cmmd = _commands.get(command);
            const entry = `/${command}: ${cmmd.helpText}`;
            commands.add(entry);
        });

        commands.add('/help: Mostra essa mensagem');

        const ret = `Comandos disponíveis:\n${Array.from(commands).join('\n')}`;
        res({text: ret});
    })
    , name: 'help'
    , isSlashCommad: true
};