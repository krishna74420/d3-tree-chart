import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { D3TreeComplexComponent } from './app/components/d3-trees/d3-tree-complex/d3-tree-complex.component';
import { CustomTooltipForTreeComponent } from './app/components/custom-tooltip-for-tree/custom-tooltip-for-tree.component';

@Component({
  selector: 'app-root',
  imports: [D3TreeComplexComponent],
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>
    <d3-tree-complex></d3-tree-complex>
 
    <d3-tree-complex [tooltipComponent]="tooltipComponent"></d3-tree-complex>
  `,
})
export class App {
  name = 'Angular';
  tooltipComponent: typeof CustomTooltipForTreeComponent =
    CustomTooltipForTreeComponent;
}

bootstrapApplication(App);
