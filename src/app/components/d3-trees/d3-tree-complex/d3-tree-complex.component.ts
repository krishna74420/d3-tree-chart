import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import * as d3 from 'd3';
import { D3TooltipBaseComponent } from './d3-tooltip-base';

export interface NwTopologyNode {
  nodeId?: string | number;
  name: string;
  labelWidth?: number;
  value?: number;
  children?: NwTopologyNode[];
}

@Component({
  selector: 'd3-tree-complex',
  templateUrl: './d3-tree-complex.component.html',
  styleUrls: ['./d3-tree-complex.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class D3TreeComplexComponent implements OnInit {
  /*
  This component is WIP and more features are being added upon.
  TODO: Code optimization/cleanup, UT/storybook needs to be considered once the component is stable.
  */

  // Input for dynamic tooltip component
  @Input() tooltipComponent: Type<D3TooltipBaseComponent> | null =
    D3TooltipBaseComponent;

  // Ref to hold the tooltip rendering area
  @ViewChild('tooltipComponentPlaceholder', { read: ViewContainerRef })
  viewContainerRef!: ViewContainerRef;

  // Variable to hold ref to the dynamically rendered tooltip element in the DOM.
  private tooltipRef?: ComponentRef<D3TooltipBaseComponent>;

  ngOnInit() {
    this.loadChart();
    this.renderTooltipComponent();
  }

  private renderTooltipComponent() {
    if (!this.viewContainerRef) return;

    this.viewContainerRef.clear();
    if (this.tooltipComponent) {
      this.tooltipRef = this.viewContainerRef.createComponent(this.tooltipComponent);
    }
  }

  private loadChart() {
    const data: NwTopologyNode = this.getData();

    const width = 1400;
    const minHeight = 800;
    const margin = { top: 50, right: 50, left: 100 };

    const root = d3.hierarchy(data);
    const dx = 30;
    const dy = (width - margin.right - margin.left) / (1 + root.height) + 50;

    const tree = d3.tree<NwTopologyNode>().nodeSize([dx, dy]);
    const diagonal = d3
      .linkHorizontal<d3.HierarchyPointLink<NwTopologyNode>, d3.HierarchyPointNode<NwTopologyNode>>()
      .x((d) => d.y as number)
      .y((d) => d.x as number);

    const svg = d3
      .select('#complex-tree-view')
      .append('svg')
      .attr('width', width)
      .attr('height', minHeight)
      .attr('viewBox', [-margin.left, -margin.top, width, dx])
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;');

    const gTree = svg.append('g').attr('class', 'gTree');

    gTree
      .append('rect')
      .attr('x', -width * 2)
      .attr('y', -minHeight * 2)
      .attr('width', width * 5)
      .attr('height', minHeight * 5)
      .attr('fill', 'url(#d3dots)');

    const gLink = gTree.append('g').attr('class', 'gLink').attr('fill', 'none').attr('stroke', '#555');

    const gNode = gTree.append('g').attr('class', 'gNode');

    const tooltip = d3
      .select<HTMLDivElement, unknown>('#tooltip')
      .style('display', 'none')
      .style('position', 'absolute')
      .attr('class', 'tooltip');

    const update = (source: d3.HierarchyNode<NwTopologyNode>) => {
      tree(root);

      const nodes = root.descendants().reverse();
      const links = root.links();

      const node = gNode.selectAll<SVGGElement, d3.HierarchyNode<NwTopologyNode>>('g').data(nodes);

      const nodeEnter = node.enter().append('g').attr('transform', `translate(${source.y0},${source.x0})`);

      nodeEnter
        .append('rect')
        .attr('y', -11)
        .attr('width', (d) => d.data.labelWidth || 0)
        .attr('height', 22)
        .attr('rx', 15)
        .attr('fill', '#E7F3FF')
        .attr('stroke', '#00AEEF');

      nodeEnter
        .append('text')
        .attr('dy', 4)
        .attr('x', 18)
        .text((d) => d.data.name);

      const link = gLink
        .selectAll<SVGPathElement, d3.HierarchyLink<NwTopologyNode>>('path')
        .data(links, (d) => d.target.data.nodeId as string);

      link
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('stroke', '#808080')
        .attr('d', (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };

    root.x0 = dy / 2;
    root.y0 = 0;

    update(root);

    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.5, 5]).on('zoom', (event) => {
      gTree.attr('transform', event.transform);
    });

    svg.call(zoom);
  }

  private getData(): NwTopologyNode {
    return {
      name: 'India',
      nodeId: 'node-1',
      children: [
        {
          name: 'Maharashtra',
          nodeId: 'node-2',
          children: [
            { name: 'Mumbai', nodeId: 'node-3' },
            { name: 'Pune', nodeId: 'node-4' },
          ],
        },
        {
          name: 'Karnataka',
          nodeId: 'node-5',
          children: [{ name: 'Bengaluru', nodeId: 'node-6' }],
        },
      ],
    };
  }
}
