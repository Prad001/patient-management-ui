import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastAppointmentsComponent } from './past-appointments.component';

describe('PastAppointmentsComponent', () => {
  let component: PastAppointmentsComponent;
  let fixture: ComponentFixture<PastAppointmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PastAppointmentsComponent]
    });
    fixture = TestBed.createComponent(PastAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
