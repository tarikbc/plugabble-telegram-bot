# plugabble-telegram-bot
An easily extensible nodejs Telegram bot

# Installing
Just clone the repo, `cd` into it, create the .env (read next session) file and `npm install && npm start`.

# Configuring
All the basic configuration the bot needs to be up and running can be done through a .env file on the project's root. All the variables on [.env.example](.env.example) should be defined on your .env file for the bot to work.
For instance, `TELEGRAM_TOKEN` is the token you get from [@botfather](telegram.me/botfather), `LOCAL_IP` is the IP no which the bot will bind for WebHook listening (usually localhost), and `PORT` is the port for listening.

# Expanding
To add your own commands, just create a file inside [src/commands](src/commands) having the file name as the name of the command.
The file should export an object with two properties: `regex`, which is the regex that must be matched for your command to be called, and `run`, which is the function that will be called when you command is triggered.
## Run method
The Run method of your command should return a Promise that, once fullfiled, provides an object containing a `text` property, which stands fort the text that should be sent back to the user. Optionally, you can also pass a property called `options` containing adittional options to pass to the Bot API.

### Rejection
If, for any reason, you can't fullfill the promise returned by the `run` method, the reject method should be called only with a string that will be sent back to the user with a nice message.

# Disabling commands
If you, for some reason, need a file insde the [src/commands](src/commands) folder to not be loaded as a command (a WIP command, for example), you can add it's name to the `disabled` array on [src/commands/enabled.js](src/commands/enabled.js#L2). That way you can chosse exactly which commands your bot will respond to.

# Automatic tunnel for the WebHook
The bot is prepared to open an ssh tunnel to [ngrok](http://ngrok.com) servers for the WebHook to be accessible out of your network. This way, you don't have to worry about port forwarding or things like that (cause, come on, we all find that stuff boring).

# Feature suggestions and bug reports
Please, feel free to open issues for new feature requests or bugs; also, feel completely free to send me pull requests, just make sure ESLint is happy with your code, and that you follow the patterns found on the rest of the project.
