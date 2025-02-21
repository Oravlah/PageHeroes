import { Injectable } from '@angular/core';
import { Heroes} from '../models/Heroes.model';
import { environment } from '../../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private REST_API_HEROES = environment.REST_API_HEROES;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  private heroSubject: BehaviorSubject<Heroes[]> = new BehaviorSubject<Heroes[]>([]);
  public heroes$: Observable<Heroes[]> = this.heroSubject.asObservable();

  constructor(private http: HttpClient) { }


  getHeroes(): Observable<Heroes[]> {
    // Agrega un parámetro único para evitar la caché
    const noCacheUrl = `${this.REST_API_HEROES}?t=${Date.now()}`;
    return this.http.get<Heroes[]>(noCacheUrl, { headers: this.httpHeaders });
  }
}
