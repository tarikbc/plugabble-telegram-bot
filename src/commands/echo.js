/**
 * Repete a mensagem enviada pelo usuário
 */
export default {
    regex: /\/echo (.*)/
    , run: (session, msg, match) => new Promise(res => res({
        text: match[1].replace(/\*/g, '')
        , options: {parse_mode: 'Markdown'}
    }))
    , isSlashCommand: true
    , helpText: 'Repete a mensagem enviada (negrito reservado a admins)'
};
