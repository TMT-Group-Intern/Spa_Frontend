import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterComponent } from "./register.component";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

function beforeEach(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}
function expect(component: RegisterComponent) {
  throw new Error('Function not implemented.');
}

