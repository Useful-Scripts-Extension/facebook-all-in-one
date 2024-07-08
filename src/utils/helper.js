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

export function numberWithCommas(x) {
    if (!x) return 0;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
