import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InSessionModalComponent } from './in-session-modal.component';

describe('InSessionModalComponent', () => {
  let component: InSessionModalComponent;
  let fixture: ComponentFixture<InSessionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InSessionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InSessionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
