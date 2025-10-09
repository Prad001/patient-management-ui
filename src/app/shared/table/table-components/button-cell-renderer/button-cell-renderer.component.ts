import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-cell-renderer',
  templateUrl: './button-cell-renderer.component.html',
  styleUrls: ['./button-cell-renderer.component.scss']
})
export class ButtonCellRendererComponent  implements ICellRendererAngularComp{
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  onButtonClick(action: 'update' | 'delete' | 'capture' | 'configure' | 'book-appointment'): void {
    const rowIndex = this.params.node.rowIndex;
    const rowData = this.params.data;

    // Call the parent function passed via context
    this.params.context.onActionClicked(action , rowIndex, rowData);
  }
}
