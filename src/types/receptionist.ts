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
