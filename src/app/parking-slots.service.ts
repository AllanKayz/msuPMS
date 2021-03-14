import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParkingSlotsService {

  private REST_API_URL = 'http://localhost:4500/tanhamira/api/getShpData.php?action=getStands';
  constructor(private httpClient: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Methods': 'GET POST',
      //'Access-Control-Allow-Headers': 'X-Requested-With',
      //'Content-Type': 'application/json'
    })
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public getParkingSlots() {
    return this.httpClient.get(this.REST_API_URL).pipe(retry(4), catchError(this.handleError));
  }
}
