import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import LoginComponent from './auth/pages/login/login.component'; // Asegúrate de que la ruta sea correcta
import { TokenInterceptorService } from './auth/services/token-interceptor.service'; // Ruta del interceptor

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, HttpClientModule], // Importamos HttpClientModule y otros componentes
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true, // Permite agregar múltiples interceptores si es necesario
    },
  ],
})
export class AppComponent {
  title = 'pageHeroes';
}
