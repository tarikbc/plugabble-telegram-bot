export default {
    regex: /\/start/
    , run: session => new Promise((res, rej) => {
        const name = session.getProp('name');
        if (name) {
            res({ text: `Eae, ${name}, beleza? Se precisar de ajuda, é só me mandar um /help!` });
        } else {
            session.start('hello').persist()
                .then(res({ text: 'Opa, beleza? Qual o seu nome?' }))
                .catch(rej);
        }
    })
    , isSlashCommand: true
};