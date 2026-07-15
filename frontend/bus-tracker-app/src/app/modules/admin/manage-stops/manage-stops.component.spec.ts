import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStopsComponent } from './manage-stops.component';

describe('ManageStopsComponent', () => {
  let component: ManageStopsComponent;
  let fixture: ComponentFixture<ManageStopsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageStopsComponent]
    });
    fixture = TestBed.createComponent(ManageStopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
