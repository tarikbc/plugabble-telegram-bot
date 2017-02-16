import enabled from './enabledCommands';
import {isAdmin} from '../lib/utils/admin';
import {info} from '../lib/utils/log';
import Session from '../lib/Session';

let commands = new Map();

enabled.forEach(command =>
    commands.set(command, require(`./${command}`).default));

const handleMessage = (error, msg, bot) => {
    Session.getInstance(msg.chat.id).then(session => {
        if (session.command) {
            const _command = commands.get(session.command)[session.step];
            _command
                .run(session, msg)
                .then(result => handleCommandResult(error, bot, msg, result));
        } else {
            info(msg);
            bot.sendMessage(
                msg.chat.id,
                'Desculpa... Não entendi :/\nUse /help para obter uma lista dos comandos disponíveis'
            );
        }
    });
};

const handleCommandResult = (error, bot, msg, result) => {
    bot
        .sendMessage(msg.chat.id, result.text, result.options)
        .catch(err => error(msg, `Erro ao enviar mensagem: ${err}`));
};

const setUpBot = (bot, error) => {
    commands.forEach(command => bot.onText(command.regex, (msg, match) => {
        bot
            .sendChatAction(msg.chat.id, 'typing')
            .then(() => {
                const session = new Session(msg.chat.id);
                if (!command.adminOnly || isAdmin(msg.from.id)) {
                    command
                        .run(session, msg, match)
                        .then(result =>
                            handleCommandResult(error, bot, msg, result))
                        .catch(err => error(msg, err));
                } else {
                    error(
                        msg,
                        'Este comando só pode ser executado por admins.'
                    );
                }
            })
            .catch(error);
    }));

    bot.onText(/.*/, msg => handleMessage(error, msg, bot));

    info(`\nComandos habilitados: ${Array.from(commands.keys()).join(', ')}`);
};

export default {
    setUpBot
};
