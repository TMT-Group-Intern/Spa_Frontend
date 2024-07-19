import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueStatisticsDetailComponent } from './revenue-statistics-detail.component';

describe('RevenueStatisticsDetailComponent', () => {
  let component: RevenueStatisticsDetailComponent;
  let fixture: ComponentFixture<RevenueStatisticsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevenueStatisticsDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RevenueStatisticsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
