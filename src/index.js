import TelegramBot from 'node-telegram-bot-api';
import {error, info} from './lib/utils/log';
import Config from './config';
import commands from './commands';
import pj from 'prettyjson';

/**
 * Instancia o objeto do bot e chama método que adiciona um handler para cada
 * comando
 */
const takeOff = config => {
    const TELEGRAM_TOKEN = config.TELEGRAM_TOKEN;
    const PORT = config.PORT;
    const HOST = config.HOST;
    let DOMAIN = config.DOMAIN;
    const WEBHOOK = config.WEBHOOK;

    const MONGO_HOST = process.env.MONGO_HOST;
    const MONGO_PORT = process.env.MONGO_PORT;
    const MONGO_USER = process.env.MONGO_USER;
    const MONGO_DATABASE = process.env.MONGO_DATABASE;

    const bot = WEBHOOK
        ? new TelegramBot(TELEGRAM_TOKEN, {
            webHook: {
                host: HOST
                , port: PORT
            }
            , onlyFirstMatch: true
        })
        : new TelegramBot(TELEGRAM_TOKEN, {
            polling: true
            , onlyFirstMatch: true
        });

    bot
        .getMe()
        .then(me => {
            if (WEBHOOK) bot.setWebHook(DOMAIN + ':443/bot' + TELEGRAM_TOKEN);
            let _info = [];
            const date = new Date();
            _info.push('');
            _info.push('------------------------------');
            _info.push('Bot successfully deployed!');
            _info.push('------------------------------');
            _info.push('Bot info:');
            _info.push(`- ID: ${me.id}`);
            _info.push(`- Name: ${me.first_name}`);
            _info.push(`- Username: ${me.username}`);
            _info.push('');
            _info.push('Server info:');
            _info.push(WEBHOOK ? `- Host: ${HOST}` : '- Polling mode');
            if (WEBHOOK) _info.push(`- Port: ${PORT}`);
            if (WEBHOOK) _info.push(`- Domain: ${DOMAIN}`);
            _info.push(`- Node version: ${process.version}`);
            _info.push('');
            _info.push('MongoDB info:');
            _info.push(
                `- Host: ${MONGO_HOST || 'localhost'}${MONGO_PORT
                    ? `:${MONGO_PORT}`
                    : ''}`
            );
            if (MONGO_USER) _info.push(`- User: ${`${MONGO_USER}`}`);
            _info.push(`- Database: ${MONGO_DATABASE}`);
            _info.push('');
            _info.push('Time Info:');
            _info.push(
                `- Date: ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
            );
            _info.push(
                `- Time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            );
            _info.push('------------------------------');
            info(_info.join('\n'));
            commands.setUpBot(bot, (msg, err) => {
                error(pj.render(msg));
                error(pj.render(err));
                bot.sendMessage(
                    msg.chat.id,
                    `Erro ao executar comando: ${err}`
                );
            });
        })
        .catch(error);
};

const config = new Config();

/**
 * Carrega as configurações básicas necessárias para a execução do bot.
 * Você pode alterar os valores padrão em config.js
 */
config.initilialize().then(() => takeOff(config));
