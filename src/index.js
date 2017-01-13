import TelegramBot from 'node-telegram-bot-api';
import {info, error} from './lib/utils/log';
import Config from './config';
import commands from './commands';

const takeOff = config => {
    const TELEGRAM_TOKEN = config.TELEGRAM_TOKEN;
    const PORT = config.PORT;
    const HOST = config.HOST;
    let DOMAIN = config.DOMAIN;

    const bot = new TelegramBot(TELEGRAM_TOKEN, {
        webHook: {
            host: HOST
            , port: PORT
        }
        , onlyFirstMatch: true
    });

    bot.getMe()
      .then(me => {
          bot.setWebHook(DOMAIN + ':443/bot' + TELEGRAM_TOKEN);
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
          _info.push('\n');
          _info.push('Server info:');
          _info.push(`- Host: ${HOST}`);
          _info.push(`- Port: ${PORT}`);
          _info.push(`- Domain: ${DOMAIN}`);
          _info.push(`- Node version: ${process.version}`);
          _info.push('\n');
          _info.push('Time Info:');
          _info.push(
            `- Date: ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`);
          _info.push(
            `- Time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
          );
          _info.push('------------------------------');
          info(_info.join('\n'));
          commands.setUpBot(bot, (msg, err) => {
              bot.sendMessage(msg.chat.id, `Erro ao executar comando: ${err}`);
          });
      })
      .catch(error);
};

const config = new Config();

config.initilialize()
  .then(() => takeOff(config))
  .catch(error);