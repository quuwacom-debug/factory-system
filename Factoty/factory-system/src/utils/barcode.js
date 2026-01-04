export function generateWorkerId() {
    // Simple ID generation: W-YYYY-RANDOM
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    return `W-${year}-${random}`;
}

export function generateBarcode(workerId) {
    // in a real app, this might return a data URL for a barcode image
    // for now, we just return the string which works for "scanning" logic
    return workerId;
}
