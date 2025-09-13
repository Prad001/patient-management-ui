import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityUpdateDialogComponent } from './availability-update-dialog.component';

describe('AvailabilityUpdateDialogComponent', () => {
  let component: AvailabilityUpdateDialogComponent;
  let fixture: ComponentFixture<AvailabilityUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailabilityUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(AvailabilityUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
