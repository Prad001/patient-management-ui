import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Patient } from 'src/types/patient';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap } from 'rxjs';
import { ErrorHandlingService } from '../shared/service/errorHandling.service';
import { API_ENDPOINTS } from '../receptionist-endpoints';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private readonly apiUrl = environment.patientUrl;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService
    ) { }

    getPatient(patientid: string): Observable<Patient> {
        console.log('patient by id URL:', `${this.apiUrl}${API_ENDPOINTS.PATIENT.GET}/${patientid}`);
        return this.http
            .get<Patient>(`${this.apiUrl}${API_ENDPOINTS.PATIENT.GET}/${patientid}`)
            .pipe(
                tap((response) => console.log('Raw API response:', response)),
                catchError((error) => this.errorHandlingService.handleError(error))
            )
    }

    createPatient(
        name: string,
        gender: string,
        dateOfBirth: string,
        aadhaarNumber: string,
        contactPhone: string,
        email: string,
        address: string,
        medicalHistory: string,
        allergies: string,
        medications: string,
        consents: string,
        emergencyContact: string,
        registeredDate: string,
        password: string
    ): Observable<Patient> {
        return this.http.post<Patient>(
            `${this.apiUrl}${API_ENDPOINTS.PATIENT.CREATE}`,
            {
                name,
                gender,
                dateOfBirth,
                aadhaarNumber,
                contactPhone,
                email,
                address,
                medicalHistory,
                allergies,
                medications,
                consents,
                emergencyContact,
                registeredDate,
                password
            }
        ).pipe(catchError((error) => this.errorHandlingService.handleError(error)));
    }

    updatePatient(
        patientId: string,
        name: string,
        gender: string,
        dateOfBirth: string,
        aadhaarNumber: string,
        contactPhone: string,
        email: string,
        address: string,
        medicalHistory: string,
        allergies: string,
        medications: string,
        consents: string,
        emergencyContact: string
    ): Observable<Patient> {
        return this.http
            .put<Patient>(
                `${this.apiUrl}${API_ENDPOINTS.PATIENT.UPDATE}/${patientId}`,
                {
                    patientId,
                    name,
                    gender,
                    dateOfBirth,
                    aadhaarNumber,
                    contactPhone,
                    email,
                    address,
                    medicalHistory,
                    allergies,
                    medications,
                    consents,
                    emergencyContact,
                }
            )
            .pipe(catchError((error) => this.errorHandlingService.handleError(error)));
    }
}