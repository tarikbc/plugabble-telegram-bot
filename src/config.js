/**
 * Caso precise alterar a forma como alguma configuração
 * é definida, você pode fazê-lo abaixo.
 */
import env from 'dotenv-safe';
import { Tunnel } from './lib/utils';
import { info } from './lib/utils/log';

if (!process.env.noenv) env.load();

/**
 * Você pode, por exemplo, definir PORT como
 * process.env.OPENSHIFT_NODEJS_PORT caso pretenda
 * executar o bot na plataforma da RedHat
 */
const PORT = process.env.PORT;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const HOST = process.env.LOCAL_IP;
const DOMAIN = process.env.LOCAL_URL;
const tunnel = new Tunnel();
const POLLING = process.env.POLLING;
export default class Config {

    constructor() {
        this._PORT = PORT;
        this._TELEGRAM_TOKEN = TELEGRAM_TOKEN;
        this._HOST = HOST;
        this._DOMAIN = DOMAIN;
        this._WEBHOOK = true;
        this._POLLING = POLLING;
    }

    initilialize() {
        return new Promise(ok =>
            if(this._DOMAIN) ok();
            else  if(!this._POLLING) {
                tunnel.openTunnel(this._PORT)
                    .then(host => {
                        this._DOMAIN = host;
                        info(`Ngrok tunnel opened at ${host}`);
                        ok();
                    })
                    .catch(() => {
                        this._WEBHOOK = false;
                        ok();
                    })
            } else {
                this._WEBHOOK = false;
                ok();
            }
        );
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

    get WEBHOOK() {
        return this._WEBHOOK;
    }
}
