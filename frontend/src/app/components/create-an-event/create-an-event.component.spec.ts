import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnEventComponent } from './create-an-event.component';

describe('CreateAnEventComponent', () => {
  let component: CreateAnEventComponent;
  let fixture: ComponentFixture<CreateAnEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAnEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAnEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
