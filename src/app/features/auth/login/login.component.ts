import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'src/types/JwtPayload';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      rememberMe: new FormControl(false)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { email, password, rememberMe } = this.form.value;

    this.loginService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        const token = response.token;
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);

        console.log('Decoded JWT:', decoded);

        if (rememberMe) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(decoded));
        }

        switch (decoded.role) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'DOCTOR':
            this.router.navigate(['/doctor']);
            break;
          case 'PATIENT':
            this.router.navigate(['/patient']);
            break;
          case 'RECEPTIONIST':
            this.router.navigate(['/receptionist']);
            break;
          default:
            this.router.navigate(['/unauthorized']);
            break;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }
  onReset(): void {
    this.form.reset();
  }
  onSignUp(): void {
    this.router.navigate(['auth/signup']);
  }
}
