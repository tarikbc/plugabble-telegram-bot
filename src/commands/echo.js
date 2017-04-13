/**
 * Repete a mensagem enviada pelo usuário
 */
export default {
    regex: /\/echo (.*)/
    ,run: (session, msg, match) => new Promise(res => res({
        text: match[1]
        ,options: {parse_mode: 'Markdown'}
    }))
    ,isSlashCommad: true
    ,helpText: 'Repete a mensagem enviada (suporta Markdown)'
};
