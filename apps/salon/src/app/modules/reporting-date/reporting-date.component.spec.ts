import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingDateComponent } from './reporting-date.component';

describe('ReportingDateComponent', () => {
  let component: ReportingDateComponent;
  let fixture: ComponentFixture<ReportingDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportingDateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportingDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
