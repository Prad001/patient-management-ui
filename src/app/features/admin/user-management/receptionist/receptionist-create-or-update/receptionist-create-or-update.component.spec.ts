import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistCreateOrUpdateComponent } from './receptionist-create-or-update.component';

describe('ReceptionistCreateOrUpdateComponent', () => {
  let component: ReceptionistCreateOrUpdateComponent;
  let fixture: ComponentFixture<ReceptionistCreateOrUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionistCreateOrUpdateComponent]
    });
    fixture = TestBed.createComponent(ReceptionistCreateOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
