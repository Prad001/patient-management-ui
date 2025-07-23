import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCreateOrUpdateComponent } from './schedule-create-or-update.component';

describe('ScheduleCreateOrUpdateComponent', () => {
  let component: ScheduleCreateOrUpdateComponent;
  let fixture: ComponentFixture<ScheduleCreateOrUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleCreateOrUpdateComponent]
    });
    fixture = TestBed.createComponent(ScheduleCreateOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
