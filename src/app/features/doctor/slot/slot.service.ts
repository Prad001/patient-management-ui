import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { ErrorHandlingService } from '../shared/service/errorHandling.service';
import { catchError, Observable, tap } from 'rxjs';
import { Slot } from 'src/types/slot';
import { API_ENDPOINTS } from '../doctor-endpoints';
import { Doctor } from 'src/types/doctor';

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  private readonly apiUrl = environment.slotUrl;
  private readonly doctorUrl = environment.adminUrl;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  getSlots(currentPage: number): Observable<{
    content: Slot[],
    totalPages: number,
    number: number
  }> {
    const params = { currentPage };
    console.log('Final URL:', `${this.apiUrl}${API_ENDPOINTS.SLOT.FETCH}`);
    return this.http
      .get<{ content: Slot[], totalPages: number, number: number }>(
        `${this.apiUrl}${API_ENDPOINTS.SLOT.FETCH}`,
        { params }
      )
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getSlotSearch(
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
      .get<any>(`${this.apiUrl}${API_ENDPOINTS.SLOT.SEARCH}`, { params })
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getSlot(slotId: string): Observable<Slot> {
    console.log('Slot by ID URL:', `${this.apiUrl}${API_ENDPOINTS.SLOT.GET}/${slotId}`);
    return this.http
      .get<Slot>(`${this.apiUrl}${API_ENDPOINTS.SLOT.GET}/${slotId}`)
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  deleteSlot(slotId: string): Observable<void> {
    console.log('Final URL:', `${this.apiUrl}${API_ENDPOINTS.SLOT.DELETE}/${slotId}`);
    return this.http
      .delete<void>(`${this.apiUrl}${API_ENDPOINTS.SLOT.DELETE}/${slotId}`)
      .pipe(
        tap((response) => console.log('Slot deleted successfully')),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  createSlot(
    name: string,
    startTime: string,
    endTime: string,
    sessionDuration: number,
    doctorId: string
  ): Observable<Slot> {
    return this.http
      .post<Slot>(`${this.apiUrl}${API_ENDPOINTS.SLOT.CREATE}`, {
        name,
        startTime,
        endTime,
        sessionDuration,
        doctorId
      })
      .pipe(
        tap((response) => console.log('Slot created successfully:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  updateSlot(
    slotId: string,
    name: string,
    startTime: string,
    endTime: string,
    capacity: number,
    sessionDuration: number,
    doctorId: string
  ): Observable<Slot> {
    return this.http
      .put<Slot>(`${this.apiUrl}${API_ENDPOINTS.SLOT.UPDATE}/${slotId}`, {
        slotId,
        name,
        startTime,
        endTime,
        capacity,
        sessionDuration,
        doctorId
      })
      .pipe(
        tap((response) => console.log('Slot updated successfully:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getDoctors(): Observable<Doctor[]> {
    console.log('Final URL:', `${this.doctorUrl}${API_ENDPOINTS.DOCTOR.FETCH}`);
    return this.http
      .get<Doctor[]>(`${this.doctorUrl}${API_ENDPOINTS.DOCTOR.FETCH}`)
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
}
