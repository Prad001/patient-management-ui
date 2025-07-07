import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Receptionist } from 'src/types/receptionist';
import { ReceptionistService } from '../receptionist.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuccessDialogComponent } from '../../../shared/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-receptionist-create-or-update',
  templateUrl: './receptionist-create-or-update.component.html',
  styleUrls: ['./receptionist-create-or-update.component.scss']
})
export class ReceptionistCreateOrUpdateComponent {
        @Input({ required: true }) isCreateMode: boolean = true;


  existingReceptionistId = '';
  showPassword: boolean = false;
  form: FormGroup = new FormGroup({});
  receptionist: Receptionist = null!;

  constructor(private receptionService: ReceptionistService, private dialog:MatDialog, private router: Router) {
 
    
  }



async ngOnInit() {

  if (this.isCreateMode) {
    this.initializeForm(); // initialize blank form for create
  } else {
    await this.fetchReceptionistById(); // fetch user and then initialize form
    this.initializeForm();      // now that this.user is set
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
      contactEmail: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
       contactPhone: new FormControl(null, Validators.required),
       assignedFacility: new FormControl(null, Validators.required),
       roleTitle: new FormControl(null, Validators.required),
       accessLevel: new FormControl("None", [
        Validators.required,
        this.typeValidator,
      ]),
    });
  } else {
    this.form = new FormGroup({
      receptionistId: new FormControl(this.existingReceptionistId, Validators.required),
      name: new FormControl(this.receptionist.name, Validators.required),
      gender: new FormControl(this.receptionist.gender, [
        Validators.required,
        this.typeValidator,
      ]),
      dateOfBirth: new FormControl(this.receptionist.dateOfBirth, Validators.required),
      contactEmail: new FormControl(this.receptionist.contactEmail, [
        Validators.required,
        Validators.email,
      ]),
       contactPhone: new FormControl(this.receptionist.contactPhone, Validators.required),
       assignedFacility: new FormControl(this.receptionist.assignedFacility, Validators.required),
       roleTitle: new FormControl(this.receptionist.roleTitle, Validators.required),
       accessLevel: new FormControl(this.receptionist.accessLevel, [
        Validators.required,
        this.typeValidator,
      ]),
    });
  }
}

fetchReceptionistById(): void {
  this.receptionService.getReceptionist(this.existingReceptionistId).subscribe({
    next: (receptionist) => {
      this.receptionist = receptionist;
    },
    error: (error) => {
      console.error("Failed to fetch user by ID", error);
    }
  });
}


genderOptions = [
  { value: 'None', label: 'None' },
  { value: 'M', label: 'MALE' },
  { value: 'F', label: 'FEMALE' },
  { value: 'O', label: 'OTHER' }
];

accessLevelOptions = [
  { value: 'None', label: 'None' },
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'READ_ONLY', label: 'READ ONLY' },
  { value: 'SCHEDULING', label: 'SCHEDULING' },
  { value: 'BILLING', label: 'BILLING' }
];


//     READ_ONLY,
//     SCHEDULING,
//     BILLING,
//     ADMIN

  typeValidator(control: AbstractControl): { [key: string]: any } | null {
    return control.value === "None" ? { noneSelected: true } : null;
  }


  onSubmit(): void {
    if (this.form.invalid) return;


    if (this.isCreateMode) {
      // Call service to create
      this.receptionService.createReceptionist(
        this.form.value.name,
        this.form.value.gender,
        this.form.value.dateOfBirth,
        this.form.value.contactEmail,
        this.form.value.contactPhone,
        this.form.value.assignedFacility,
        this.form.value.roleTitle,
        this.form.value.accessLevel
      ).subscribe(() => {
      this.openSuccessDialog(true); // Only open after success
    });
    } else {
      // Call service to update
      this.receptionService
        .updateReceptionist(
        this.form.value.receptionistId,
         this.form.value.name,
        this.form.value.gender,
        this.form.value.dateOfBirth,
        this.form.value.contactEmail,
        this.form.value.contactPhone,
        this.form.value.assignedFacility,
        this.form.value.roleTitle,
        this.form.value.accessLevel
        ).subscribe(() => {
      this.openSuccessDialog(false); // Only open after success
    });
    }
  }

   openSuccessDialog(isCreateMode: boolean): void {
      this.dialog
        .open(SuccessDialogComponent, {
          width: "250px",
          data: { isCreateMode , title: "User" },
        })
        .afterClosed()
        .subscribe((result) => {
      this.router.navigate([
        "admin/user-management/receptionist/search"
      ]);
    })
    }


  onCancel(): void {
  
    this.router.navigate([
        "admin/user-management/receptionist/search"
      ]);
  }
}
