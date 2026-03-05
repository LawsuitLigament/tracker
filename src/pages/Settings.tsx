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
                    <h3 className="text-lg font-medium text-foreground mb-2">Data Management</h3>
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
