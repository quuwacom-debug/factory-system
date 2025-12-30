import { addDays, format, parseISO } from 'date-fns';

export const HAWL_DURATION_DAYS = 354; // One Lunar Year (Hijri)

export function calculateHawlDueDate(startDateStr: string | null): Date | null {
    if (!startDateStr) return null;
    const startDate = parseISO(startDateStr);
    return addDays(startDate, HAWL_DURATION_DAYS);
}

export function formatGregorianDate(date: Date): string {
    return format(date, 'MMMM d, yyyy');
}
