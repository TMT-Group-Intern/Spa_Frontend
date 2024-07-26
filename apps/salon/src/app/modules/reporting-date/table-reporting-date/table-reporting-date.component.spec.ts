import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReportingDateComponent } from './table-reporting-date.component';

describe('TableReportingDateComponent', () => {
  let component: TableReportingDateComponent;
  let fixture: ComponentFixture<TableReportingDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableReportingDateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableReportingDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
