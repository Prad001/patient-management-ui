import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class ErrorHandlingService {
    handleError(error: any): Observable<never> {
      let errorMessage = 'An error occurred, please try again later.';
      if (error.status === 404) {
        errorMessage = 'Resource not found.';
      }
      // Add more specific error handling logic as needed
      return throwError(errorMessage);
    }
  }
  