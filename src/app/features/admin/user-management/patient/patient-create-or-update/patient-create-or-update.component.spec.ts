import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCreateOrUpdateComponent } from './patient-create-or-update.component';

describe('PatientCreateOrUpdateComponent', () => {
  let component: PatientCreateOrUpdateComponent;
  let fixture: ComponentFixture<PatientCreateOrUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientCreateOrUpdateComponent]
    });
    fixture = TestBed.createComponent(PatientCreateOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
