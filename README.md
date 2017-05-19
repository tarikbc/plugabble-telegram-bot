# plugabble-telegram-bot
Um scaffolding para Bot do Telegram utilizando NodeJS

[English, please](README-en.md)

# Instalação
Clone esse repositório, entre com `cd` no projeto e execute `npm install && npm start`.

# Configuração
Todas as configurações básicas que o bot necessita para funcionar estão no arquivo .env na pasta base do projeto. Todas as variáveis estão no [.env.example](.env.example) para serem definidas para que o bot seja devidamente configurado.
Por exemplo, `TELEGRAM_TOKEN` e o token que você recebe do [@botfather](telegram.me/botfather), `LOCAL_IP` e o endereço de IP que o bot ira se conectar para o WebHook(geralmente localhost), e `PORT` e a porta que ele vai escutar.

# Expansão
Para adicionar os seus próprios comandos, basta criar um arquivo dentro de [src/commands](src/commands) com o nome do arquivo sendo o mesmo nome do comando. O arquivo deve exportar um objeto com duas propriedades: `regex` que é o regex que correspondente para o comando ser executado, e `run` que é a função que será chamada quando o comando é acionado.

## Método de execução
O método run do seu comando deve retornar uma Promisse que, uma vez completa, fornece um objeto contendo uma propriedade `text`, que deve ser enviado de volta para o usuário. opcionalmente, você também pode passar uma propriedade chamada `options` contendo opções adicionais para passar a API do Bot.

### Rejeição
Se, por qualquer razão, você não puder completar a Promisse, o método reject deve ser chamado apenas com uma string que será enviada de volta par ao usuário com uma mensagem agradável.

# Desativando comandos
Se, por qualquer razão, você precisar inserir um comando na pasta [src/commands](src/commands) mas não deseja que ele esteja disponível, você pode adicioná-lo ao array `disabled` e  [src/commands/enabled.js](src/commands/enabledCommands.js#L5). Dessa forma, você pode escolher exatamente quais comandos o seu bot irá responder.

# Conexão com servidor WebHook
O bot está preparado para se conectar com o servidor ssh do [ngrok](http://ngrok.com) WebHook para ser acessado fora da sua rede. Dessa forma, você não precisa se preocupar com o encaminhamento de portas ou coisas assim.

# Sugestões e report de bugs
Por favor, sinta-se livre para abrir um issue para solicitar novos recursos ou correções de bugs. Também, sinta-se livre para enviar pedidos de pull requests, apenas certifique-se de validar seu código com ESLint e seguir os padrões do resto do projeto.
