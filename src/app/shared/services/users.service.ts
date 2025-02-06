import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private REST_API_USERS = environment.REST_API_USERS;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  private userSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    // Agrega un parámetro único para evitar la caché
    const noCacheUrl = `${this.REST_API_USERS}?t=${Date.now()}`;
    return this.http.get<User[]>(noCacheUrl, { headers: this.httpHeaders });
  }

  getUserById(uid: string): Observable<User> {
    // Asegúrate de que la URL base no termine con barra antes de concatenar
    const url = `${this.REST_API_USERS.replace(/\/+$/, '')}/${uid}`;
    return this.http.get<User>(url, { headers: this.httpHeaders });
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
  updateUser(id: string, user: User): Observable<User> {
    return this.http.patch<User>(`${this.REST_API_USERS}/${id}/`, user, { headers: this.httpHeaders })
  }
}


