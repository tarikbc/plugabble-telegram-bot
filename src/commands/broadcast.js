export default {
    regex: /\/broadcast/
    , run: (session, msg) => new Promise((res, rej) => {
        if (msg.reply_to_message) {
            res({
                broadcast: msg.reply_to_message
            });
        } else {
            rej('Você precisa dar reply na mensagem que quer transmitir');
        }
    })
    , adminOnly: true
    , isSlashCommand: true
    , helpText: 'Transmite a mensagem respondida a todos os usuários registrados'
};