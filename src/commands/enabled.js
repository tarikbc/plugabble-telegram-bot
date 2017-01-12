import fs from 'fs';
const disabled = ['index.js'];
const exp = [];

fs.readdirSync(__dirname).filter(x => disabled.indexOf(x) < 0 && x != 'enabled.js').forEach(file => {
    exp.push(file.split('.')[0]);
});

export default exp;
