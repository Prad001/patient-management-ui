import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SlotService } from '../slot.service';
import { Slot } from 'src/types/slot';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../shared/dialogs/success-dialog/success-dialog.component';
import { Doctor } from 'src/types/doctor';

@Component({
  selector: 'app-slot-create-or-update',
  templateUrl: './slot-create-or-update.component.html',
  styleUrls: ['./slot-create-or-update.component.scss']
})
export class SlotCreateOrUpdateComponent {
  form!: FormGroup;
  isCreateMode = true;
  slotId: string | null = null;
  formReady = false;
  doctors: Doctor[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private slotService: SlotService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchDoctors();
    this.isCreateMode = this.route.snapshot.data['create'];
    this.slotId = this.route.snapshot.paramMap.get('slotId');

    if (!this.isCreateMode && this.slotId) {
      this.slotService.getSlot(this.slotId).subscribe((slot: Slot) => {
        this.buildForm(slot);
        this.formReady = true;
      });
    } else {
      this.buildForm();
      this.formReady = true;
    }
  }

  buildForm(slot?: Slot): void {
    this.form = this.fb.group({
      slotId: [{ value: slot?.slotId || null, disabled: true }],
      name: [slot?.name || '', Validators.required],
      startTime: [{ value: slot?.startTime || '', disabled: !this.isCreateMode }, Validators.required],
      endTime: [{ value: slot?.endTime || '', disabled: !this.isCreateMode }, Validators.required],
      capacity: [{ value: slot?.capacity || 1, disabled: !this.isCreateMode }, [Validators.required, Validators.min(1)]],
      sessionDuration: [{ value: slot?.sessionDuration || 15, disabled: !this.isCreateMode }, [Validators.required]],
      doctorId: [{ value: slot?.doctorId || '', disabled: !this.isCreateMode }, Validators.required]
    });
  }


  onSubmit(): void {
    if (this.form.invalid) return;

    // Get all fields, including disabled ones
    const formValues = this.form.getRawValue();
    const { slotId, name, startTime, endTime, sessionDuration, capacity, doctorId } = formValues;

    if (this.isCreateMode) {
      this.slotService
        .createSlot(name, startTime, endTime, sessionDuration, doctorId)
        .subscribe({
          next: () => this.openSuccessDialog(true),
          error: (err) => console.error('Create error:', err)
        });
    } else {
      if (!slotId || slotId === 'undefined') {
        console.error('Invalid slotId during update');
        return;
      }

      this.slotService
        .updateSlot(slotId, name, startTime, endTime, sessionDuration, capacity, doctorId)
        .subscribe({
          next: () => this.openSuccessDialog(false),
          error: (err) => console.error('Update error:', err)
        });
    }
  }


  openSuccessDialog(isCreateMode: boolean): void {
    this.dialog.open(SuccessDialogComponent, {
      width: '250px',
      data: { isCreateMode, title: 'Slot' }
    }).afterClosed().subscribe(result => {
      console.log('Dialog closed. Navigating to search...', result);
      this.router.navigateByUrl('/doctor/slot');
    });
  }

  onCancel(): void {
    this.router.navigateByUrl('/doctor/slot');
  }

  fetchDoctors(): void {
    this.slotService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors;
    });
  }
}
