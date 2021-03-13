import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindparkingspaceComponent } from './findparkingspace.component';

describe('FindparkingspaceComponent', () => {
  let component: FindparkingspaceComponent;
  let fixture: ComponentFixture<FindparkingspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindparkingspaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindparkingspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
