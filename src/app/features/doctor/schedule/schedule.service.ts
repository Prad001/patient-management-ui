import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Schedule } from 'src/types/schedule';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlingService } from '../shared/service/errorHandling.service';
import { API_ENDPOINTS } from '../doctor-endpoints';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  getSchedules(page: number, size: number): Observable<any> {
    let sortBy: string = 'createdAt'
    const params = { 
      page: page.toString(),
      size: size.toString(),
      sortBy};

    return this.http
      .get<any>(
        `${this.apiUrl}${API_ENDPOINTS.SCHEDULE.FETCH}`,
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
  ): Observable<Schedule[]> {
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
      .get<Schedule[]>(
        `${this.apiUrl}${API_ENDPOINTS.SCHEDULE.SEARCH}`,
        { params }
      )
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getSchedule(scheduleId: string): Observable<Schedule> {
    return this.http
      .get<Schedule>(`${this.apiUrl}${API_ENDPOINTS.SCHEDULE.GET}`+ `/${scheduleId}`)
      .pipe(
        tap((response) => console.log('Raw API response for get:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  deleteSchedule(scheduleId: string): Observable<Schedule> {
  
    return this.http
      .delete<Schedule>(`${this.apiUrl}${API_ENDPOINTS.SCHEDULE.DELETE }`+ `/${scheduleId}`)
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  createSchedule(
  scheduleType: string,
  doctorId: string,
  startDate: Date,
  endDate: Date,
  ): Observable<Schedule> {
    const status="ACTIVE";
    const lastLogin= "";
    return this.http
      .post<Schedule>(
        `${this.apiUrl}${API_ENDPOINTS.SCHEDULE.CREATE}`,
        {
           scheduleType,
           doctorId,
           startDate,
           endDate,
        }
      )
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  updateSchedule(
    scheduleId: string,
    scheduleType: string,
    doctorId: string,
    startDate: Date,
    endDate: Date,
  ): Observable<Schedule> {
    return this.http
      .put<Schedule>(`${this.apiUrl}${API_ENDPOINTS.SCHEDULE.UPDATE}`+ `/${scheduleId}`, {
            scheduleType,
           doctorId,
           startDate,
           endDate,
      })
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
}
