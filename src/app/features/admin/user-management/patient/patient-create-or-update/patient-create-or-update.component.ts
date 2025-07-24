import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { PatientService } from '../patient.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessDialogComponent } from '../../../shared/dialogs/success-dialog/success-dialog.component';
import { Patient } from 'src/types/patient';

@Component({
  selector: 'app-patient-create-or-update',
  templateUrl: './patient-create-or-update.component.html',
  styleUrls: ['./patient-create-or-update.component.scss']
})
export class PatientCreateOrUpdateComponent {

  isCreateMode = true;
  formReady = false;
  existingPatientId = '';
  form: FormGroup = new FormGroup({});
  patient: Patient = null!;

  genderOptions = [
    { value: 'None', label: 'None' },
    { value: 'M', label: 'MALE' },
    { value: 'F', label: 'FEMALE' },
    { value: 'O', label: 'OTHER' }
  ];

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.isCreateMode = this.route.snapshot.data['create'];

    if (this.isCreateMode) {
      this.initializeForm();
      this.formReady = true;
    } else {
      this.existingPatientId = this.route.snapshot.paramMap.get('patientId') || '';
      if (this.existingPatientId) {
        await this.fetchPatientById();
        this.initializeForm(); // only after patient is fetched
        this.formReady = true;
      } else {
        console.error('Missing patient ID in route');
      }
    }
  }

  initializeForm() {
    if (this.isCreateMode) {
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
        registeredDate: new FormControl(new Date().toISOString().split('T')[0], Validators.required), // default to today
      });
    } else {
      this.form = new FormGroup({
        patientId: new FormControl(this.existingPatientId, Validators.required),
        name: new FormControl(this.patient.name, Validators.required),
        gender: new FormControl(this.patient.gender, [Validators.required, this.typeValidator]),
        dateOfBirth: new FormControl(this.patient.dateOfBirth, Validators.required),
        aadhaarNumber: new FormControl(this.patient.aadhaarNumber),
        contactPhone: new FormControl(this.patient.contactPhone, Validators.required),
        email: new FormControl(this.patient.email, [Validators.required, Validators.email]),
        address: new FormControl(this.patient.address),
        medicalHistory: new FormControl(this.patient.medicalHistory),
        allergies: new FormControl(this.patient.allergies),
        medications: new FormControl(this.patient.medications),
        consents: new FormControl(this.patient.consents),
        emergencyContact: new FormControl(this.patient.emergencyContact)
      });
    }
  }


  fetchPatientById(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.patientService.getPatient(this.existingPatientId).subscribe({
        next: (data) => {
          this.patient = data;
          resolve();
        },
        error: (err) => {
          console.error('Failed to fetch patient by ID', err);
          reject();
        }
      });
    });
  }

  typeValidator(control: AbstractControl): { [key: string]: any } | null {
    return control.value === 'None' ? { noneSelected: true } : null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.isCreateMode) {
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
        formValue.registeredDate
      ).subscribe(() => {
        this.openSuccessDialog(true);
      });
    } else {
      this.patientService.updatePatient(
        formValue.patientId,
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
        formValue.emergencyContact
      ).subscribe(() => {
        this.openSuccessDialog(false);
      });
    }
  }


  openSuccessDialog(isCreateMode: boolean): void {
    this.dialog.open(SuccessDialogComponent, {
      width: '250px',
      data: { isCreateMode, title: 'Patient' }
    }).afterClosed().subscribe(() => {
      this.router.navigate(['admin/user-management/patient/search']);
    });
  }

  onCancel(): void {
    this.router.navigate(['admin/user-management/patient/search']);
  }
}
