import { Component } from '@angular/core';
import { ITooltipParams } from 'ag-grid-community';

@Component({
  selector: 'app-row-tooltip',
  template: `
    <div class="custom-tooltip">
      <p *ngFor="let entry of tooltipData">
        <strong>{{ entry.key }}:</strong> {{ entry.value }}
      </p>
    </div>
  `,
  styles: [`
    .custom-tooltip {
      background: rgba(0, 0, 0, 0.75);
      color: white;
      padding: 8px;
      border-radius: 5px;
      font-size: 14px;
      max-width: 300px;
      white-space: pre-wrap;
    }
  `]
})
export class RowTooltipComponent {
  tooltipData: { key: string, value: string }[] = [];

  agInit(params: ITooltipParams): void {
    if (!params.value) return;
    
   this.tooltipData = params.value.split('\n').map((line: string) => {
  const [key, value] = line.split(': ');
  return { key, value };
});

  }
}

