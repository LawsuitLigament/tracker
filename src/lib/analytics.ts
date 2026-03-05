import type { Semester, Subject, AttendanceRecord, Holiday, DayOfWeek } from '../types';
import { parseISO, eachDayOfInterval, format, isBefore, isAfter } from 'date-fns';

const daysOfWeekMap: Record<number, DayOfWeek> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
};

/**
 * Get total scheduled classes and total attended classes for a specific subject
 * between the semester start date and today (or semester end date, whichever is earlier).
 */
export function getSubjectStats(
    subject: Subject,
    semester: Semester,
    records: AttendanceRecord[],
    holidays: Holiday[]
) {
    let totalEligible = 0;
    let totalAttended = 0;
    let totalAbsent = 0;

    const start = parseISO(semester.startDate);
    const end = parseISO(semester.endDate);
    const today = new Date();

    // If the semester hasn't started yet, stats are 0
    if (isAfter(start, today)) {
        return { totalEligible, totalAttended, totalAbsent, percentage: 100 };
    }

    // We only calculate up to today OR the end of the semester, whichever is earlier.
    const calcEnd = isBefore(today, end) ? today : end;

    const daysInInterval = eachDayOfInterval({ start, end: calcEnd });

    // Map holidays to avoid repeating array iterations
    const holidayDates = holidays.map((h) => h.date);

    // Map records to a quick lookup
    const subjectRecords = records.filter((r) => r.subjectId === subject.id);
    const recordMap: Record<string, AttendanceRecord['status']> = {};
    subjectRecords.forEach((r) => {
        recordMap[r.date] = r.status;
    });

    daysInInterval.forEach((day) => {
        const dayName = daysOfWeekMap[day.getDay()];
        const dateStr = format(day, 'yyyy-MM-dd');

        // Is this subject scheduled for this day of the week?
        if (subject.schedule.includes(dayName)) {
            // Is today a global holiday?
            const isGlobalHoliday = holidayDates.includes(dateStr);

            // OR maybe the user marked it specifically as "Holiday" in the records
            const isRecordHoliday = recordMap[dateStr] === 'Holiday';

            if (!isGlobalHoliday && !isRecordHoliday) {
                totalEligible++;

                // Calculate attendance based on explicit records
                if (recordMap[dateStr] === 'Present') {
                    totalAttended++;
                } else if (recordMap[dateStr] === 'Absent') {
                    totalAbsent++;
                }
                // If there's no record but the day has passed, it's 'Unmarked' but still counts in 'totalEligible'
            }
        }
    });

    const percentage = totalEligible === 0 ? 100 : (totalAttended / totalEligible) * 100;

    return { totalEligible, totalAttended, totalAbsent, percentage };
}

/**
 * Find how many classes the user can safely miss without dipping below threshold.
 */
export function calculateRisk(
    subject: Subject,
    semester: Semester,
    records: AttendanceRecord[],
    holidays: Holiday[],
    threshold: number
) {
    // Current stats up to today
    const { totalEligible, totalAttended } = getSubjectStats(subject, semester, records, holidays);

    const end = parseISO(semester.endDate);
    const today = new Date();

    // Calculate FUTURE eligible classes
    let futureEligible = 0;
    if (isBefore(today, end)) {
        const nextDay = new Date(today);
        nextDay.setDate(nextDay.getDate() + 1);

        // Only count if nextDay is not after end
        if (!isAfter(nextDay, end)) {
            const futureDays = eachDayOfInterval({ start: nextDay, end });
            const holidayDates = holidays.map((h) => h.date);

            futureDays.forEach((day) => {
                const dayName = daysOfWeekMap[day.getDay()];
                const dateStr = format(day, 'yyyy-MM-dd');

                if (subject.schedule.includes(dayName)) {
                    if (!holidayDates.includes(dateStr)) {
                        futureEligible++;
                    }
                }
            });
        }
    }

    const finalTotalEligible = totalEligible + futureEligible;

    // Let M = Max allowed absences.
    // We want to attend exactly enough classes to hit exactly the threshold:
    // (finalTotalEligible - M) / finalTotalEligible = threshold / 100
    // M = finalTotalEligible - (finalTotalEligible * threshold / 100)
    // Which actually represents total allowed absences across the whole semester.
    // Since they might have already missed some, the *remaining* allowed absences is:
    // Remaining_M = M - totalAbsent_So_Far

    // Wait, the formula for Safe Misses (Future Misses) is easier:
    // Target total classes to be present across whole semester to hit minimum threshold:
    const targetRequiredAttended = Math.ceil((finalTotalEligible * threshold) / 100);

    // They already attended `totalAttended`. 
    // Remaining to attend = targetRequiredAttended - totalAttended
    const remainingRequired = Math.max(0, targetRequiredAttended - totalAttended);

    // If they need to attend `remainingRequired` out of `futureEligible`,
    // the ones they can miss is (futureEligible - remainingRequired)
    const safeMisses = Math.max(0, futureEligible - remainingRequired);

    return { futureEligible, remainingRequired, safeMisses };
}
