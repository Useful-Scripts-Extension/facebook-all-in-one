import { ExtensionID } from '../constants';
import { deepEqual } from './helper';

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

export async function corsInstagram() {
    const currentRules = await runExtFunc('chrome.declarativeNetRequest.getDynamicRules');
    console.log(currentRules);
    const rules = [
        {
            priority: 1,
            action: {
                type: 'modifyHeaders',
                requestHeaders: [
                    {
                        header: 'referer',
                        operation: 'set',
                        value: 'https://www.instagram.com/',
                    },
                    {
                        header: 'origin',
                        operation: 'set',
                        value: 'https://www.instagram.com',
                    },
                    {
                        header: 'sec-fetch-mode',
                        operation: 'set',
                        value: 'no-cors',
                    },
                    {
                        header: 'sec-fetch-site',
                        operation: 'set',
                        value: 'cross-site',
                    },
                    {
                        header: 'cross-origin-resource-policy',
                        operation: 'set',
                        value: 'cross-origin',
                    },
                ],
                responseHeaders: [
                    {
                        header: 'access-control-allow-origin',
                        operation: 'set',
                        value: '*',
                    },
                    {
                        header: 'X-Frame-Options',
                        operation: 'remove',
                    },
                    {
                        header: 'Content-Security-Policy',
                        operation: 'remove',
                    },
                ],
            },
            condition: {
                urlFilter: '*://*.fna.fbcdn.net/*',
                resourceTypes: ['image', 'xmlhttprequest', 'media'],
            },
        },
        {
            priority: 1,
            action: {
                type: 'modifyHeaders',
                requestHeaders: [
                    {
                        header: 'referer',
                        operation: 'set',
                        value: 'https://www.instagram.com/',
                    },
                    {
                        header: 'origin',
                        operation: 'set',
                        value: 'https://www.instagram.com',
                    },
                    {
                        header: 'sec-fetch-mode',
                        operation: 'set',
                        value: 'no-cors',
                    },
                    {
                        header: 'sec-fetch-site',
                        operation: 'set',
                        value: 'cross-site',
                    },
                    {
                        header: 'cross-origin-resource-policy',
                        operation: 'set',
                        value: 'cross-origin',
                    },
                ],
            },
            condition: {
                requestDomains: ['extension://*'],
                urlFilter: 'https://www.instagram.com/*',
                resourceTypes: ['xmlhttprequest'],
            },
        },
    ];

    const ids = await getNextDynamicRuleIds(rules.length);
    for (const rule of rules) {
        const needAddRule = !currentRules.find(_ => {
            rule.id = _.id;
            return deepEqual(rule, _);
        });
        if (!needAddRule) {
            console.log('already have rule');
            continue;
        }
        rule.id = ids.shift();
        try {
            console.log('added rule', rule);
            await runExtFunc('chrome.declarativeNetRequest.updateDynamicRules', [
                {
                    addRules: [rule],
                    removeRuleIds: [rule.id],
                },
            ]);
        } catch (e) {
            // ignore
        }
    }
    return true;
}

export async function getNextDynamicRuleIds(count = 1) {
    const ruleList = await runExtFunc('chrome.declarativeNetRequest.getDynamicRules');
    const ids = new Set(ruleList.map(rule => rule.id));

    const result = [];
    let nextAvailableId = 1;

    while (result.length < count) {
        if (!ids.has(nextAvailableId)) {
            result.push(nextAvailableId);
            ids.add(nextAvailableId);
        }
        nextAvailableId++;
    }

    return count === 1 ? result[0] : result;
}

export function sendMessage(data) {
    return new Promise((resolve, reject) => {
        if (!window || !window?.chrome?.runtime)
            return reject(new Error('Cannot connect to extension Useful Scripts'));

        try {
            window.chrome.runtime.sendMessage(ExtensionID, data, function (res) {
                res && !res.error
                    ? resolve(res)
                    : reject(res?.error || new Error('Extension return empty'));
            });
        } catch (err) {
            return reject(err);
        }
    });
}
