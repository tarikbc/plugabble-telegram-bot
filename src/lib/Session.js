import { hasType } from './utils/types';
import { isAdmin } from './utils/admin';
import { session as sessions } from './db';
import dbUtils from './utils/db';
import SessionsPool from './SessionsPool';

export default class Session {
    /**
     * Cria uma nova instância da classe Session
     * @param {number} id ID do Telegram a ser utilizado como ID da sessão
     */
    constructor(id) {
        this._id = id;
        this._step = 0;
        this._userData = new Map();
        this._changed = false;
    }

    /**
     * Id da sessão, igual ao ID do Telegram
     * @returns {number}
     */
    get id() {
        return this._id;
    }

    /**
     * @param {number} id
     */
    set id(id) {
        this._id = id;
    }

    /**
     * Nome do comando atual
     * @returns {string|undefined}
     */
    get command() {
        return this._command;
    }

    /**
     * @param {string|undefined} command
     */
    set command(command) {
        this._command = command;
        this.save();
    }

    /**
     * Passo atual da waterfall do comando
     * @returns {number}
     */
    get step() {
        return this._step;
    }

    /**
     * @param {number} step
     */
    set step(step) {
        if (hasType(step, 'number')) this._step = step;
        else throw new TypeError('step precisa ser um número!');
    }

    /**
     * Dados do usuário salvos no banco
     * @returns {undefined|Map}
     */
    get userData() {
        return this._userData;
    }

    /**
     * @param {undefined|Map} userData
     */
    set userData(userData) {
        if (hasType(userData, 'map')) {
            this._userData = userData;
            this.save();
        } else
            throw new TypeError('userData precisa ser um map!');
    }

    /**
     * Indica se a sessão foi alterada e não foi salva no banco
     * @returns {boolean}
     */
    get changed() {
        return this._changed;
    }

    /**
     * @param {boolean} changed
     */
    set changed(changed) {
        this._changed = changed;
    }

    /**
     * Indica se o usuário da sessão atual é um dos administradores do Bot
     */
    get isAdmin() {
        return isAdmin(this.id);
    }

    /**
     * Define todas as propriedades de uma vez
     * @param {string|undefined} command
     * @param {number} step
     * @param {Map} userData
     * @returns {Session}
     */
    setAll(command, step, userData) {
        this.command = command;
        this.step = step;
        this.userData = userData;
        this.save();
        return this;
    }

    /**
     * Retorna dados do usuário salvos no banco e associados à chave informada
     * @param {string} propertyName
     * @returns {*}
     */
    getProp(propertyName) {
        if (this._userData.has(propertyName))
            return this._userData.get(propertyName);
    }

    /**
     * Define dados do usuário a os salva no banco
     * @param {string} key
     * @param {*} value
     * @returns {Session}
     */
    setProp(key, value) {
        this._userData.set(key, value);
        this.save();
        return this;
    }

    /**
     * Apaga todos os dados do usuário salvos no banco
     * @returns {Session}
     */
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

    /**
     * Avança um passo na waterfall do comando em execução
     * @returns {Session}
     */
    next() {
        this.step = this.step + 1;
        return this;
    }

    /**
     * Retrocede um passo na waterfall do comando em execução
     * @returns {Session}
     */
    prev() {
        this.step = this.step > 1 ? this.step - 1 : 0;
        return this;
    }

    /**
     * Finaliza a sessão atual
     * @returns {Session}
     */
    end() {
        this._step = 0;
        this._command = undefined;
        this.save();
        return this;
    }

    /**
     * Salva a sessão atual no banco
     * @returns {Promise}
     */
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

    /**
     * Ativa a chave que indica que a sessão contém dados que não foram salvos no banco
     */
    save() {
        this.changed = true;
    }

    /**
     * Finaliza a sessão e a salva no banco
     * @returns {Promise}
     */
    finish() {
        this.end();
        return this.persist();
    }

    /**
     * Factory de sessões do banco
     * @param {number} id
     * @param {Object} _session
     * @returns {Session}
     */
    static deserialize(id, _session) {
        return new Session(id).setAll(
            _session.command,
            _session.step,
            dbUtils.deserializeMap(_session.userData)
        );
    }

    /**
     * Retorna uma instância de sessão de acordo com o ID informado;
     * Caso a sessão já tenha sido carregada do banco, não cria uma nova instância
     * @param {number} id
     * @param {boolean} forceReload Define se deve recarregar os dados do banco mesmo que a sessão já exista na pool
     * @returns {Promise}
     */
    static getInstance(id, forceReload = false) {
        return new Promise((res, rej) => {
            const session = SessionsPool.get(id);
            if (!session || forceReload) {
                sessions
                    .select({ id })
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

    static getIds() {
        return new Promise((res, rej) => {
            sessions.getAll()
                .then(data => res(data.map(el => el.id)))
                .catch(rej);
        });
    }
}
