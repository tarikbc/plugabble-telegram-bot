export default {
    regex: /\/id/
    , run: msg => new Promise(res => res({
        text: `ID da conversa: *${msg.chat.id}*\nID do usuário: *${msg.from.id}*`
        , options: {parse_mode: 'Markdown'}
    }))
    , isSlashCommad: true
    , helpText: 'Retorna o ID da conversa e do usuário'
};