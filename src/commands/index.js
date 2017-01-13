import enabled from './enabled';
import { isAdmin } from '../lib/utils/admin';
import {info} from '../lib/utils/log';
let commands = new Map();

const setUpBot = (bot, error) => {
  enabled.forEach(command => commands.set(command, require(`./${command}`).default));
  commands.forEach(command =>
    bot.onText(command.regex, (msg, match) => {
      if (!command.adminOnly || isAdmin(msg.from.id)) {
        command.run(msg, match)
        .then(reply =>
          bot.sendMessage(msg.chat.id, reply.text, reply.options)
          .catch(err => error('Erro ao enviar mensagem: ', err)))
        .catch(err => bot.sendMessage(msg.chat.id, 'Erro ao executar comando: ', err));
      } else { bot.sendMessage(msg.chat.id, 'Este comando só pode ser executado por admins.'); }
    }));
  info(`\nComandos habilitados: ${Array.from(commands.keys()).join(', ')}`);
};

export default {
    setUpBot
};
