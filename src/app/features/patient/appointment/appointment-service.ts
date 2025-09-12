import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ErrorHandlingService } from "../shared/service/errorHandling.service";
import { API_ENDPOINTS } from "../patient-endpoints";
import { Appointment } from "src/types/appointment";

@Injectable({
    providedIn: "root",
})
export class AppointmentService {
    private readonly apiUrl = environment.appointmentUrl;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService
    ) { }

    getUpcomingAppointments(page: number, size: number = 2): Observable<any> {
        const patientId = '473200ec-69fb-49ae-9c96-2d84c0b53adb'; // hardcoded for now

        const params = {
            page: page.toString(),
            size: size.toString()
        };

        return this.http
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.APPOINTMENT.UPCOMING_FETCH}/${patientId}`, { params })
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
        const patientId = '473200ec-69fb-49ae-9c96-2d84c0b53adb'; // hardcoded for now
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

    resheduleUpcomingAppointment(
        appointmentId: string
    ): Observable<Appointment> {
        return this.http
            .put<Appointment>(`${this.apiUrl}/appointments/${appointmentId}`, {
                appointmentId
            })
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    cancelUpcomingAppointment(appointmentId: string): Observable<void> {
        return this.http
            .delete<void>(`${this.apiUrl}/appointments/${appointmentId}`)
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    getPastAppointments(page: number, size: number = 2): Observable<any> {
        const patientId = '473200ec-69fb-49ae-9c96-2d84c0b53adb'; // hardcoded for now

        const params = {
            page: page.toString(),
            size: size.toString()
        };

        return this.http
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.APPOINTMENT.PAST_FETCH}/${patientId}`, { params })
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