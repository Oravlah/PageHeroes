import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';// Asegúrate de importar el servicio de autenticación
import Swal from 'sweetalert2';
import { Router } from '@angular/router';  // Para redirigir al usuario tras el login
import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],  // No necesitas los imports de HttpClientModule, NgIf, etc. aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,  // Usamos el AuthService
    private router: Router  // Para redirigir al usuario
  ) {}

    ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // Cambié `username` a `email` para mayor claridad
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.mostrarErroresFormulario();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.access, response.refresh);  // Guarda ambos tokens
        Swal.fire('Éxito', 'Ingreso exitoso.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const mensaje = err.status === 401
          ? 'Usuario o contraseña incorrectos.'
          : 'Error al iniciar sesión. Intenta más tarde.';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }

  private mostrarErroresFormulario(): void {
    let errores: string[] = [];
    Object.entries(this.loginForm.controls).forEach(([campo, control]) => {
      if (control.invalid) {
        const erroresCampo: string[] = [];
        if (control.hasError('required')) {
          erroresCampo.push('es obligatorio');
        }
        if (control.hasError('minlength')) {
          erroresCampo.push(`debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`);
        }
        if (control.hasError('email')) {
          erroresCampo.push('debe ser un correo válido');
        }
        errores.push(`<b>${campo}</b>: ${erroresCampo.join(', ')}`);
      }
    });

    Swal.fire('Advertencia', `Corrige los siguientes errores:<br>${errores.join('<br>')}`, 'warning');
  }
}
