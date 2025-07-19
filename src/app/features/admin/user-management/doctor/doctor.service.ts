import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ErrorHandlingService } from "../../shared/service/errorHandling.service";
import { API_ENDPOINTS } from "../../admin-endpoints";
import { Doctor } from "src/types/doctor";

interface GetDoctorsResponse {
    doctors: Doctor[];
}

interface GetDoctorResponse {
    doctor: Doctor;
}

@Injectable({
    providedIn: "root",
})
export class DoctorService {
    private readonly apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService
    ) { }



    getDoctors(page: number, size: number = 7, sortBy: string = 'createdAt'): Observable<any> {
        const params = {
            page: page.toString(),
            size: size.toString(),
            sortBy
        };

        return this.http
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.DOCTOR.FETCH}`, { params })
            .pipe(
                tap((response) => console.log('Raw API response:', response)),
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    getDoctorSearch(
        page: number,
        category: string,
        value: string,
        size: number = 7,
        sortBy: string = 'createdAt'
    ): Observable<any> {
        const params = {
            category,
            value,
            page: page.toString(),
            size: size.toString(),
            sortBy
        };

        return this.http
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.DOCTOR.SEARCH}`, { params })
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    getDoctor(doctorId: string): Observable<Doctor> {
        return this.http
            .get<Doctor>(`${this.apiUrl}/doctors/${doctorId}`)
            .pipe(
                tap((response) => console.log('Raw API response:', response)),
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    createDoctor(
        name: string,
        gender: string,
        dateOfBirth: string,
        qualification: string,
        specialization: string,
        licenseNumber: string,
        affiliatedHospital: string,
        contactEmail: string,
        contactPhone: string,
        practiceLocation: string,
        roleCode: string
    ): Observable<Doctor> {
        return this.http
            .post<Doctor>(`${this.apiUrl}${API_ENDPOINTS.DOCTOR.CREATE}`, {
                name,
                gender,
                dateOfBirth,
                qualification,
                specialization,
                licenseNumber,
                affiliatedHospital,
                contactEmail,
                contactPhone,
                practiceLocation,
                roleCode
            })
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    updateDoctor(
        doctorId: string,
        name: string,
        gender: string,
        dateOfBirth: string,
        qualification: string,
        specialization: string,
        licenseNumber: string,
        affiliatedHospital: string,
        contactEmail: string,
        contactPhone: string,
        practiceLocation: string,
        roleCode: string
    ): Observable<Doctor> {
        return this.http
            .put<Doctor>(`${this.apiUrl}/doctors/${doctorId}`, {
                doctorId,
                name,
                gender,
                dateOfBirth,
                qualification,
                specialization,
                licenseNumber,
                affiliatedHospital,
                contactEmail,
                contactPhone,
                practiceLocation,
                roleCode
            })
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    deleteDoctor(doctorId: string): Observable<void> {
        return this.http
            .delete<void>(`${this.apiUrl}/doctors/${doctorId}`)
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }
}
