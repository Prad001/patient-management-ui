import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSearchComponent } from './appointment-search.component';

describe('AppointmentSearchComponent', () => {
  let component: AppointmentSearchComponent;
  let fixture: ComponentFixture<AppointmentSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentSearchComponent]
    });
    fixture = TestBed.createComponent(AppointmentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
