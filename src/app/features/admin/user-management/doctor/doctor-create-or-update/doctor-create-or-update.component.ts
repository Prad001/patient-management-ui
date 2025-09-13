import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessDialogComponent } from '../../../shared/dialogs/success-dialog/success-dialog.component';
import { Doctor } from 'src/types/doctor';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-create-or-update',
  templateUrl: './doctor-create-or-update.component.html',
  styleUrls: ['./doctor-create-or-update.component.scss']
})
export class DoctorCreateOrUpdateComponent {
  @Input({ required: true }) isCreateMode: boolean = true;


  existingDoctorId = '';
  showPassword: boolean = false;
  form: FormGroup = new FormGroup({});
  doctor: Doctor = null!;
  formReady = false;

  constructor(private doctorService: DoctorService, private dialog: MatDialog,
    private router: Router, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    this.isCreateMode = Boolean(this.route.snapshot.data['create']);
    this.existingDoctorId = this.route.snapshot.params['doctorId'];
    if (this.isCreateMode) {
      this.initializeForm();
      this.formReady = true;
    }
    else {
      await this.fetchDoctorById();
      this.initializeForm();
      this.formReady = true;
    }
  }

  initializeForm() {
    if (this.isCreateMode) {
      this.form = new FormGroup({

        name: new FormControl(null, Validators.required),
        gender: new FormControl("None", [
          Validators.required,
          this.typeValidator,
        ]),
        dateOfBirth: new FormControl(null, Validators.required),
        qualification: new FormControl(null, Validators.required),
        specialization: new FormControl(null, Validators.required),
        licenseNumber: new FormControl(null, Validators.required),
        affiliatedHospital: new FormControl(null, Validators.required),
        contactEmail: new FormControl(null, [
          Validators.required,
          Validators.email,
        ]),
        contactPhone: new FormControl(null, Validators.required),
        practiceLocation: new FormControl(null, Validators.required),
        roleCode: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
      });
    } else {
      this.form = new FormGroup({
        doctorId: new FormControl(this.existingDoctorId, Validators.required),
        name: new FormControl(this.doctor.name, Validators.required),
        gender: new FormControl(this.doctor.gender, [
          Validators.required,
          this.typeValidator,
        ]),
        dateOfBirth: new FormControl(this.doctor.dateOfBirth, Validators.required),
        qualification: new FormControl(this.doctor.qualification, Validators.required),
        specialization: new FormControl(this.doctor.specialization, Validators.required),
        licenseNumber: new FormControl(this.doctor.licenseNumber, Validators.required),
        affiliatedHospital: new FormControl(this.doctor.affiliatedHospital, Validators.required),
        contactEmail: new FormControl(this.doctor.contactEmail, [
          Validators.required,
          Validators.email,
        ]),
        contactPhone: new FormControl(this.doctor.contactPhone, Validators.required),
        practiceLocation: new FormControl(this.doctor.practiceLocation, Validators.required),
        roleCode: new FormControl(this.doctor.roleCode, Validators.required),
        // password: new FormControl(this.doctor.password, Validators.required)
      });
    }
  }

  async fetchDoctorById(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.doctorService.getDoctor(this.existingDoctorId).subscribe({
        next: (doctor) => {
          this.doctor = doctor;
          resolve();
        },
        error: (error) => {
          console.error("Failed to fetch doctor by ID", error);
          reject(error);
        }
      });
    });
  }

  genderOptions = [
    { value: 'None', label: 'None' },
    { value: 'M', label: 'MALE' },
    { value: 'F', label: 'FEMALE' },
    { value: 'O', label: 'OTHER' }
  ];

  typeValidator(control: AbstractControl): { [key: string]: any } | null {
    return control.value === "None" ? { noneSelected: true } : null;
  }


  onSubmit(): void {
    if (this.form.invalid) return;


    if (this.isCreateMode) {
      // Call service to create
      this.doctorService.createDoctor(
        this.form.value.name,
        this.form.value.gender,
        this.form.value.dateOfBirth,
        this.form.value.qualification,
        this.form.value.specialization,
        this.form.value.licenseNumber,
        this.form.value.affiliatedHospital,
        this.form.value.contactEmail,
        this.form.value.contactPhone,
        this.form.value.practiceLocation,
        this.form.value.roleCode,
        this.form.value.password
      ).subscribe(() => {
        this.openSuccessDialog(true); // Only open after success
      });
    } else {
      // Call service to update
      this.doctorService
        .updateDoctor(
          this.form.value.doctorId,
          this.form.value.name,
          this.form.value.gender,
          this.form.value.dateOfBirth,
          this.form.value.qualification,
          this.form.value.specialization,
          this.form.value.licenseNumber,
          this.form.value.affiliatedHospital,
          this.form.value.contactEmail,
          this.form.value.contactPhone,
          this.form.value.practiceLocation,
          this.form.value.roleCode
        ).subscribe(() => {
          this.openSuccessDialog(false); // Only open after success
        });
    }
  }

  openSuccessDialog(isCreateMode: boolean): void {
    this.dialog
      .open(SuccessDialogComponent, {
        width: "250px",
        data: { isCreateMode, title: "User" },
      })
      .afterClosed()
      .subscribe((result) => {
        this.router.navigate([
          "admin/user-management/doctor/search"
        ]);
      })
  }

  onCancel(): void {

    this.router.navigate([
      "admin/user-management/doctor/search"
    ]);
  }
}
