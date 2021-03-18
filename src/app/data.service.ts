import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  // Http Options
  httpHeader = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Methods': 'GET POST',
      //'Access-Control-Allow-Headers': 'X-Requested-With',
      //'Content-Type': 'application/json'
    })
  }


  getUser(email: any): Observable<User[]> {
    return this.httpClient.get<User[]>(this.REST_API_SERVER + '/users/' + email).pipe(retry(3), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendGetRequest() {
    return this.httpClient.get(this.REST_API_SERVER).pipe(retry(4), catchError(this.handleError));
  }
}
