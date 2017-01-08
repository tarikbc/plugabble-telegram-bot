import enabled from './enabled';

enabled.forEach(command => {
    module.exports[command] = require(`./${command}`);
});