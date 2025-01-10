import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, complete los campos correctamente.';
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/posts']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Por favor, intente de nuevo.';
          this.loginForm.patchValue({ password: '' });
          this.loginForm.get('password')?.markAsUntouched();
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Por favor, intente más tarde.';
        }
      },
    });
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']);
  }

}
