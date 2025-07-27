export interface Appointment {
    appointmentId: string;
    doctorId: string;
    patientId: string;
    slotId: string;
    appointmentStatus: string
    appointmentTime: string;
    appointmentDate: string;
    slotName: string;
    doctorName: string;
    patientName: string;
    createdAt: string;
    updatedAt: string;
    totalPages: number;
    currentPage: number;
}
