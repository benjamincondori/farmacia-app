import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertsService } from '../../../shared/services/alerts.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  
  constructor(
    private alertServive: AlertsService,
    private validatorsService: ValidatorsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          this.validatorsService.emailValid,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
        ],
      ],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email , password } = this.loginForm.value;
    
    // this.authService.login(this.email, this.password).subscribe({
    //   next: (response) => {
    //     this.loading = false;
    //     this.router.navigate(['/dashboard']);
    //     this.alertServive.alertSuccess('Usuario autenticado con éxito', 'Éxito');
    //   },
    //   error: (error) => {
    //     this.loading = false;
    //     console.error('Error en el login:', error);
    //     this.errorMessage = 'Credenciales inválidas. Intente nuevamente.';
    //     this.alertServive.alertError('Credenciales inválidas. Intente nuevamente.', 'Error');
    //   },
    // });
  }

  isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.loginForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.loginForm, field);
  }
}
