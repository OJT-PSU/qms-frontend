import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueInputComponent } from './queue-input.component';

describe('QueueInputComponent', () => {
  let component: QueueInputComponent;
  let fixture: ComponentFixture<QueueInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
