import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ErrorHandlingService } from "../shared/service/errorHandling.service";
import { API_ENDPOINTS } from "../doctor-endpoints";
import { Appointment } from "src/types/appointment";

interface GetAppointmentsResponse {
    appointments: Appointment[];
}

interface GetAppointmentResponse {
    appointment: Appointment;
}

@Injectable({
    providedIn: "root",
})
export class AppointmentService {
    private readonly apiUrl = environment.appointmentUrl;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService
    ) { }



    getAppointments(page: number, size: number = 2, sortBy: string = 'createdAt'): Observable<any> {
        const params = {
            page: page.toString(),
            size: size.toString(),
            sortBy
        };

        return this.http
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.APPOINTMENT.FETCH}`, { params })
            .pipe(
                tap((response) => console.log('Raw API response:', response)),
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    getAppointmentSearch(
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
            .get<any>(`${this.apiUrl}${API_ENDPOINTS.APPOINTMENT.SEARCH}`, { params })
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    getAppointment(appointmentId: string): Observable<Appointment> {
        return this.http
            .get<Appointment>(`${this.apiUrl}/appointments/${appointmentId}`)
            .pipe(
                tap((response) => console.log('Raw API response:', response)),
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    createAppointment(
        doctorId: string,
        patientId: string,
        slotId: string,
        appointmentDate: string

    ): Observable<Appointment> {
        return this.http
            .post<Appointment>(`${this.apiUrl}${API_ENDPOINTS.APPOINTMENT.CREATE}`, {
                doctorId,
                patientId,
                slotId,
                appointmentDate
            })
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    updateAppointment(
        appointmentId: string,
        appointmentStatus: string,

    ): Observable<Appointment> {
        return this.http
            .put<Appointment>(`${this.apiUrl}/appointments/${appointmentId}`, {
                appointmentId,
                appointmentStatus
            })
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }

    deleteAppointment(appointmentId: string): Observable<void> {
        return this.http
            .delete<void>(`${this.apiUrl}/appointments/${appointmentId}`)
            .pipe(
                catchError((error) => this.errorHandlingService.handleError(error))
            );
    }
}