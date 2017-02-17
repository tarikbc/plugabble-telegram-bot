import {hasType} from './utils/types';
import {session as sessions} from './db';
import dbUtils from './utils/db';

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
        this.save();
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
            this.save();
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
        this.save();
        return this;
    }

    getProp(propertyName) {
        if (this._userData.has(propertyName))
            return this._userData.get(propertyName);
    }

    setProp(key, value) {
        this._userData.set(key, value);
        this.save();
        return this;
    }

    clearProps() {
        this.userData.clear();
        this.save();
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
        this.step = this.step > 1 ? this.step - 1 : 0;
        return this;
    }

    end() {
        this._step = 0;
        this._command = undefined;
        this.save();
        return this;
    }

    persist() {
        this.changed = false;
        return new Promise((res, rej) => sessions
            .insert({
                id: this.id
                ,command: this.command
                ,step: this.step
                ,userData: dbUtils.serializeMap(this.userData)
            })
            .then(() => {
                res(this);
            })
            .catch(rej));
    }

    save() {
        this.changed = true;
    }

    finish() {
        this.end();
        return this.persist();
    }

    static getInstance(id) {
        return new Promise((res, rej) => {
            sessions
                .select({id})
                .then(_session => {
                    if (_session) {
                        res(
                            new Session(id).setAll(
                                _session.command,
                                _session.step,
                                dbUtils.deserializeMap(_session.userData)
                            )
                        );
                    } else {
                        res(new Session(id));
                    }
                })
                .catch(rej);
        });
    }
}
