import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScheduleService } from '../../schedule.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Availabilities } from 'src/types/availabilities';
import { firstValueFrom } from 'rxjs';
import { SuccessDialogComponent } from '../../../shared/dialogs/success-dialog/success-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-availability-update-dialog',
  templateUrl: './availability-update-dialog.component.html',
  styleUrls: ['./availability-update-dialog.component.scss'],
})
export class AvailabilityUpdateDialogComponent {
  availabilityId: string = '';
  form: FormGroup = new FormGroup({});
  formReady = false;
  availability: Availabilities | null = null;

  constructor(
    private dialogRef: MatDialogRef<AvailabilityUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { availabilityId: string },
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.availabilityId = data.availabilityId;
  }

  async ngOnInit() {
    await this.fetchAvailabilityById();
    this.form = this.initializeForm();
    this.onAvailabilityChange(); // set up logic to watch availability

    this.formReady = true;


  }

  onAvailabilityChange(): void {
    this.form.get('availability')?.valueChanges.subscribe((available) => {
      const reasonControl = this.form.get('unavailabilityReason');

      if (!available) {
        reasonControl?.setValidators([
          Validators.required,
          Validators.pattern(/^(?!None$).+/) // prevent 'None' option
        ]);
      } else {
        reasonControl?.clearValidators();
        reasonControl?.setValue('None');
      }

      reasonControl?.updateValueAndValidity();
    });
  }


  initializeForm(): FormGroup {
    return new FormGroup({
      availabilityId: new FormControl(this.availability?.availabilityId || ''),
      availability: new FormControl(this.availability?.availability ?? null, Validators.required),
      unavailabilityReason: new FormControl(
        this.availability?.unavailabilityReason ?? 'None',
        [Validators.required]
      ),
      slotName: new FormControl(this.availability?.slotName || ''),
      startTime: new FormControl(this.availability?.startTime || ''),
      endTime: new FormControl(this.availability?.endTime || ''),
    });



  }




  //  typeValidator(control: AbstractControl): { [key: string]: any } | null {
  //     return control.value === 'None' ? { noneSelected: true } : null;
  //   }

  async fetchAvailabilityById() {
    const response = await firstValueFrom(
      this.scheduleService.getAvailability(this.availabilityId)
    );
    console.log('Availability data is:', response);
    this.availability = response;
  }


  unavailabilityReasonOptions = [
    { value: 'None', label: 'None' },
    { value: 'On Leave', label: 'On Leave' },
    { value: 'Sick Leave', label: 'Sick Leave' },
    { value: 'Vacation', label: 'Vacation' },
    { value: 'Personal Emergency', label: 'Personal Emergency' },
    { value: 'Surgery (Self)', label: 'Surgery (Self)' },
    { value: 'Conference/Workshop', label: 'Conference/Workshop' },
    { value: 'Hospital Duty', label: 'Hospital Duty' },
    { value: 'Administrative Work', label: 'Administrative Work' },
    { value: 'Out of Office', label: 'Out of Office' },
    { value: 'Not Scheduled', label: 'Not Scheduled' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Shift Change', label: 'Shift Change' },
    { value: 'Technical Issue', label: 'Technical Issue' },
    { value: 'Unavailable (No Reason Provided)', label: 'Unavailable (No Reason Provided)' },
  ];


  onSubmit() {
    try {

      this.scheduleService.updateAvailability(
        this.form.value.availabilityId,
        this.form.value.availability,
        this.form.value.unavailabilityReason,

      ).subscribe(() => {
        this.openSuccessDialog(false);
      });

    } catch (error) {

    }

  }

  openSuccessDialog(isCreateMode: boolean): void {
    this.dialog
      .open(SuccessDialogComponent, {
        width: '250px',
        data: { isCreateMode, title: 'Availability' },
      })
      .afterClosed()
      .subscribe((result) => {
        this.router.navigate(['doctor/schedule']);
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
