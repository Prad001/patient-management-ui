
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { Slot } from 'src/types/slot';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-slot-select-dialog',
  templateUrl: './slot-select-dialog.component.html',
  styleUrls: ['./slot-select-dialog.component.scss']
})
export class SlotSelectDialogComponent {
  columnDefs: ColDef[] = [
    { field: 'slotId', headerName: 'Slot ID', checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'name', headerName: 'Slot Name' },
    { field: 'sessionDuration', headerName: 'Session Duration' },
    { field: 'startTime', headerName: 'Start Time' },
    { field: 'endTime', headerName: 'End Time' },
  ];

  slots = {
    content: [
      // {
      //   slotId: '2aerfdt323jchfh1fjediojg1',
      //   slotName: 'Morning',
      //   sessionDuration: 15,
      //   startTime: '10:00:00',
      //   endTime: '13:00:00',
      // },
      // {
      //   slotId: '5yehfdt323jchfh1fjediof3e',
      //   slotName: 'Morning',
      //   sessionDuration: 30,
      //   startTime: '10:00:00',
      //   endTime: '13:00:00',
      // },
      // {
      //   slotId: '3gerfdtfrchfh1fjediojf1',
      //   slotName: 'Afternoon',
      //   sessionDuration: 15,
      //   startTime: '14:00:00',
      //   endTime: '18:00:00',
      // },
      // {
      //   slotId: '3erfdtftchfh1keediojf2',
      //   slotName: 'Afternoon',
      //   sessionDuration: 30,
      //   startTime: '14:00:00',
      //   endTime: '18:00:00',
      // },
    ]
  };

  rowData = this.slots.content;
  selectedSlotIds: string[] = [];
  gridApi: any;

  constructor(
    private dialogRef: MatDialogRef<SlotSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedSlotIds: string[] },
    private scheduleService: ScheduleService
  ) {
    this.selectedSlotIds = data.selectedSlotIds;
  }

  ngOnInit(): void {

    this.scheduleService.getAllSlots().subscribe({
      next: (response: any) => {
        this.rowData = response.content;
        this.gridApi.setRowData(this.rowData);
      },
      error: (error: any) => {
        console.error('Error fetching slots:', error);
      }
    });
}

  onGridReady(params: any): void {
    this.gridApi = params.api;

    // Auto-select rows based on passed selectedSlotIds
    this.gridApi.forEachNode((node: any) => {
      if (this.selectedSlotIds.includes(node.data.slotId)) {
        node.setSelected(true);
      }
    });
  }

  onConfirmSelection(): void {
    const selectedRows = this.gridApi.getSelectedRows();
    this.dialogRef.close(selectedRows);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

