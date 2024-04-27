import child_process from 'child_process';
import './index.css';

import Split from 'split.js';


class SAML {
    webview: HTMLWebViewElement
    lastError: Error

    constructor(webview: HTMLWebViewElement) {
        this.webview = webview;
        this.webview.src = this.LOGIN_URL;
    }

    getCookie(name: string) {
        return new Promise<string>((resolve, reject) => {
            // @ts-ignore
            chrome.cookies.get({
                // @ts-ignore
                storeId: this.webview.getCookieStoreId(),
                url: this.webview.src, name},
                (ret) => { if (ret) resolve(ret.value); else reject('cookie not found'); });
        });
    }

    waitForCookie(name: string) {
        return new Promise<string>(resolve => {
            let h = async () => {
                try { resolve(this.getCookie(name)); cleanup(); }
                catch (e) { this.lastError = e; }
            };
            let cleanup = () => this.webview.removeEventListener('contentload', h);
            this.webview.addEventListener('contentload', h);
        });
    }

    readonly LOGIN_URL = 'https://vpn.technion.ac.il'
}


class Subprocess {
    output: HTMLPreElement
    proc: child_process.ChildProcessWithoutNullStreams

    td = new TextDecoder

    constructor(output: HTMLPreElement, cmd: string[]) {
        this.output = output;
        this.proc = child_process.spawn(cmd[0], cmd.slice(1), {stdio: 'pipe'});
        this.proc.stdout.addListener('data', d => this.termout(d));
        this.proc.stderr.addListener('data', d => this.termout(d));
    }

    termout(data: string | Uint8Array) {
        if (data instanceof Uint8Array) data = this.td.decode(data);
        this.output.innerText += data;
    }
}


class AgentSubprocess extends Subprocess {

    constructor(dsid: string) {
        super(document.querySelector('#term'), ['./agent', dsid]);
        window.addEventListener('beforeunload', () => this.terminate());
    }

    terminate() {
        this.proc.stdin.end();
    }
}


function main() {
    let saml = new SAML(document.querySelector('#login'));

    let ui = Split(['#login-pane', '#output-pane'], {gutterSize: 5});

    let connect = (dsid) => {
        let oc = new AgentSubprocess(dsid);
        Object.assign(window, {oc});
    };

    (async () => {
        var dsid = await saml.waitForCookie('DSID');
        console.log('DSID =', dsid);
        connect(dsid);
    })();

    Object.assign(window, {saml, connect});
}

document.addEventListener('DOMContentLoaded', main);