import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Receptionist } from 'src/types/receptionist';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlingService } from '../../shared/service/errorHandling.service';
import { API_ENDPOINTS } from '../../patient-endpoints';
import { tap } from 'rxjs/operators';
import { Doctor } from 'src/types/doctor';

@Injectable({
    providedIn: "root",
})
export class BookAppointmentService {
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


}
