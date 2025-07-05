// import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
// import { ColDef, GridReadyEvent } from 'ag-grid-community';
// import { ButtonCellRendererComponent } from '../table-components/button-cell-renderer/button-cell-renderer.component';
// import { Header } from '@aptsi-types';

// @Component({
//   selector: 'app-demo-table',
//   templateUrl: './demo-table.component.html',
//   styleUrls: ['./demo-table.component.scss']
// })
// export class DemoTableComponent {
//   @Input() headers: Header[] = []; 
//   @Input() data: any[] = [];
//   @Input() columnDefs: ColDef[] = [];
//   @Input() buttonConfig: { [key: string]: boolean } = {}; // Parent sets button visibility

//   @Output() actionClicked = new EventEmitter<{ action: string,rowIndex: number, rowData: any }>();
  
//   defaultColDef: ColDef = {
//     flex: 1,
//     minWidth: 200,
//     filter: true,
//     floatingFilter: true,
//     tooltipShowDelay: 0 
//   };
  
//   getTooltip(params: any) {
//     return params.node ? `Row Data: ${JSON.stringify(params.node.data, null, 2)}` : '';
//   }
  

//   // Use "components" instead of "frameworkComponents" in AG Grid v29+
//   components = {
//     buttonCellRenderer: ButtonCellRendererComponent
//   };

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes.headers && changes.headers.currentValue) {
//       // Map headers to column definitions
//       this.columnDefs = this.headers.map(header => ({
//         headerName: header.name,
//         field: header.property,
//         tooltipValueGetter: params => this.getTooltip(params) // Set tooltip for each column
//       }));
  
//       // Check if at least one button should be visible
//       const hasButtons = Object.values(this.buttonConfig).some(value => value);
  
//       // Add action buttons column only if at least one button is enabled
//       if (hasButtons) {
//         this.columnDefs.unshift({
//           headerName: 'Actions',
//           field: 'actions',
//           cellRenderer: 'buttonCellRenderer',
//           cellRendererParams: {
//             buttonConfig: this.buttonConfig,
//             context: { onActionClicked: this.onActionClicked.bind(this) } // Pass function reference
//           },
//           sortable: false,
//           filter: false,
//           width: 200
//         });
//       }
//     }
  
//     console.log("Updated Column Definitions:", this.columnDefs);
//     console.log("Updated Row Data:", this.data);
//   }
  

//   onGridReady(params: GridReadyEvent) {
//     params.api.sizeColumnsToFit();
//   }


//   onActionClicked(action: string, rowIndex: number, rowData: any) {
//     // Emit event to parent component
//     this.actionClicked.emit({ action, rowIndex, rowData });
//   }
// }
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ColDef, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { ButtonCellRendererComponent } from '../table-components/button-cell-renderer/button-cell-renderer.component';
import { Header } from 'src/types/header';

@Component({
  selector: 'app-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.scss']
})
export class MainTableComponent {
  @Input() headers: Header[] = []; 
  @Input() data: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() buttonConfig: { [key: string]: boolean } = {}; // Parent sets button visibility

  @Output() actionClicked = new EventEmitter<{ action: string, rowIndex: number, rowData: any }>();

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    filter: true,
    // floatingFilter: true,
    tooltipValueGetter: (params) => this.getTooltip(params)
  };

  // ✅ Define grid options
  gridOptions: GridOptions = {
    enableBrowserTooltips: true,
    tooltipShowDelay: 0,
    tooltipMouseTrack: true,
    enableCellTextSelection: true, 
    suppressDragLeaveHidesColumns: true, // ✅ Prevent column hiding on drag
    components: {
      buttonCellRenderer: ButtonCellRendererComponent
    },
    onColumnMoved: (params) => {
      setTimeout(() => {
        params.api.sizeColumnsToFit(); // ✅ Resize after moving a column
      }, 0);
    }
  };
  

  getTooltip(params: any): string {
    if (!params.node || !params.node.data) return '';
  
    const columnDefs = params.api.getColumnDefs(); // Get all column definitions
    const visibleColumns = columnDefs
      .filter((col: any) => !col.hide) // Filter only visible columns
      .map((col: any) => `${col.headerName}: ${params.node.data[col.field]}`) // Format key-value pairs
      .join('\n'); // Newline-separated tooltip
  
    return visibleColumns;
  }

  ngOnChanges(changes: SimpleChanges) {
   if (changes['headers'] && changes['headers'].currentValue) {

      setTimeout(() => {
        // ✅ Generate columns based on headers
        this.columnDefs = this.headers.map(header => ({
          headerName: header.name,
          field: header.property
        }));

        // ✅ Ensure Actions column is included
        if (Object.values(this.buttonConfig).some(value => value)) {
          this.columnDefs.unshift({
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: 'buttonCellRenderer', // ✅ Use registered button renderer
            cellRendererParams: {
              buttonConfig: this.buttonConfig,
              context: { onActionClicked: this.onActionClicked.bind(this) }
            },
            sortable: false,
            filter: false,
            width: 200
          });
        }

        console.log("Updated Column Definitions:", this.columnDefs);
      }, 0);
    }
  }

  onGridReady(params: GridReadyEvent) {
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 0);
  }

  onActionClicked(action: string, rowIndex: number, rowData: any) {
    this.actionClicked.emit({ action, rowIndex, rowData });
  }
}
