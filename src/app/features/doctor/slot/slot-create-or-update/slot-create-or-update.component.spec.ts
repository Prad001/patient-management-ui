import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotCreateOrUpdateComponent } from './slot-create-or-update.component';

describe('SlotCreateOrUpdateComponent', () => {
  let component: SlotCreateOrUpdateComponent;
  let fixture: ComponentFixture<SlotCreateOrUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotCreateOrUpdateComponent]
    });
    fixture = TestBed.createComponent(SlotCreateOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
