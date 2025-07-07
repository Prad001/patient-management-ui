import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Receptionist } from 'src/types/receptionist';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlingService } from '../../shared/service/errorHandling.service';
import { API_ENDPOINTS } from '../../admin-endpoints';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ReceptionistService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  getReceptionists(currentPage: number): Observable<Receptionist[]> {
    const params = { currentPage };

    return this.http
      .get<Receptionist[]>(
        `${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.FETCH}`,
        { params }
      )
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getReceptionistSearch(
    currentPage: number,
    searchText: string,
    filterByHeader: string
  ): Observable<Receptionist[]> {
    const params = { currentPage, searchText, filterByHeader };
    return this.http
      .get<Receptionist[]>(
        `${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.SEARCH}`,
        { params }
      )
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getReceptionist(receptionistId: string): Observable<Receptionist> {
    const params = { receptionistId };
    return this.http
      .get<Receptionist>(`${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.GET}`, {
        params,
      })
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  deleteReceptionist(receptionistId: string): Observable<Receptionist> {
    const params = { receptionistId };
    return this.http
      .delete<Receptionist>(`${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.GET}`, {
        params,
      })
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  createReceptionist(
    name: string,
    gender: string,
    dateOfBirth: string,
    contactEmail: string,
    contactPhone: string,
    assignedFacility: string,
    roleTitle: string,
    accessLevel: string
  ): Observable<Receptionist> {
    return this.http
      .post<Receptionist>(
        `${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.CREATE}`,
        {
          name,
          gender,
          dateOfBirth,
          contactEmail,
          contactPhone,
          assignedFacility,
          roleTitle,
          accessLevel,
        }
      )
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  updateReceptionist(
    receptionistId: string,
    name: string,
    gender: string,
    dateOfBirth: string,
    contactEmail: string,
    contactPhone: string,
    assignedFacility: string,
    roleTitle: string,
    accessLevel: string
  ): Observable<Receptionist> {
    return this.http
      .put<Receptionist>(`${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.UPDATE}`, {
        receptionistId,
        name,
        gender,
        dateOfBirth,
        contactEmail,
        contactPhone,
        assignedFacility,
        roleTitle,
        accessLevel,
      })
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
}
