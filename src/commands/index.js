import enabled from './enabledCommands';
import { isAdmin, notifyAdmins } from '../lib/utils/admin';
import { info } from '../lib/utils/log';
import Session from '../lib/Session';
import pj from 'prettyjson';

//let commands = new Map();

let commands = enabled.reduce((acc, cur) => {
    acc.set(cur, require(`./${cur}`).default);
    return acc;
}, new Map());


/**
 * Envia {content} para uma lista de {ids}
 * @param {Object} error 
 * @param {TelegramBot} bot 
 * @param {Object} msg 
 * @param {Object} content 
 * @param {Array} ids 
 */
const broadcast = (error, bot, msg, content, ids) => {
    bot.sendMessage(msg.chat.id, `Iniciando broadcast para ${ids.length} usuários.`)
        .then(() => {
            ids.forEach(el => {
                bot.forwardMessage(el, content.broadcast.chat.id, content.broadcast.message_id, content.options)
                    .catch(err => error(msg, `Erro ao entregar mensagem para ${el}: ${err}`));
            });
            bot.sendMessage(msg.chat.id, 'Mensagens enviadas');
        });
};

/**
 * Trata mensagens que não se encaixaram em nenhum comando
 * @param {Object} error
 * @param {Object} msg
 * @param {TelegramBot} bot
 */
const handleMessage = (error, msg, bot) => {
    Session.getInstance(msg.chat.id).then(session => {
        if (session.command) {
            const run = commands.get(session.command).run[session.step];
            run(session, msg).then(result =>
                handleCommandResult(error, bot, msg, result));
        } else {
            bot.sendMessage(
                msg.chat.id,
                'Desculpa... Não entendi :/\nUse /help para obter uma lista dos comandos disponíveis'
            );
        }
    });
};

/**
 * Trata o resultado de um comando
 * @param error function passada pelo index para tratamento de erro dentro dos comandos
 * @param bot instância de {TelegramBot} a ser usada para enviar as mensagens de retorno
 * @param msg intância da mensagem que está sendo respondida
 * @param result resposta do comando que deve ser enviada ao usuário
 */
const handleCommandResult = (error, bot, msg, result) => {
    if (result.text) {
        bot.sendMessage(msg.chat.id, result.text, result.options)
            .catch(err => error(msg, `Erro ao enviar mensagem: ${err}`));
    } else if (result.broadcast) {
        if (result.ids) {
            broadcast(error, bot, msg, result, result.ids);
        } else {
            Session.getIds().then(ids => {
                broadcast(error, bot, msg, result, ids);
            });
        }
    }
};

/**
 * Adiciona listeners para cada comando habilitado e define tratamento de erros de baixo nível
 * @param bot instância de {TelegramBot} a ser inicializada
 * @param error function a ser utilizada para reportar erros aos usuários
 */
const setUpBot = (bot, error) => {
    commands.forEach(command => bot.onText(command.regex, (msg, match) => {
        bot
            .sendChatAction(msg.chat.id, command.chat_action || 'typing')
            .then(() => {
                Session.getInstance(msg.chat.id)
                    .then(session => {
                        if (!command.adminOnly || isAdmin(msg.from.id)) {
                            const run = Array.isArray(command.run)
                                ? command.run[session.step]
                                : command.run;
                            run(session, msg, match)
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
                    .catch(err => {
                        error(msg, err);
                    });
            })
            .catch(err => error(msg, err));
    }));

    bot.onText(/.*/, msg => handleMessage(error, msg, bot));

    bot.on('webhook_error', error => {
        notifyAdmins(bot, `Erro de WebHook: \`${pj.render(error)}\`\nDesligamento por segurança acionado`);
        process.exit(0);
    });

    bot.on('polling_error', error => {
        notifyAdmins(bot, `Erro de Polling: \`${pj.render(error)}\`\nDesligamento por segurança acionado`);
        process.exit(0);
    });

    info(`\nComandos habilitados: ${Array.from(commands.keys()).join(', ')}`);
};

export default {
    setUpBot
};
