export default {
    regex: /\/echo (.*)/
    , run: (msg, match) => new Promise(res => res({text: match[1], options: {parse_mode: 'Markdown'}}))
    , isSlashCommad: true
    , helpText: 'Repete a mensagem enviada (suport Markdown)'
};