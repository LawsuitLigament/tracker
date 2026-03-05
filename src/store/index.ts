import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            semesters: [],
            subjects: [],
            attendanceRecords: [],
            holidays: [],
            settings: {
                minimumThreshold: 75,
            },

            addSemester: (sem) =>
                set((state) => ({
                    semesters: [
                        ...state.semesters,
                        { ...sem, id: crypto.randomUUID() },
                    ],
                })),

            updateSemester: (id, updatedSem) =>
                set((state) => ({
                    semesters: state.semesters.map((s) =>
                        s.id === id ? { ...s, ...updatedSem } : s
                    ),
                })),

            deleteSemester: (id) =>
                set((state) => {
                    const subjectIdsToRemove = state.subjects
                        .filter((sub) => sub.semesterId === id)
                        .map((sub) => sub.id);

                    return {
                        semesters: state.semesters.filter((s) => s.id !== id),
                        subjects: state.subjects.filter((sub) => sub.semesterId !== id),
                        attendanceRecords: state.attendanceRecords.filter(
                            (r) => !subjectIdsToRemove.includes(r.subjectId)
                        ),
                    };
                }),

            addSubject: (sub) =>
                set((state) => ({
                    subjects: [
                        ...state.subjects,
                        { ...sub, id: crypto.randomUUID() },
                    ],
                })),

            updateSubject: (id, updatedSub) =>
                set((state) => ({
                    subjects: state.subjects.map((s) =>
                        s.id === id ? { ...s, ...updatedSub } : s
                    ),
                })),

            deleteSubject: (id) =>
                set((state) => ({
                    subjects: state.subjects.filter((s) => s.id !== id),
                    attendanceRecords: state.attendanceRecords.filter(
                        (r) => r.subjectId !== id
                    ),
                })),

            markAttendance: (subjectId, date, status) =>
                set((state) => {
                    const existingRecordIndex = state.attendanceRecords.findIndex(
                        (r) => r.subjectId === subjectId && r.date === date
                    );

                    if (existingRecordIndex >= 0) {
                        const updatedRecords = [...state.attendanceRecords];
                        updatedRecords[existingRecordIndex] = {
                            ...updatedRecords[existingRecordIndex],
                            status,
                        };
                        return { attendanceRecords: updatedRecords };
                    }

                    return {
                        attendanceRecords: [
                            ...state.attendanceRecords,
                            { id: crypto.randomUUID(), subjectId, date, status },
                        ],
                    };
                }),

            addHoliday: (holiday) =>
                set((state) => ({
                    holidays: [
                        ...state.holidays,
                        { ...holiday, id: crypto.randomUUID() },
                    ],
                })),

            removeHoliday: (id) =>
                set((state) => ({
                    holidays: state.holidays.filter((h) => h.id !== id),
                })),

            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),
        }),
        {
            name: 'attendanceiq-storage',
        }
    )
);
