import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class TimeFormatService {


   constructor(
      
    ) {}

    formatDate(isoString: string): string {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-GB', { 
          day: '2-digit', month: '2-digit', year: 'numeric', 
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).replace(',', '');
      }
    
  
}