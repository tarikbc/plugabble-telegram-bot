import enabled from './enabled';
import {info} from '../lib/utils/log';
let commands = new Map();

/**
 *
 * @param bot TelegramBot Bot que será configurado com os eventos onText
 * @param error Function
 */
const setUpBot = (bot, error) => {
    enabled.forEach(command => {
        commands.set(command, require(`./${command}`).default);
    });

    commands.forEach(command => {
        bot.onText(command.regex, (msg, match) => {
            command.run(msg, match)
              .then(reply => {
                  bot.sendMessage(msg.chat.id, reply.text, reply.options)
                    .catch(err => error('Erro ao enviar mensagem: %s', err));
              })
              .catch(err => bot.sendMessage(msg.chat.id, `Erro ao executar comando; ${err}`));
        });
    });

    info(`Comandos habilitados: ${Array.from(commands.keys()).join(', ')}`);
};

export default {
    setUpBot
};