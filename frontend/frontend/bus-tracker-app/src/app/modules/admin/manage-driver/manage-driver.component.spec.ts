import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDriverComponent } from './manage-driver.component';

describe('ManageDriverComponent', () => {
  let component: ManageDriverComponent;
  let fixture: ComponentFixture<ManageDriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageDriverComponent]
    });
    fixture = TestBed.createComponent(ManageDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
