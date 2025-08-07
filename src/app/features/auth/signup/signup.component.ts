import { Component } from '@angular/core';
import { SuccessDialogComponent } from '../shared/dialogs/success-dialog/success-dialog.component';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../admin/user-management/patient/patient.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  form: FormGroup = new FormGroup({});
  formReady = false;

  genderOptions = [
    { value: 'None', label: 'None' },
    { value: 'M', label: 'MALE' },
    { value: 'F', label: 'FEMALE' },
    { value: 'O', label: 'OTHER' }
  ];

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.formReady = true;
  }

  initializeForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      gender: new FormControl('None', [Validators.required, this.typeValidator]),
      dateOfBirth: new FormControl(null, Validators.required),
      aadhaarNumber: new FormControl(null),
      contactPhone: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      address: new FormControl(null),
      medicalHistory: new FormControl(null),
      allergies: new FormControl(null),
      medications: new FormControl(null),
      consents: new FormControl(null),
      emergencyContact: new FormControl(null),
      registeredDate: new FormControl(new Date().toISOString().split('T')[0], Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  typeValidator(control: AbstractControl): { [key: string]: any } | null {
    return control.value === 'None' ? { noneSelected: true } : null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    this.patientService.createPatient(
      formValue.name,
      formValue.gender,
      formValue.dateOfBirth,
      formValue.aadhaarNumber,
      formValue.contactPhone,
      formValue.email,
      formValue.address,
      formValue.medicalHistory,
      formValue.allergies,
      formValue.medications,
      formValue.consents,
      formValue.emergencyContact,
      formValue.registeredDate,
      formValue.password
    ).subscribe(() => {
      this.openSuccessDialog();
    });
  }

  openSuccessDialog(): void {
    this.dialog.open(SuccessDialogComponent, {
      width: '250px',
      data: { isCreateMode: true, title: 'Patient' }
    }).afterClosed().subscribe(() => {
      this.router.navigate(['auth/login']);
    });
  }

  onLogin(): void {
    this.router.navigate(['auth/login']);
  }
}
