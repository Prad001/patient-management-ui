export interface Slot {
    [key: string]: any;
    slotId: string;
    name: string;
    sessionDuration: number;
    startTime: string; // ISO 8601 format (e.g., "10:00:00")
    endTime: string; // ISO 8601 format (e.g., "13:00:00")
    createdAt?: Date; // Optional, if you want to track when the slot was created
    updatedAt?: Date; // Optional, if you want to
}