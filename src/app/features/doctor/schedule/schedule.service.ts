import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Schedule } from 'src/types/schedule';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlingService } from '../shared/service/errorHandling.service';
import { API_ENDPOINTS } from '../doctor-endpoints';
import { tap } from 'rxjs/operators';
import { Availabilities } from 'src/types/availabilities';


@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private readonly apiUrl = environment.apiUrl;
  private readonly scheduleApiUrl = environment.scheduleApiUrl;

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

  getAllSlots() : Observable<any> {
    return this.http
      .get<any>(`${this.scheduleApiUrl}${API_ENDPOINTS.SLOT.GETALL}`)
      .pipe(
        tap((response) => console.log('Raw API response for slots:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  createScheduleWithSlots(scheduleData: any): Observable<any>{
      return this.http
      .post<Schedule>(
        `${this.scheduleApiUrl}${API_ENDPOINTS.AVAILABILITY.CREATE}`,
        scheduleData 
      )
      .pipe(
        tap((response) => console.log('Schedule created:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

    getAvailabilities(tempDoctorId: string): Observable<any>{
      return this.http
      .get<Schedule>(
        `${this.scheduleApiUrl}${API_ENDPOINTS.AVAILABILITY.FETCH}`+`/doctor/${tempDoctorId}`,
         
      )
      .pipe(
        tap((response) => console.log('Schedule created:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getAvailability(availabilityId: string): Observable<any>{
      return this.http
      .get<Availabilities>(
        `${this.scheduleApiUrl}${API_ENDPOINTS.AVAILABILITY.GET}`+`/${availabilityId}`,
      )
      .pipe(
        tap((response) => console.log('Schedule created:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  updateAvailability(availabilityId:string, availability:boolean,unavailabilityReason: string): Observable<any>{
       return this.http
      .patch<Availabilities>(
        `${this.scheduleApiUrl}${API_ENDPOINTS.AVAILABILITY.UPDATE}`+`/${availabilityId}`,
        { availability, unavailabilityReason}
      )
      .pipe(
        tap((response) => console.log('Schedule created:', response)),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
}



