import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Schedule } from 'src/types/schedule';
import { ScheduleService } from '../schedule.service';
import { SuccessDialogComponent } from '../../shared/dialogs/success-dialog/success-dialog.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-schedule-create-or-update',
  templateUrl: './schedule-create-or-update.component.html',
  styleUrls: ['./schedule-create-or-update.component.scss'],
})
export class ScheduleCreateOrUpdateComponent {
  constructor(
    private dialogRef: MatDialogRef<ScheduleCreateOrUpdateComponent>,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; isCreateMode: boolean }
  ) {}

  isCreateMode: boolean = this.data.isCreateMode;
  isNext = false;
  existingScheduleId = '';
  showPassword: boolean = false;
  form: FormGroup = new FormGroup({});
  schedule: Schedule = null!;
  formReadySchedule = false;
  today = new Date().toISOString().split('T')[0];

   selectedTab: "schedule" | "slot" = "schedule";


  async ngOnInit() {
    // this.isCreateMode = Boolean(this.route.snapshot.data["create"]);
    // this.existingScheduleId = this.route.snapshot.params['scheduleId'];
     if (!this.isCreateMode) {
      this.isNext = true;
    }

    if (this.isCreateMode) {
      this.initializeForm(); // initialize blank form for create
      this.formReadySchedule = true;
    } else {
      await this.fetchScheduleById(); // fetch user and then initialize form
      this.initializeForm(); // now that this.user is set
      this.formReadySchedule = true;
    }
  }

  // initializeForm() {
  //   if (this.isCreateMode) {
  //     this.form = new FormGroup({
  //       startDate: new FormControl(null, Validators.required),
  //       endDate: new FormControl(null, Validators.required),
  //       scheduleType: new FormControl("None", [
  //         Validators.required,
  //         this.typeValidator,
  //       ]),
  //     });
  //   } else {
  //     this.form = new FormGroup({
  //       scheduleId: new FormControl(this.existingScheduleId, Validators.required),
  //       startDate: new FormControl(this.schedule.startDate, Validators.required),
  //       endDate: new FormControl(this.schedule.endDate, Validators.required),
  //       scheduleType: new FormControl(this.schedule.scheduleType, [
  //         Validators.required,
  //         this.typeValidator,
  //       ]),
  //     });
  //   }
  // }
  initializeForm() {
    // const today = new Date().toISOString().split('T')[0];

    const formGroup = new FormGroup(
      {
        startDate: new FormControl(null, [
          Validators.required,
          this.startDateValidator,
        ]),
        endDate: new FormControl(null, [Validators.required]),
        scheduleType: new FormControl('None', [
          Validators.required,
          this.typeValidator,
        ]),
      },
      { validators: this.endDateAfterStartDateValidator }
    );



    this.form = this.isCreateMode
      ? formGroup
      : new FormGroup({
          scheduleId: new FormControl(
            this.existingScheduleId,
            Validators.required
          ),
          ...formGroup.controls,
        });

    this.setupDateLogic();
  }

startDateValidator(control: AbstractControl): { [key: string]: any } | null {
  if (!control.value) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset to midnight
  const selectedDate = new Date(control.value);

  return selectedDate.getTime() < today.getTime()
    ? { startDatePast: true }
    : null;
}


endDateAfterStartDateValidator(group: AbstractControl): { [key: string]: any } | null {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  if (start && end && new Date(end) < new Date(start)) {
    return { endBeforeStart: true };
  }
  return null;
}

setupDateLogic() {
  this.form.get('scheduleType')?.valueChanges.subscribe((type) => {
    const endDateControl = this.form.get('endDate');
    const startDateControl = this.form.get('startDate');
    if (type === 'week' && startDateControl?.value) {
      this.setEndDateToWeekLater(startDateControl.value);
      endDateControl?.disable(); // prevent manual editing
    } else {
      endDateControl?.enable(); // allow manual editing
    }
  });

  this.form.get('startDate')?.valueChanges.subscribe((startDate) => {
    if (this.form.get('scheduleType')?.value === 'week') {
      this.setEndDateToWeekLater(startDate);
    }
  });
}

setEndDateToWeekLater(startDate: string) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const formattedEndDate = formatDate(end, 'yyyy-MM-dd', 'en-IN');
  this.form.get('endDate')?.setValue(formattedEndDate);
}

  fetchScheduleById(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.scheduleService.getSchedule(this.existingScheduleId).subscribe({
        next: (schedule) => {
          this.schedule = schedule;
          resolve();
        },
        error: (error) => {
          console.error('Failed to fetch user by ID', error);
          reject(error);
        },
      });
    });
  }

  scheduleTypeOptions = [
    { value: 'None', label: 'None' },
    { value: 'week', label: 'WEEK' },
    { value: 'custom', label: 'CUSTOM' },
  ];

  sessionDurationTypeOptions = [
    { value: 'None', label: 'None' },
    { value: 15, label:'15 MIN' },
    { value: 20, label:'20 MIN' },
    { value: 30, label:'30 MIN' },
    { value: 45, label:'45 MIN' },
    { value: 60, label:'60 MIN' },
  ];

  typeValidator(control: AbstractControl): { [key: string]: any } | null {
    return control.value === 'None' ? { noneSelected: true } : null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    if (this.isCreateMode) {
      // Call service to create
      this.scheduleService
        .createSchedule(
          this.form.value.scheduleType,
          this.form.value.doctorId,
          this.form.value.startDate,
          this.form.value.endDate
        )
        .subscribe(() => {
          this.openSuccessDialog(true); // Only open after success
        });
        this.isNext = true;
        this.selectedTab = "slot";
    } else {
      // Call service to update
      this.scheduleService
        .updateSchedule(
          this.existingScheduleId,
          this.form.value.scheduleType,
          this.form.value.doctorId,
          this.form.value.startDate,
          this.form.value.endDate
        )
        .subscribe(() => {
          this.openSuccessDialog(false); // Only open after success
        });
    }
  }

  openSuccessDialog(isCreateMode: boolean): void {
    this.dialog
      .open(SuccessDialogComponent, {
        width: '250px',
        data: { isCreateMode, title: 'User' },
      })
      .afterClosed()
      .subscribe((result) => {
        this.router.navigate(['doctor/schedule/search']);
      });
  }

  onCancel(): void {

    this.dialogRef.close();
  }
}
