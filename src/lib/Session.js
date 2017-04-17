import {hasType} from './utils/types';
import {isAdmin} from './utils/admin';
import {session as sessions} from './db';
import dbUtils from './utils/db';
import SessionsPool from './SessionsPool';

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

    get isAdmin() {
        return isAdmin(this.id);
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

    /**
     * Sets the session's command to {command} and the step to 1
     * @param {string} command Command to pass the control of the session to
     * @return {Session} section with the command set to {command} and step set to 1
     */
    start(command) {
        this.command = command;
        this.step = 1;
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
                , command: this.command
                , step: this.step
                , userData: dbUtils.serializeMap(this.userData)
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

    static deserialize(id, _session) {
        return new Session(id).setAll(
            _session.command,
            _session.step,
            dbUtils.deserializeMap(_session.userData)
        );
    }

    static getInstance(id, forceReload = false) {
        return new Promise((res, rej) => {
            const session = SessionsPool.get(id);
            if (!session || forceReload) {
                sessions
                    .select({id})
                    .then(_session => {
                        const _newSession = _session ? this.deserialize(id, _session) : new Session(id);
                        SessionsPool.set(id, _newSession);
                        res(_newSession);
                    })
                    .catch(rej);
            } else {
                res(session);
            }
        });
    }
}
