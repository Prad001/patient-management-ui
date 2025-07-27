import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotSelectDialogComponent } from './slot-select-dialog.component';

describe('SlotSelectDialogComponent', () => {
  let component: SlotSelectDialogComponent;
  let fixture: ComponentFixture<SlotSelectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotSelectDialogComponent]
    });
    fixture = TestBed.createComponent(SlotSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
