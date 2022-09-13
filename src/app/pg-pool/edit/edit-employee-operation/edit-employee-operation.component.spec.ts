import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeOperationComponent } from './edit-employee-operation.component';

describe('EditEmployeeOperationComponent', () => {
  let component: EditEmployeeOperationComponent;
  let fixture: ComponentFixture<EditEmployeeOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmployeeOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
