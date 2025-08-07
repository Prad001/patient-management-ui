import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-success-dialog",
  templateUrl: "./success-dialog.component.html",
  styleUrls: ["./success-dialog.component.scss"],
})
export class SuccessDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isCreate: boolean;
      title: string;
      message: string;
    },
    private dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.data.isCreate) {
      this.data.message =
        "The " + this.data.title + " has been created successfully.";
    } else {
      this.data.message =
        "The " + this.data.title + " has been updated successfully.";
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
