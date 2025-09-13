import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: 'app-error-dialog',
  template: `
   <div class="text-center pt-4">
    <i class="bi bi-x-circle text-warning text-center fs-1"></i>
   </div>


<div class=" mx-5 pt-2">
     
    <h1 class="text-center " >Error</h1>
  </div>
  <div class="mx-5 text-center" >
    <p>An error occurred while performing the operation.</p>
  </div>
  <div class="pt-2 pb-4 d-flex justify-content-center" >
        <button type="button" class="btn btn-dark" (click)="closeDialog()">OK</button>
  </div>

    `,
})
export class ErrorDialogComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  closeDialog() {

    this.dialog.closeAll();

  }
}