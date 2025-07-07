export interface Receptionist {
    [key: string]: any; // 👈 allow arbitrary string keys
  receptionistId: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  employeeCode: string;
  department: string;
  contactEmail: string;
  contactPhone: string;
  assignedFacility: string; 
  roleTitle: string;  
  accessLevel: string; 

  lastLogin: string;
  status: string;
  updatedAt: string;
  createdAt: string;
  totalPages:number;
  currentPage:number
}

// public enum ReceptionistStatus {
//     ACTIVE,
//     INACTIVE,
//     TERMINATED
// }
// package com.adminservice.receptionist.enums;

// public enum ReceptionistAccessLevel {
//     READ_ONLY,
//     SCHEDULING,
//     BILLING,
//     ADMIN
// }
// package com.adminservice.receptionist.enums;

// public enum Gender {
//     M,
//     F,
//     O
// }

// {
//   "name": "Jane Johnson",
//   "gender": "F",
//   "dateOfBirth": "1992-05-15",
//   "employeeCode": "EMP36729",
//   "department": "Outpatient Services",
//   "contactEmail": "Jane.johnson@example.com",
//   "contactPhone": "7980087266",
//   "assignedFacility": "Downtown Medical Center",
//   "roleTitle": "Front Desk Receptionist",
//   "accessLevel": "ADMIN",
//   "lastLogin": "",
//   "status": "ACTIVE"
// }

// public class ReceptionistResponseDTO {
//   String receptionistId;
//   String name;
//   Gender gender;
//   LocalDate dateOfBirth;
//   String employeeCode;
//   String department;
//   String contactEmail;
//   String contactPhone;
//   String assignedFacility;
//   String roleTitle;
//     private ReceptionistAccessLevel accessLevel;
//     private OffsetDateTime lastLogin;
//     private ReceptionistStatus status;
// private OffsetDateTime createdAt;
//     private OffsetDateTime updatedAt;
