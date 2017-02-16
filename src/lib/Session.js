import {hasType} from './utils/types';
import {log} from './utils/log';

export default class Session {
    constructor(id /*, doNotLoad = false*/) {
        this._id = id;
        this._step = 0;
        this._userData = new Map();
        this._changed = false;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get command() {
        return this._command;
    }

    set command(command) {
        this._command = command;
        this.persist();
    }

    get step() {
        return this._step;
    }

    set step(step) {
        if (hasType(step, 'number')) this._step = step;
        else throw new TypeError('step precisa ser um número!');
    }

    get userData() {
        return this._userData;
    }

    set userData(userData) {
        if (hasType(userData, 'map')) {
            this._userData = userData;
            this.persist();
        } else
            throw new TypeError('userData precisa ser um map!');
    }

    get changed() {
        return this._changed;
    }

    set changed(changed) {
        this._changed = changed;
    }

    setAll(command, step, userData) {
        this.command = command;
        this.step = step;
        this.userData = userData;
        this.persist();
        return this;
    }

    getProp(propertyName) {
        if (this._userData.has(propertyName))
            return this._userData.get(propertyName);
    }

    setProp(key, value) {
        this._userData.set(key, value);
        this.persist();
        return this;
    }

    clearProps() {
        this.userData = new Map();
        this.persist();
        return this;
    }

    start(command) {
        this.command = command;
        return this;
    }

    next() {
        this.step = this.step + 1;
        return this;
    }

    prev() {
        log(this.step);
        log(`Menos 1 ${this.step - 1}`);
        this.step = this.step > 1 ? this.step - 1 : 0;
        log(this.step);
        return this;
    }

    end() {
        this._step = 0;
        this._command = undefined;
        this.userData = new Map();
        this.persist();
        return this;
    }

    persist() {
        this.changed = true;
    }

    save() {
        this.changed = false;
    }
}
