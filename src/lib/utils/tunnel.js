import ngrok from 'ngrok';

export default class TunnelUtils {

    constructor() {
        if (process.env.NGROK_TOKEN) ngrok.authtoken(process.env.NGROK_TOKEN);
    }

    openTunnel(port) {
        return new Promise((res, rej) => [
            ngrok.connect(port, (err, host) => {
                if (err) rej(err);
                res(host.replace(/https?:\/\//, ''));
            })
        ]);
    }
}
