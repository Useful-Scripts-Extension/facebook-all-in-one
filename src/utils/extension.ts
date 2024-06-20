import { ExtensionID } from '../constants';

export async function connectExtension() {
  // TODO: type this sendMessage
  const data = sendMessage({ action: 'fb_bulkDownload_init' }) as unknown as {
    uid: string;
    fb_dtsg: string;
  };
  return data;
}

export async function fetchExtension(url: string, options = {}) {
  console.log('fetch', url, options);
  return sendMessage({
    action: 'fetch',
    url,
    options,
    // TODO: type this sendMessage
  }) as unknown as string;
}

export function sendMessage(data: {}) {
  return new Promise((resolve, reject) => {
    if (!window || !window?.chrome?.runtime)
      return reject(new Error('Cannot connect to extension Useful Scripts'));

    try {
      window?.chrome.runtime.sendMessage(ExtensionID, data, function (res) {
        res && !res.error
          ? resolve(res)
          : reject(res ? res.error : new Error('Cannot connect to extension Useful Scripts'));
      });
    } catch (err) {
      return reject(err);
    }
  });
}
