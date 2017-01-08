import env from 'dotenv-safe';
import {Tunnel} from './lib/utils';
import {info} from './lib/utils/log';

if (!process.env.noenv) env.load();

const PORT = process.env.PORT;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const HOST = process.env.LOCAL_IP;
const DOMAIN = process.env.LOCAL_URL;
const tunnel = new Tunnel();

export default class Config {

    constructor() {
        this._PORT = PORT;
        this._TELEGRAM_TOKEN = TELEGRAM_TOKEN;
        this._HOST = HOST;
        this._DOMAIN = DOMAIN;
    }

    initilialize() {
        return new Promise((ok, notok) => {
            if (!this._DOMAIN) {
                tunnel.openTunnel(this._PORT)
                    .then(host => {
                        this._DOMAIN = host;
                        info(`Ngrok tunnel opened at ${host}`);
                        ok();
                    })
                    .catch(notok);
            } else {
                ok();
            }
        });
    }


    get PORT() {
        return this._PORT;
    }

    get TELEGRAM_TOKEN() {
        return this._TELEGRAM_TOKEN;
    }

    get HOST() {
        return this._HOST;
    }

    get DOMAIN() {
        return this._DOMAIN;
    }
}
