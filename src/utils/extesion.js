import { ExtensionID } from '../constants';

export function connectExtension() {
    return sendMessage({ action: 'fb_allInOne_init' });
}

export function fetchExtension(url, options) {
    return sendMessage({
        action: 'fetch',
        url,
        options,
    });
}

export function sendMessage(data) {
    return new Promise((resolve, reject) => {
        if (!window || !window?.chrome?.runtime)
            return reject(new Error('Cannot connect to extension Useful Scripts'));

        try {
            window.chrome.runtime.sendMessage(ExtensionID, data, function (res) {
                res && !res.error
                    ? resolve(res)
                    : reject(
                          res ? res.error : new Error('Cannot connect to extension Useful Scripts')
                      );
            });
        } catch (err) {
            return reject(err);
        }
    });
}
