import { ChangeDetectionStrategy, Component } from '@angular/core';
import { D3TooltipBaseComponent } from '../d3-trees/d3-tree-complex/d3-tooltip-base';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-custom-tooltip-for-tree',
  imports: [JsonPipe],
  templateUrl: './custom-tooltip-for-tree.component.html',
  styleUrl: './custom-tooltip-for-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTooltipForTreeComponent extends D3TooltipBaseComponent {}
