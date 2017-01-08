# plugabble-telegram-bot
An easily extensible nodejs Telegram bot

#Usage
To add your own commands, just create a file inside src/commands having the file name as the name of the command.
The file should export an object with two properties: `regex`, which is the regex that must be matched for your command to be called, and `run`, which is the function that will be called when you command is triggered.
##Run method
The Run method of your command should return a Promise that, once fullfiled, provides an object containing a `text` property, which stands fort the text that should be sent back to the user. Optionally, you can also pass a property called `options` containing adittional options to pass to the Bot API.

###Rejection
If, for any reason, you can't fullfill the promise returned by the `run` method, the reject method should be called only with a string that will be sent back to the user with a nice message.
