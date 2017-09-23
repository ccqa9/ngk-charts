import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartLabelComponent } from './pie-chart-label.component';

describe('PieChartLabelComponent', () => {
  let component: PieChartLabelComponent;
  let fixture: ComponentFixture<PieChartLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
