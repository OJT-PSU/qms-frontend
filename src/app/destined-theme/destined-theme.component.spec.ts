import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinedThemeComponent } from './destined-theme.component';

describe('DestinedThemeComponent', () => {
  let component: DestinedThemeComponent;
  let fixture: ComponentFixture<DestinedThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinedThemeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DestinedThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
