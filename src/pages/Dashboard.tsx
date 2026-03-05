import { useState } from 'react';
import { useStore } from '../store';
import { format } from 'date-fns';
import { Check, X, AlertTriangle, Calendar as CalendarIcon, Umbrella } from 'lucide-react';
import type { Subject, DayOfWeek } from '../types';

export default function Dashboard() {
    const { semesters, subjects, attendanceRecords, settings, markAttendance } = useStore();
    const [selectedSemester, setSelectedSemester] = useState<string>(
        semesters.length > 0 ? semesters[0].id : ''
    );

    const activeSubjects = subjects.filter(s => s.semesterId === selectedSemester);

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()] as DayOfWeek;

    // Real calculation relies on our lib, but for UI sake we compute a simpler static view here
    const calculateStats = (subject: Subject) => {
        const subjectRecords = attendanceRecords.filter(r => r.subjectId === subject.id);
        const present = subjectRecords.filter(r => r.status === 'Present').length;
        const absent = subjectRecords.filter(r => r.status === 'Absent').length;
        // Real implementation would calculate total eligible up to today minus holidays
        const totalAssumedEligible = present + absent;
        const percentage = totalAssumedEligible === 0 ? 100 : Math.round((present / totalAssumedEligible) * 100);

        return { present, absent, totalAssumedEligible, percentage };
    };

    const hasSemesters = semesters.length > 0;

    if (!hasSemesters) {
        return (
            <div className="space-y-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                </header>
                <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card/50">
                    <p className="text-muted-foreground mb-4">You haven't set up any semesters yet.</p>
                    <a href="/semesters" className="text-primary hover:underline font-medium">Head to Semesters to get started.</a>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        {format(new Date(), 'EEEE, MMMM do, yyyy')}
                    </p>
                </div>
                {semesters.length > 1 && (
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="bg-card border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary max-w-[200px]"
                    >
                        {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                )}
            </header>

            {/* Today's Classes */}
            <section>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <CalendarIcon size={20} className="mr-2 text-primary" />
                    Today's Classes
                </h2>

                {activeSubjects.filter(s => s.schedule.includes(todayDayName)).length === 0 ? (
                    <div className="bg-card border border-border p-6 rounded-lg text-center">
                        <p className="text-muted-foreground">No classes scheduled for today! Enjoy your day off.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeSubjects
                            .filter(s => s.schedule.includes(todayDayName))
                            .map(subject => {
                                const todayRecord = attendanceRecords.find(r => r.subjectId === subject.id && r.date === todayStr);

                                return (
                                    <div key={subject.id} className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between hover:border-primary/50 transition">
                                        <div>
                                            <h3 className="font-bold text-lg">{subject.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">Scheduled: {todayDayName}</p>
                                        </div>

                                        <div className="mt-6 flex flex-col space-y-2">
                                            {todayRecord?.status === 'Holiday' ? (
                                                <div className="bg-muted px-4 py-3 rounded-md text-center text-sm font-medium flex items-center justify-center">
                                                    <Umbrella size={16} className="mr-2" /> Marked as Holiday
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => markAttendance(subject.id, todayStr, 'Present')}
                                                        className={`flex justify-center items-center py-2 rounded-md font-medium text-sm transition-colors ${todayRecord?.status === 'Present'
                                                            ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                                                            : 'bg-background hover:bg-muted text-foreground border border-border'
                                                            }`}
                                                    >
                                                        <Check size={16} className="mr-1" /> {todayRecord?.status === 'Present' ? 'Attended' : 'Present'}
                                                    </button>

                                                    <button
                                                        onClick={() => markAttendance(subject.id, todayStr, 'Absent')}
                                                        className={`flex justify-center items-center py-2 rounded-md font-medium text-sm transition-colors ${todayRecord?.status === 'Absent'
                                                            ? 'bg-destructive/20 text-destructive border border-destructive/50'
                                                            : 'bg-background hover:bg-muted text-foreground border border-border'
                                                            }`}
                                                    >
                                                        <X size={16} className="mr-1" /> {todayRecord?.status === 'Absent' ? 'Missed' : 'Absent'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </section>

            {/* Overview */}
            <section>
                <h2 className="text-xl font-bold mb-4">Attendance Overview</h2>

                {activeSubjects.length === 0 ? (
                    <div className="bg-card border border-border p-6 rounded-lg text-center">
                        <p className="text-muted-foreground mb-4">No subjects added to this semester yet.</p>
                        <a href="/semesters" className="text-primary hover:underline text-sm font-medium">Add Subjects</a>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {activeSubjects.map(subject => {
                            const { present, totalAssumedEligible, percentage } = calculateStats(subject);

                            let statusColor = 'text-green-500';
                            let bgColor = 'bg-green-500';
                            if (percentage < settings.minimumThreshold) {
                                statusColor = 'text-destructive';
                                bgColor = 'bg-destructive';
                            } else if (percentage < settings.minimumThreshold + 5) {
                                statusColor = 'text-accent';
                                bgColor = 'bg-accent';
                            }

                            return (
                                <div key={subject.id} className="bg-card border border-border rounded-lg p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg">{subject.name}</h3>
                                        <div className={`text-2xl font-bold ${statusColor}`}>
                                            {percentage}%
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-background rounded-full h-2.5 mb-2 overflow-hidden border border-border/50">
                                        <div className={`${bgColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                                    </div>

                                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                        <span>Target: {settings.minimumThreshold}%</span>
                                        <span>{present} / {totalAssumedEligible || 0} Classes</span>
                                    </div>

                                    {percentage < settings.minimumThreshold && (
                                        <div className="mt-4 flex bg-destructive/10 border border-destructive/20 p-3 rounded-md text-sm text-destructive items-start">
                                            <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                            <p>You are below the minimum threshold. Attend next classes to recover.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
