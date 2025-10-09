import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleDialogComponent } from './reschedule-dialog.component';

describe('RescheduleDialogComponent', () => {
  let component: RescheduleDialogComponent;
  let fixture: ComponentFixture<RescheduleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RescheduleDialogComponent]
    });
    fixture = TestBed.createComponent(RescheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
