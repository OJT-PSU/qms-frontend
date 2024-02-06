import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueTerminalComponent } from './queue-terminal.component';

describe('QueueTerminalComponent', () => {
  let component: QueueTerminalComponent;
  let fixture: ComponentFixture<QueueTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueTerminalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueueTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
