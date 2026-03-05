import { useState } from 'react';
import { useStore } from '../store';
import { Trash2, Link as LinkIcon, Plus, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Holidays() {
    const { holidays, addHoliday, removeHoliday } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newHolidayName, setNewHolidayName] = useState('');
    const [newHolidayDate, setNewHolidayDate] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    const handleAddManual = () => {
        if (newHolidayName && newHolidayDate) {
            // Check if exists
            if (holidays.some(h => h.date === newHolidayDate)) {
                toast.error('Holiday already exists for this date.');
                return;
            }
            addHoliday({ name: newHolidayName, date: newHolidayDate });
            setNewHolidayName('');
            setNewHolidayDate('');
            setIsAdding(false);
            toast.success('Holiday added manually');
        }
    };

    const fetchIndianHolidays = async () => {
        setIsFetching(true);
        const currentYear = new Date().getFullYear();
        try {
            // Using Nager.Date Public Holiday API
            const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/IN`);
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();

            let addedCount = 0;
            data.forEach((holiday: any) => {
                // Only add if not already in store
                if (!holidays.some(h => h.date === holiday.date)) {
                    addHoliday({
                        name: holiday.localName || holiday.name,
                        date: holiday.date
                    });
                    addedCount++;
                }
            });
            toast.success(`Imported ${addedCount} new public holidays for ${currentYear}`);
        } catch (err) {
            toast.error('Failed to fetch Indian public holidays. Try adding manually.');
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Holidays</h1>
                    <p className="text-muted-foreground mt-1">Manage auto-excluded government holidays globally.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchIndianHolidays}
                        disabled={isFetching}
                        className="bg-secondary text-secondary-foreground flex items-center px-4 py-2 rounded-md font-medium hover:bg-secondary/90 transition text-sm disabled:opacity-50">
                        <LinkIcon size={16} className="mr-2" />
                        {isFetching ? 'Fetching...' : 'Import Indian Holidays'}
                    </button>
                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-primary text-primary-foreground flex items-center px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition text-sm">
                            <Plus size={16} className="mr-2" />
                            Manual Entry
                        </button>
                    )}
                </div>
            </header>

            <div className="bg-muted/50 border border-border p-4 rounded-lg flex items-start space-x-3 mb-6">
                <Info size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                    Holidays added here apply globally to all your semesters. If a subject is scheduled on a holiday, it automatically <strong className="text-foreground">will not</strong> be counted as an eligible class for attendance calculation.
                </p>
            </div>

            {isAdding && (
                <div className="bg-card border border-border p-5 rounded-lg mb-6 max-w-2xl">
                    <h3 className="font-semibold mb-4 text-foreground">Add Custom Holiday</h3>
                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Holiday Name</label>
                            <input
                                value={newHolidayName}
                                onChange={(e) => setNewHolidayName(e.target.value)}
                                placeholder="e.g. College Fest"
                                className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Date</label>
                            <input
                                type="date"
                                value={newHolidayDate}
                                onChange={(e) => setNewHolidayDate(e.target.value)}
                                className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-sm rounded-md text-muted-foreground hover:bg-muted transition">
                            Cancel
                        </button>
                        <button
                            onClick={handleAddManual}
                            disabled={!newHolidayName || !newHolidayDate}
                            className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-md font-medium hover:bg-primary/90 transition disabled:opacity-50">
                            Save Holiday
                        </button>
                    </div>
                </div>
            )}

            {holidays.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <AlertCircle size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No holidays added yet.</p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted border-b border-border text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Holiday Name</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {holidays
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((holiday) => (
                                    <tr key={holiday.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                                            {new Date(holiday.date).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-foreground">{holiday.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Delete this holiday?')) removeHoliday(holiday.id);
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition p-2 rounded-full hover:bg-background inline-flex">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
