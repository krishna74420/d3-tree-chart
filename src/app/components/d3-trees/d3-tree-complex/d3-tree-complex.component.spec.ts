import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TreeComplexComponent } from './d3-tree-complex.component';

describe('D3TreeComplexComponent', () => {
  let component: D3TreeComplexComponent;
  let fixture: ComponentFixture<D3TreeComplexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3TreeComplexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(D3TreeComplexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
