import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotSearchComponent } from './slot-search.component';

describe('SlotSearchComponent', () => {
  let component: SlotSearchComponent;
  let fixture: ComponentFixture<SlotSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotSearchComponent]
    });
    fixture = TestBed.createComponent(SlotSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
