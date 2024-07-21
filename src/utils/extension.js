import { ExtensionID } from '../constants';

export function runExtFunc(fnPath, params) {
    return sendMessage({ action: 'fb_allInOne_runFunc', fnPath, params });
}

export function fetchExtension(url, options) {
    return runExtFunc('fetch', [url, options]);
}

export function download(options) {
    return runExtFunc('chrome.downloads.download', [options]);
}

export function showDefaultDownloadFolder() {
    return runExtFunc('chrome.downloads.showDefaultFolder', []);
}

export function sendMessage(data) {
    return new Promise((resolve, reject) => {
        if (!window || !window?.chrome?.runtime)
            return reject(new Error('Cannot connect to extension Useful Scripts'));

        try {
            window.chrome.runtime.sendMessage(ExtensionID, data, function (res) {
                res && !res.error
                    ? resolve(res)
                    : reject(res ? res.error : new Error('Extension return empty'));
            });
        } catch (err) {
            return reject(err);
        }
    });
}
