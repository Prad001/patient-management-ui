import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reschedule-dialog',
  templateUrl: './reschedule-dialog.component.html',
  styleUrls: ['./reschedule-dialog.component.scss']
})
export class RescheduleDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<RescheduleDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string; isConfirm: boolean }
  ) { }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onConfirm(): void {
    this.dialogRef.close(true); // user confirmed reschedule
  }

  onCancel(): void {
    this.dialogRef.close(false); // user canceled
  }
}
