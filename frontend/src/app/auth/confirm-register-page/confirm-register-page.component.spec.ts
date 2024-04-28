import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRegisterPageComponent } from './confirm-register-page.component';

describe('ConfirmRegisterPageComponent', () => {
  let component: ConfirmRegisterPageComponent;
  let fixture: ComponentFixture<ConfirmRegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmRegisterPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmRegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
