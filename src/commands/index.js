import enabled from './enabled';

let commands = [];

enabled.forEach(command => {
    commands[command] = require(`./${command}`).default;
});

const setUpBot = (bot, error) => {
    commands.forEach(command => {
        bot.onText(command.regex, (msg, match) => {
            command.run(msg, match)
                .then((reply) => {
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