export default {
    regex: /\/hello/
    , run: [

        session => new Promise((res, rej) => {
            session.start('hello').persist().catch(rej);
            const name = session.getProp('name');
            res({
                text: (
                    name
                        ? `Olá, ${name}! Quer trocar de apelido? Ok, Como quer que eu te chame?`
                        : 'Olá =)\nComo quer que eu te chame?'
                )
                , options: {parse_mode: 'Markdown'}
            });
        })
        , (session, msg) => new Promise((res, rej) => {
            session.setProp('name', msg.text);
            session
                .finish()
                .then(
                    res({
                        text: `Ok, vou te chamar de ${msg.text}, então =)`
                    })
                )
                .catch(rej);
        })
    ]
    , isSlashCommad: true
    , helpText: 'Define seu apelido no banco de dados do bot'
};
