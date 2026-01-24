const xlsx = require('xlsx');

const REQUIRED_FIELDS = ['Name', 'Email', 'Phone', 'RegNo', 'Status', 'Balance', 'DueDate'];

const mapColumns = (headers) => {
    const mapping = {};
    const missing = [];

    REQUIRED_FIELDS.forEach(field => {
        // Simple heuristic: check if header includes the field name (case-insensitive)
        const match = headers.find(h => h.toLowerCase().includes(field.toLowerCase()) ||
            (field === 'RegNo' && h.toLowerCase().includes('reg')) ||
            (field === 'Balance' && h.toLowerCase().includes('amount')));
        if (match) {
            mapping[field] = match;
        } else {
            missing.push(field);
        }
    });

    return { mapping, missing };
};

const processExcel = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) return { error: 'Empty file' };

    const headers = Object.keys(data[0]);
    const { mapping, missing } = mapColumns(headers);

    return {
        headers,
        mapping,
        missing,
        preview: data.slice(0, 5), // Preview first 5 rows
        totalRows: data.length
    };
};

module.exports = { processExcel };
