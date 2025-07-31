export const clean = s => s?.replace(/[–—]+/g, '')
    .trim() || '';

// Parse dates in dd/mm/YYYY format for sorting.
export function parseDate(dateStr) {
    let parts = dateStr.split("/");
    if (parts.length !== 3) return new Date(0);
    return new Date(parts[2], parts[1] - 1, parts[0]);
}