import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMapComponent } from './live-map.component';

describe('LiveMapComponent', () => {
  let component: LiveMapComponent;
  let fixture: ComponentFixture<LiveMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveMapComponent]
    });
    fixture = TestBed.createComponent(LiveMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
