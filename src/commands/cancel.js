/**
 * Cancela o comando atual chamando Session.finish
 */
export default {
    regex: /\/cancel/i
    , run: session => new Promise((res, rej) => {
        const text = (session.command ? 'Ok, operação cancelada' : 'Hm... Tudo bem, mas eu não tava fazendo nada, não O.o');
        session.finish()
            .then(() => {
                res({
                    text
                });
            })
            .catch(rej);
    })
    , isSlashCommand: true
    , helpText: 'Cancela a operação atual'
};