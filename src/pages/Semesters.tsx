import { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2 } from 'lucide-react';
import type { DayOfWeek } from '../types';

export default function Semesters() {
    const { semesters, subjects, addSemester, deleteSemester, addSubject, deleteSubject } = useStore();
    const [isAddingSemester, setIsAddingSemester] = useState(false);
    const [newSemesterName, setNewSemesterName] = useState('');
    const [newSemesterStart, setNewSemesterStart] = useState('');
    const [newSemesterEnd, setNewSemesterEnd] = useState('');

    const [addingSubjectTo, setAddingSubjectTo] = useState<string | null>(null);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);

    const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleAddSemester = () => {
        if (newSemesterName && newSemesterStart && newSemesterEnd) {
            addSemester({
                name: newSemesterName,
                startDate: newSemesterStart,
                endDate: newSemesterEnd
            });
            setIsAddingSemester(false);
            setNewSemesterName('');
        }
    };

    const handleAddSubject = (semesterId: string) => {
        if (newSubjectName && selectedDays.length > 0) {
            addSubject({
                semesterId,
                name: newSubjectName,
                schedule: selectedDays
            });
            setAddingSubjectTo(null);
            setNewSubjectName('');
            setSelectedDays([]);
        }
    };

    const toggleDay = (day: DayOfWeek) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    return (
        <div className="space-y-6">
            <header className="mb-8 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Semesters</h1>
                    <p className="text-muted-foreground mt-1">Manage your academic terms and subjects.</p>
                </div>
                {!isAddingSemester && (
                    <button
                        onClick={() => setIsAddingSemester(true)}
                        className="bg-primary text-primary-foreground flex items-center px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition text-sm">
                        <Plus size={16} className="mr-2" />
                        Add Semester
                    </button>
                )}
            </header>

            {isAddingSemester && (
                <div className="bg-card border border-border p-5 rounded-lg mb-6">
                    <h3 className="font-semibold mb-4 text-foreground">New Semester</h3>
                    <div className="grid gap-4 md:grid-cols-3 mb-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Name</label>
                            <input
                                value={newSemesterName}
                                onChange={(e) => setNewSemesterName(e.target.value)}
                                placeholder="e.g. Fall 2026"
                                className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
                            <input
                                type="date"
                                value={newSemesterStart}
                                onChange={(e) => setNewSemesterStart(e.target.value)}
                                className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">End Date</label>
                            <input
                                type="date"
                                value={newSemesterEnd}
                                onChange={(e) => setNewSemesterEnd(e.target.value)}
                                className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setIsAddingSemester(false)}
                            className="px-4 py-2 text-sm rounded-md text-muted-foreground hover:bg-muted transition">
                            Cancel
                        </button>
                        <button
                            onClick={handleAddSemester}
                            className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-md font-medium hover:bg-primary/90 transition">
                            Save
                        </button>
                    </div>
                </div>
            )}

            {semesters.length === 0 && !isAddingSemester ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card/50">
                    <p className="text-muted-foreground mb-4">No semesters added yet.</p>
                    <button
                        onClick={() => setIsAddingSemester(true)}
                        className="text-primary hover:underline text-sm font-medium">
                        Create your first semester
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {semesters.map((semester) => (
                        <div key={semester.id} className="bg-card border border-border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">{semester.name}</h2>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(semester.startDate).toLocaleDateString()} - {new Date(semester.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Delete this semester and all its subjects?')) deleteSemester(semester.id);
                                    }}
                                    className="p-2 text-muted-foreground hover:text-destructive transition rounded-full hover:bg-background">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Subjects</h3>
                                    <button
                                        onClick={() => setAddingSubjectTo(semester.id)}
                                        className="text-xs font-medium text-primary hover:text-primary/80 flex items-center">
                                        <Plus size={14} className="mr-1" /> Add Subject
                                    </button>
                                </div>

                                {addingSubjectTo === semester.id && (
                                    <div className="bg-background border border-border p-4 rounded-md mb-4">
                                        <input
                                            value={newSubjectName}
                                            onChange={(e) => setNewSubjectName(e.target.value)}
                                            placeholder="Subject Name (e.g. Data Structures)"
                                            className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary mb-3"
                                        />
                                        <div className="mb-4">
                                            <p className="text-xs text-muted-foreground mb-2">Select Days:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {days.map(day => (
                                                    <button
                                                        key={day}
                                                        onClick={() => toggleDay(day)}
                                                        className={`px-3 py-1 text-xs rounded-full border transition ${selectedDays.includes(day)
                                                            ? 'bg-primary border-primary text-primary-foreground'
                                                            : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                                                            }`}
                                                    >
                                                        {day.slice(0, 3)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setAddingSubjectTo(null)}
                                                className="px-3 py-1.5 text-xs rounded text-muted-foreground hover:bg-muted transition">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleAddSubject(semester.id)}
                                                className="bg-primary text-primary-foreground px-3 py-1.5 text-xs rounded font-medium hover:bg-primary/90 transition">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {subjects.filter(s => s.semesterId === semester.id).map(subject => (
                                        <div key={subject.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-md hover:border-primary/50 transition">
                                            <div>
                                                <p className="font-medium text-sm text-foreground">{subject.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {subject.schedule.join(', ')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Delete subject?')) deleteSubject(subject.id);
                                                }}
                                                className="text-muted-foreground hover:text-destructive p-1">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {subjects.filter(s => s.semesterId === semester.id).length === 0 && addingSubjectTo !== semester.id && (
                                        <p className="text-xs text-muted-foreground italic">No subjects added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
