import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusDetailsComponent } from './bus-details.component';

describe('BusDetailsComponent', () => {
  let component: BusDetailsComponent;
  let fixture: ComponentFixture<BusDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusDetailsComponent]
    });
    fixture = TestBed.createComponent(BusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
