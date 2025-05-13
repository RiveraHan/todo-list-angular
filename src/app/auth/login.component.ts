import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    
    this.authService.userWasCreated.subscribe(() => {
      this.snackBar.open(
        'Usuario no encontrado. Se está creando...',
        'Cerrar',
        { duration: 3000, panelClass: ['snackbar-info'] }
      );
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const email = this.form.value.email;

    this.authService.loginOrRegister(email).subscribe(user => {
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userId', user.id);
      this.router.navigate(['/tasks']);
    });
    
  }
  
}
