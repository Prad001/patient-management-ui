import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistSearchComponent } from './receptionist-search.component';

describe('ReceptionistSearchComponent', () => {
  let component: ReceptionistSearchComponent;
  let fixture: ComponentFixture<ReceptionistSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionistSearchComponent]
    });
    fixture = TestBed.createComponent(ReceptionistSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
