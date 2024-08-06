export function objectToCsv(arr) {
    const csvRows = [];

    // Get the headers of the CSV file
    const headers = Object.keys(arr[0]);
    csvRows.push(headers.join(','));

    // Loop through each object in the array and convert it to a CSV row
    for (const row of arr) {
        const values = headers.map(header => {
            const cellValue = row[header];
            const escapedCellValue = cellValue?.toString().replace(/"/g, '\\"') || '';
            return `"${escapedCellValue}"`;
        });
        csvRows.push(values.join(','));
    }

    // Join all the CSV rows with a newline character
    return csvRows.join('\n');
}

export function formatTime(t) {
    return new Date(parseInt(t)).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: !0,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// https://stackoverflow.com/a/37511463/11898496
export function removeAccent(str = '') {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// https://stackoverflow.com/a/52453462/11898496

export function formatNumberWithCommas(x) {
    if (!x) return 0;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function limitString(str, len) {
    if (!str) return '';
    if (str.length <= len) return str;
    return str.slice(0, len) + '...';
}

export function formatSeconds(seconds) {
    // return hh:mm:ss
    let hh = Math.floor(seconds / 3600);
    let mm = Math.floor((seconds % 3600) / 60);
    let ss = Math.floor((seconds % 3600) % 60);
    let str = '';
    if (hh > 0) str += `${hh}:`;
    if (mm < 10) str += `0${mm}:`;
    else str += `${mm}:`;
    if (ss < 10) str += `0${ss}`;
    else str += `${ss}`;
    return str;
}

// modified based on: https://gist.github.com/jcouyang/632709f30e12a7879a73e9e132c0d56b
export function promiseAllStepN(n, list) {
    const pool = list.slice(0, n);
    const remains = list.slice(n);
    const resolved = [];
    let stop = false;

    return {
        start: () =>
            new Promise(resolve => {
                let processed = 0;
                function runNext(pool_index) {
                    if (processed === remains.length || stop) {
                        resolve(Promise.all(resolved));
                        return;
                    }
                    const promise = remains[processed](processed, pool_index);
                    resolved.push(
                        promise.then(result => {
                            runNext(pool_index);
                            return result;
                        })
                    );
                    processed++;
                }
                pool.forEach((func, pool_index) => {
                    const promise = func(processed, pool_index);
                    resolved.push(
                        promise.then(result => {
                            runNext(pool_index);
                            return result;
                        })
                    );
                });
            }),
        stop: () => {
            stop = true;
        },
    };
}

// https://github.com/parshap/node-sanitize-filename/blob/master/index.js
// https://github.com/Dinoosauro/tiktok-to-ytdlp/blob/main/script.js
export function sanitizeName(name, modifyIfPosible = true) {
    if (typeof name !== 'string') {
        throw new Error('Input must be string');
    }
    const replacement = '';
    const illegalRe = /[\/\?<>\\:\*\|"]/g;
    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
    const reservedRe = /^\.+$/;
    const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    const windowsTrailingRe = /[\. ]+$/;
    if (modifyIfPosible) {
        name = name
            .replaceAll('<', '‹')
            .replaceAll('>', '›')
            .replaceAll(':', '∶')
            .replaceAll('"', '″')
            .replaceAll('/', '∕')
            .replaceAll('\\', '∖')
            .replaceAll('|', '¦')
            .replaceAll('?', '¿');
    }
    const sanitized = name
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement)
        .replace(windowsTrailingRe, replacement);
    return sanitized; // TODO truncates to length of 255
}

// https://stackoverflow.com/a/25456134/23648002
export function deepEqual(x, y) {
    if (x === y) {
        return true;
    } else if (typeof x == 'object' && x != null && typeof y == 'object' && y != null) {
        if (Object.keys(x).length != Object.keys(y).length) return false;

        for (let prop in x) {
            if (Object.hasOwn(y, prop)) {
                if (!deepEqual(x[prop], y[prop])) return false;
            } else return false;
        }

        return true;
    } else return false;
}

const numberFormatCached = {};
/**
 * Get number formatter
 * @param {string} optionSelect "compactLong", "standard", "compactShort"
 * @param {string|undefined} locale Browser locale
 * @return {Intl.NumberFormat}
 */
export function getNumberFormatter(optionSelect, locale) {
    if (!locale) {
        if (document.documentElement.lang) {
            locale = document.documentElement.lang;
        } else if (navigator.language) {
            locale = navigator.language;
        } else {
            try {
                locale = new URL(
                    Array.from(document.querySelectorAll("head > link[rel='search']"))
                        ?.find(n => n?.getAttribute('href')?.includes('?locale='))
                        ?.getAttribute('href')
                )?.searchParams?.get('locale');
            } catch {
                console.log('Cannot find browser locale. Use en as default for number formatting.');
                locale = 'en';
            }
        }
    }
    let formatterNotation;
    let formatterCompactDisplay;
    switch (optionSelect) {
        case 'compactLong':
            formatterNotation = 'compact';
            formatterCompactDisplay = 'long';
            break;
        case 'standard':
            formatterNotation = 'standard';
            formatterCompactDisplay = 'short';
            break;
        case 'compactShort':
        default:
            formatterNotation = 'compact';
            formatterCompactDisplay = 'short';
    }

    let key = locale + formatterNotation + formatterCompactDisplay;
    if (!numberFormatCached[key]) {
        const formatter = Intl.NumberFormat(locale, {
            notation: formatterNotation,
            compactDisplay: formatterCompactDisplay,
        });
        numberFormatCached[key] = formatter;
    }
    return numberFormatCached[key];
}

export function formatNumber(number, optionSelect, locale) {
    return getNumberFormatter(optionSelect, locale).format(number);
}
