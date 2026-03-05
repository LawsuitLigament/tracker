import React from 'react';
import { useStore } from '../store';

export default function Settings() {
    const settings = useStore((state) => state.settings);
    const updateSettings = useStore((state) => state.updateSettings);

    const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            updateSettings({ minimumThreshold: val });
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Configure your attendance preferences.</p>
            </header>

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div>
                    <label htmlFor="threshold" className="block text-sm font-medium text-foreground mb-2">
                        Minimum Attendance Threshold (%)
                    </label>
                    <p className="text-sm text-muted-foreground mb-4">
                        You will be warned if your attendance drops below this percentage.
                    </p>
                    <div className="flex items-center space-x-4">
                        <input
                            type="number"
                            id="threshold"
                            value={settings.minimumThreshold}
                            onChange={handleThresholdChange}
                            min="0"
                            max="100"
                            className="bg-input border border-border rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none w-24"
                        />
                        <span className="text-foreground font-medium">%</span>
                    </div>
                </div>

                <hr className="border-border" />

                <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Backup & Restore</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Export your data to a file to back it up, or import a previously saved file.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => {
                                const state = useStore.getState();
                                const dataToExport = {
                                    semesters: state.semesters,
                                    subjects: state.subjects,
                                    attendanceRecords: state.attendanceRecords,
                                    holidays: state.holidays,
                                    settings: state.settings,
                                };
                                const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `track-backup-${new Date().toISOString().split('T')[0]}.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition text-sm">
                            Export Data
                        </button>

                        <label className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:bg-secondary/80 transition text-sm cursor-pointer inline-flex items-center">
                            Import Data
                            <input
                                type="file"
                                accept=".json"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        try {
                                            const content = event.target?.result as string;
                                            const parsedData = JSON.parse(content);

                                            // Validate basic structure
                                            if (parsedData.semesters && parsedData.subjects) {
                                                useStore.setState({
                                                    semesters: parsedData.semesters,
                                                    subjects: parsedData.subjects,
                                                    attendanceRecords: parsedData.attendanceRecords || [],
                                                    holidays: parsedData.holidays || [],
                                                    settings: parsedData.settings || { minimumThreshold: 75 }
                                                });
                                                alert('Data imported successfully!');
                                            } else {
                                                alert('Invalid backup file format.');
                                            }
                                        } catch (err) {
                                            alert('Failed to parse backup file.');
                                            console.error(err);
                                        }
                                        // Reset the input
                                        e.target.value = '';
                                    };
                                    reader.readAsText(file);
                                }}
                            />
                        </label>
                    </div>
                </div>

                <hr className="border-border" />

                <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Your data is stored locally on this device. Clearing your browser data will erase your attendance records.
                    </p>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete all data? This cannot be undone.')) {
                                localStorage.removeItem('attendanceiq-storage');
                                window.location.reload();
                            }
                        }}
                        className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-medium hover:bg-destructive/90 transition text-sm">
                        Clear All Data
                    </button>
                </div>
            </div>
        </div>
    );
}
