import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieuthuchiComponent } from './phieuthuchi.component';

describe('PhieuthuchiComponent', () => {
  let component: PhieuthuchiComponent;
  let fixture: ComponentFixture<PhieuthuchiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhieuthuchiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhieuthuchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
