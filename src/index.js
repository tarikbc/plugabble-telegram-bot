import env from 'dotenv-safe';
import TelegramBot from 'node-telegram-bot-api';
import * as commands from './commands';

if (!process.env.noenv) env.load();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

for (let _command in commands.default) {
    let command = commands[_command].default;
    bot.onText(command.regex, (msg, match) => {
        command.run(msg, match)
            .then((reply) => {
                bot.sendMessage(msg.chat.id, reply.text, reply.options)
                    .catch(err => console.log('Erro ao enviar mensagem: ' + err)); // eslint-disable-line no-console
            })
            .catch(err => bot.sendMessage(msg.chat.id, `Erro ao executar comando; ${err}`));
    });
}
