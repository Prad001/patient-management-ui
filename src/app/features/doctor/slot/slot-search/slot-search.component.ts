import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatService } from '../../shared/service/time-format.service';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { Slot } from 'src/types/slot';
import { Header } from 'src/types/header';
import { DeleteDialogComponent } from '../../shared/dialogs/delete-dialog/delete-dialog.component';
import { SlotService } from '../slot.service';

@Component({
  selector: 'app-slot-search',
  templateUrl: './slot-search.component.html',
  styleUrls: ['./slot-search.component.scss']
})
export class SlotSearchComponent {

  currentPage = 1;
  itemsPerPage = 7;
  totalPages = 0;
  totalPagesNormal = 0;
  totalPagesSearch = 0;

  searchText = '';
  filterByHeader = '';
  inSearchMode = false;
  searchTextChanged = new Subject<string>();

  slots: Slot[] = [];
  filteredData: Slot[] = [];
  searchedData: Slot[] = [];

  headers: Header[] = [
    { name: "Slot Id", property: "slotId", showInDropdown: true },
    { name: "Slot Name", property: "name", showInDropdown: true },
    { name: "Start Time", property: "startTime", showInDropdown: true },
    { name: "End Time", property: "endTime", showInDropdown: true },
  ];

  constructor(
    private router: Router,
    private slotService: SlotService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private timeFormatService: TimeFormatService
  ) { }

  buttonConfig = {
    update: true,
    delete: true,
    capture: false,
  };

  async ngOnInit(): Promise<void> {
    await this.fetchSlots();

    this.searchTextChanged.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text) => {
        this.searchText = text;
        this.searchSlots();
      });

    this.cdr.detectChanges();
  }

  get paginatedData(): Slot[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.inSearchMode
      ? this.searchedData.slice(start, end)
      : this.filteredData.slice(start, end);
  }

  onSearchTextChange(searchValue: string): void {
    this.searchTextChanged.next(searchValue);
  }

  createSlot(): void {
    this.router.navigate(["doctor/slot/create"]);
  }

  handleAction(event: { action: string; rowIndex: number; rowData: Slot }): void {
    if (event.action === "update") {
      this.updateSlot(event.rowIndex);
    } else if (event.action === "delete") {
      this.deleteSlot(event.rowIndex);
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.inSearchMode ? this.fetchSlotsSearch() : this.fetchSlots();
  }

  async fetchSlots(): Promise<void> {
    try {
      const response = await firstValueFrom(this.slotService.getSlots(this.currentPage - 1));
      this.formatAndSetSlots(response, false);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  }

  async fetchSlotsSearch(): Promise<void> {
    try {
      const page = isNaN(this.currentPage) || this.currentPage < 1 ? 0 : this.currentPage - 1;

      if (!this.filterByHeader) {
        console.warn("No filter header selected");
        return;
      }

      const response = await firstValueFrom(
        this.slotService.getSlotSearch(page, this.filterByHeader, this.searchText, this.itemsPerPage)
      );

      this.formatAndSetSlots(response, true);
    } catch (error) {
      console.error("Error searching slots:", error);
    }
  }

  async searchSlots(): Promise<void> {
    try {
      if (this.searchText && this.filterByHeader) {
        this.inSearchMode = true;
        await this.fetchSlotsSearch();
        this.totalPages = this.totalPagesSearch;

        const selectedHeader = this.headers.find(
          (h) => h.property === this.filterByHeader && h.showInDropdown
        );

        if (selectedHeader) {
          const property = selectedHeader.property as keyof Slot;

          this.searchedData = this.searchedData.filter((slot) => {
            const value = slot[property];
            return value?.toString().toLowerCase().includes(this.searchText.toLowerCase());
          });

          this.searchedData.sort((a, b) => {
            const aVal = a[property]?.toString() ?? '';
            const bVal = b[property]?.toString() ?? '';
            return aVal.localeCompare(bVal);
          });
        }

      } else {
        this.inSearchMode = false;
        await this.fetchSlots();
      }
    } catch (error) {
      console.error("Error searching slots:", error);
    }
  }

  updateSlot(index: number): void {
    const slotId = this.inSearchMode
      ? this.searchedData[index].slotId
      : this.filteredData[index].slotId;

    if (slotId) {
      this.router.navigate(['/doctor/slot/update', slotId]);
    } else {
      console.error('slotId is missing');
    }

  }

  async deleteSlot(index: number): Promise<void> {
    try {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Are you sure?",
          message: "Do you really want to delete this Slot?",
          isConfirm: false,
        },
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

      const slotId = this.inSearchMode
        ? this.searchedData[index].slotId
        : this.filteredData[index].slotId;

      await firstValueFrom(this.slotService.deleteSlot(slotId));

      this.inSearchMode ? this.fetchSlotsSearch() : this.fetchSlots();

      this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Success",
          message: "The Slot has been deleted successfully.",
          isConfirm: true,
        },
      });
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  }

  private formatAndSetSlots(
    response: { content: Slot[]; totalPages: number; number: number },
    inSearchMode: boolean
  ): void {
    if (!response || !Array.isArray(response.content)) return;

    const formatted = response.content.map((slot) => ({
      ...slot,
      timestamp: this.timeFormatService.formatDate(slot.updatedAt ?? '')
    }));

    if (inSearchMode) {
      this.searchedData = formatted;
      this.totalPagesSearch = response.totalPages;
    } else {
      this.filteredData = formatted;
      this.totalPagesNormal = response.totalPages;
    }

    this.totalPages = response.totalPages;
    this.currentPage = response.number + 1;
  }
}
