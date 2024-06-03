import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksPopupComponent } from './tasks.popup.component';

describe('TasksPopupComponent', () => {
  let component: TasksPopupComponent;
  let fixture: ComponentFixture<TasksPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TasksPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
