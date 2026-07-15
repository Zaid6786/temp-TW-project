import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedBusComponent } from './recommended-bus.component';

describe('RecommendedBusComponent', () => {
  let component: RecommendedBusComponent;
  let fixture: ComponentFixture<RecommendedBusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendedBusComponent]
    });
    fixture = TestBed.createComponent(RecommendedBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
