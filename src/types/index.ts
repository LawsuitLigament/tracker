export interface Semester {
    id: string;
    name: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Subject {
    id: string;
    semesterId: string;
    name: string;
    schedule: DayOfWeek[]; // Days this subject occurs
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Holiday';

export interface AttendanceRecord {
    id: string;
    subjectId: string;
    date: string; // ISO date string (YYYY-MM-DD)
    status: AttendanceStatus;
}

export interface Holiday {
    id: string;
    date: string; // ISO date string (YYYY-MM-DD)
    name: string;
}

export interface Settings {
    minimumThreshold: number; // e.g. 75
}

// Helper types for state
export interface AppState {
    semesters: Semester[];
    subjects: Subject[];
    attendanceRecords: AttendanceRecord[];
    holidays: Holiday[];
    settings: Settings;

    // Actions
    addSemester: (semester: Omit<Semester, 'id'>) => void;
    updateSemester: (id: string, semester: Partial<Semester>) => void;
    deleteSemester: (id: string) => void;

    addSubject: (subject: Omit<Subject, 'id'>) => void;
    updateSubject: (id: string, subject: Partial<Subject>) => void;
    deleteSubject: (id: string) => void;

    markAttendance: (subjectId: string, date: string, status: AttendanceStatus) => void;

    addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
    removeHoliday: (id: string) => void;

    updateSettings: (settings: Partial<Settings>) => void;
}
