import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Receptionist } from "src/types/receptionist";
import { environment } from "@env";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ErrorHandlingService } from "../../shared/service/errorHandling.service";
import { API_ENDPOINTS } from "../../admin-endpoints";

interface GetReceptionistsResponse {
  receptionists: Receptionist[];
}

interface GetReceptionistResponse {
  receptionist: Receptionist;
}

@Injectable({
  providedIn: "root",
})
export class ReceptionistService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}



  getReceptionists(
    currentPage: number,
  ): Observable<Receptionist[]> {


    return this.http
      .post<GetReceptionistsResponse>(
        `${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.FETCH}`,
        {
          currentPage,
        }
      )
      .pipe(
        map((response) => response.receptionists),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getReceptionistSearch(
    currentPage: number,
    searchText: String,
    filterByHeader: String
  ): Observable<Receptionist[]> {
    return this.http
      .post<GetReceptionistsResponse>(`${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.SEARCH}`, {
        currentPage,
        searchText,
        filterByHeader,
      })
      .pipe(
        map((response) => response.receptionists),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }


  getReceptionist(receptionistId: string): Observable<Receptionist> {
    return this.http
      .post<GetReceptionistResponse>(`${this.apiUrl}${API_ENDPOINTS.RECEPTIONIST.GET}`, {
        receptionistId
      })
      .pipe(
        map((response) => response.receptionist),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }


}
