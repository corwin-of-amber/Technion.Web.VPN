import child_process from 'child_process';
import sudo from 'sudo-prompt';
import './index.css';


class SAML {
    webview: HTMLWebViewElement

    constructor(webview: HTMLWebViewElement) {
        this.webview = webview;
        this.webview.src = this.LOGIN_URL;
    }

    getCookie(name) {
        return new Promise<string>((resolve, reject) => {
            // @ts-ignore
            chrome.cookies.get({
                // @ts-ignore
                storeId: this.webview.getCookieStoreId(),
                url: this.webview.src, name},
                (ret) => { if (ret) resolve(ret.value); else reject('cookie not found'); });
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


function main() {
    let saml = new SAML(document.querySelector('#login'));

    setTimeout(async () => {
        try {
        var dsid = await saml.getCookie('DSID');
        console.log(dsid);
        }
        catch (e) { console.error(e); }
        let oc = new Subprocess(document.querySelector('#term'), ['./a.out', dsid]);
        Object.assign(window, {oc});
    }, 1000);

    Object.assign(window, {saml});
}

document.addEventListener('DOMContentLoaded', main);