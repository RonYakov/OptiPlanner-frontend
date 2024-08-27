import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedEventsComponent } from './failed-events.component';

describe('FailedEventsComponent', () => {
  let component: FailedEventsComponent;
  let fixture: ComponentFixture<FailedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FailedEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
