import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Theme2Component } from './theme-2.component';

describe('Theme2Component', () => {
  let component: Theme2Component;
  let fixture: ComponentFixture<Theme2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Theme2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Theme2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
