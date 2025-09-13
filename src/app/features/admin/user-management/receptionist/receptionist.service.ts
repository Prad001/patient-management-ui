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
  private readonly apiUrl = environment.adminUrl;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  getReceptionists(page: number, size: number): Observable<any> {
    let sortBy: string = 'createdAt'
    const params = { 
      page: page.toString(),
      size: size.toString(),
      sortBy};

    return this.http
      .get<any>(
        `${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.FETCH}`,
        { params }
      )
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getReceptionistSearch(
    page: number,
    value: string,
    category: string,
    size: number 
  ): Observable<Receptionist[]> {
     let sortBy: string = 'createdAt'
     const params = {
            category,
            value,
            page: page.toString(),
            size: size.toString(),
            sortBy
        };
    //const params = { currentPage, searchText, filterByHeader };
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
    return this.http
      .get<Receptionist>(`${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.GET}`+ `/${receptionistId}`)
      .pipe(
        tap((response) => console.log('Raw API response for get:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  deleteReceptionist(receptionistId: string): Observable<Receptionist> {
  
    return this.http
      .delete<Receptionist>(`${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.DELETE }`+ `/${receptionistId}`)
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  createReceptionist(
    name: string,
    gender: string,
    dateOfBirth: string,
    employeeCode:string,
    department: string,
    contactEmail: string,
    contactPhone: string,
    assignedFacility: string,
    roleTitle: string,
    accessLevel: string,
    password: string
  ): Observable<Receptionist> {
    const status="ACTIVE";
    const lastLogin= "";
    return this.http
      .post<Receptionist>(
        `${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.CREATE}`,
        {
          name,
          gender,
          dateOfBirth,
          employeeCode,
          department,
          contactEmail,
          contactPhone,
          assignedFacility,
          roleTitle,
          accessLevel,
          lastLogin,
          status,
          password
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
    employeeCode:string,
    department: string,
    contactEmail: string,
    contactPhone: string,
    assignedFacility: string,
    roleTitle: string,
    accessLevel: string
  ): Observable<Receptionist> {
    const status="ACTIVE";
    const lastLogin= "";
    return this.http
      .put<Receptionist>(`${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.UPDATE}`+ `/${receptionistId}`, {
        name,
        gender,
        dateOfBirth,
        employeeCode,
        department,
        contactEmail,
        contactPhone,
        assignedFacility,
        roleTitle,
        accessLevel,
        lastLogin,
        status,
      })
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
}
