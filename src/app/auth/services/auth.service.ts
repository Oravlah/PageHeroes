import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.REST_API_AUTH; // URL del backend
  private refreshUrl = `${this.apiUrl}/token/refresh/`; // URL para refrescar el token

  constructor(private http: HttpClient) {}

  // Método para agregar el token al encabezado Authorization
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // Iniciar sesión y guardar tokens
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { email, password }).pipe(
      tap((response: any) => {
        if (response.access && response.refresh) {
          this.saveToken(response.access, response.refresh);
        }
      }),
      catchError(error => {
        console.error("Error en login:", error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Guardar los tokens en sessionStorage
  saveToken(accessToken: string, refreshToken: string) {
    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);
  }

  // Obtener el token de sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem("access_token");
  }

  // Obtener el refresh token
  getRefreshToken(): string | null {
    return sessionStorage.getItem("refresh_token");
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Cerrar sesión y eliminar los tokens
  logout() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  }

  // Refrescar el token cuando expire
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error("No hay refresh token disponible"));
    }

    return this.http.post(this.refreshUrl, { refresh: refreshToken }).pipe(
      tap((response: any) => {
        if (response.access) {
          sessionStorage.setItem("access_token", response.access);
        }
      }),
      catchError(error => {
        console.error("Error al refrescar token:", error);
        this.logout();
        return throwError(() => new Error(error));
      })
    );
  }

  // Ejemplo de una solicitud protegida con token
  getUserData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/me/`, { headers }).pipe(
      catchError(error => {
        console.error("Error al obtener datos del usuario:", error);
        return throwError(() => new Error(error));
      })
    );
  }
}
