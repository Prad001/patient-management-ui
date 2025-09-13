import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCreateOrUpdateComponent } from './doctor-create-or-update.component';

describe('DoctorCreateOrUpdateComponent', () => {
  let component: DoctorCreateOrUpdateComponent;
  let fixture: ComponentFixture<DoctorCreateOrUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorCreateOrUpdateComponent]
    });
    fixture = TestBed.createComponent(DoctorCreateOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
