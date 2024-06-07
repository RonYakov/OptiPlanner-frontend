import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventComponent } from './create-event.component';

describe('CreateAnEventComponent', () => {
  let component: CreateEventComponent;
  let fixture: ComponentFixture<CreateEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
