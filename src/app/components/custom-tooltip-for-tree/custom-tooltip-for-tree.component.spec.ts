import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTooltipForTreeComponent } from './custom-tooltip-for-tree.component';

describe('CustomTooltipForTreeComponent', () => {
  let component: CustomTooltipForTreeComponent;
  let fixture: ComponentFixture<CustomTooltipForTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTooltipForTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomTooltipForTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
