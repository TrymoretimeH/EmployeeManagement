import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarysComponent } from './salarys.component';

describe('SalarysComponent', () => {
  let component: SalarysComponent;
  let fixture: ComponentFixture<SalarysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalarysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
