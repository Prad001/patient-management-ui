export interface Doctor {
    [key: string]: any;
    doctorId: string;
    name: string;
    gender: string;
    dateOfBirth: string;
    qualification: string;
    specialization: string;
    licenseNumber: string;
    affiliatedHospital: string;
    contactEmail: string;
    contactPhone: string;
    practiceLocation: string;
    roleCode: string;
    createdAt: string;
    updatedAt: string;
    totalPages: number;
    currentPage: number
    password: string;
}