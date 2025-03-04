import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  template: `<span>Please implement tooltip class <br> by extending D3TooltipBaseComponent!</span><br>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class D3TooltipBaseComponent {
  // Signals to manage dynamic tootip component input
  tooltipData = input<unknown>(null);
}
