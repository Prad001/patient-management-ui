export interface Patient {
    [key: string]: any;
    patientId: string;
    name: string;
    gender: string;
    dateOfBirth: string;
    aadhaarNumber: string;
    contactPhone: string;
    email: string;
    address: string;
    medicalHistory: string;
    allergies: string;
    medications: string;
    consents: string;
    emergencyContact: string;
    createdAt: string;
    updatedAt: string;
    totalPages: number;
    currentPage: number
}

// PatientResponseDTO 
//     private String patientId;
//     private String name;
//     private Gender gender;
//     private LocalDate dateOfBirth;
//     private String aadhaarNumber;
//     private String contactPhone;
//     private String email;
//     private String address;
//     private String medicalHistory;
//     private String allergies;
//     private String medications;
//     private String consents;
//     private String emergencyContact;
//     private String createdAt;
//     private String updatedAt;