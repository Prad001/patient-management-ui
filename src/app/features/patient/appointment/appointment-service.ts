import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ErrorHandlingService } from "../shared/service/errorHandling.service";
import { API_ENDPOINTS } from "../patient-endpoints";
import { Appointment } from "src/types/appointment";
import { AuthService } from "src/app/shared/auth-service/auth.service";

@Injectable({
    providedIn: "root",
})
export class AppointmentService {
    private readonly apiUrl = environment.appointmentUrl;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService,
        private authService: AuthService
    ) { }

    getUpcomingAppointments(page: number, size: number = 2): Observable<any> {
        const patientId = this.authService.getUserId(); 

        const params = {
            id: patientId ?? '',
            page: page.toString(),
            size: size.toString()
        };

        return this.http
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.APPOINTMENT.UPCOMING_FETCH}`, { params })
            .pipe(
                tap((response) => console.log('Raw API response:', response)),
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    getUpcomingAppointmentSearch(
        page: number,
        category: string,
        value: string,
        size: number = 7,
        sortBy: string = 'appointmentDate'
    ): Observable<any> {
        const patientId = this.authService.getUserId(); 
        const params = {
            category,
            value,
            page: page.toString(),
            size: size.toString(),
            sortBy
        };

        return this.http
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.APPOINTMENT.UPCOMING_FETCH}/${patientId}`, { params })
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    resheduleUpcomingAppointment(appointmentId: string): Observable<Appointment> {
        return this.http
            .patch<Appointment>(
                `${this.apiUrl}/appointments/${appointmentId}`,
                { status: "RESCHEDULED" } // matches AppointmentStatusUpdateDTO
            )
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }


    cancelUpcomingAppointment(appointmentId: string): Observable<Appointment> {
        return this.http
            .patch<Appointment>(
                `${this.apiUrl}/appointments/${appointmentId}`,
                { status: "CANCELLED" } // matches AppointmentStatusUpdateDTO
            )
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }


    getPastAppointments(page: number, size: number = 2): Observable<any> {
        const patientId = this.authService.getUserId();

        const params = {
            id: patientId ?? '',
            page: page.toString(),
            size: size.toString()
        };

        return this.http
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.APPOINTMENT.PAST_FETCH}`, { params })
            .pipe(
                tap((response) => console.log('Raw API response:', response)),
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    getPastAppointmentSearch(
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
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.APPOINTMENT.UPCOMING_FETCH}`, { params })
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }
}