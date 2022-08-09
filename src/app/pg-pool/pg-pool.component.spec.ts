import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgPoolComponent } from './pg-pool.component';

describe('PgPoolComponent', () => {
  let component: PgPoolComponent;
  let fixture: ComponentFixture<PgPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PgPoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PgPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
