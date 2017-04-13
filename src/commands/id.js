/**
 * Exibe o ID do usuário e da conversa
 */
export default {
    regex: /\/id/
    ,run: (session, msg) => new Promise(res => res({
        text: (
            `ID da conversa: *${msg.chat.id}*\nID do usuário: *${msg.from.id}*`
        )
        ,options: {parse_mode: 'Markdown'}
    }))
    ,isSlashCommad: true
    ,helpText: 'Retorna o ID da conversa e do usuário'
};
