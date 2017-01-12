import enabled from './enabled';
import {log} from '../lib/utils/log';

let commands = [];

const setUpBot = (bot, error) => {
    enabled.forEach(command => {
        commands[command] = require(`./${command}`).default;
    });
    log('Setup bot called');
    log(`Commands: ${commands}`);
    log(`Enabled: ${enabled}`);
    commands.forEach(command => {
        log(`Command: ${command}`);
        bot.onText(command.regex, (msg, match) => {
            command.run(msg, match)
                .then(reply => {
                    bot.sendMessage(msg.chat.id, reply.text, reply.options)
                        .catch(err => error('Erro ao enviar mensagem: %s', err));
                })
                .catch(err => bot.sendMessage(msg.chat.id, `Erro ao executar comando; ${err}`));
        });
    });
};

export default {
    setUpBot
};