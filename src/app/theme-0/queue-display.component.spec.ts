import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Theme0Component } from './queue-display.component';

describe('QueueDisplayComponent', () => {
  let component: Theme0Component;
  let fixture: ComponentFixture<Theme0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Theme0Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Theme0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
