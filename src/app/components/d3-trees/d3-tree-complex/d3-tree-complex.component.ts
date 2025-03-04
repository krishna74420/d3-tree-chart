import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  input,
  OnInit,
  Type,
  viewChild,
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
  imports: [],
  templateUrl: './d3-tree-complex.component.html',
  styleUrl: './d3-tree-complex.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class D3TreeComplexComponent implements OnInit {
  /*
  This component is WIP and more features are being added upon.
  TODO: Code optimization/cleanup, UT/storybook needs to be considered once the component is stable.
  */

  // Input for dynamic tootip component
  tooltipComponent = input<Type<D3TooltipBaseComponent> | null>(
    D3TooltipBaseComponent
  );

  //  Ref to hold the tooltip rendering area
  private viewContainerRef = viewChild.required('tooltipComponentPlaceholder', {
    read: ViewContainerRef,
  });
  // Variableto hold ref to the dynamically rendered tooltip element in dom.
  private tooltipRef!: ComponentRef<D3TooltipBaseComponent>;

  ngOnInit() {
    // Initialize the chart
    this.loadChart();

    // Preload the tooltip placeholder
    this.renderTooltipComponent();
  }

  private renderTooltipComponent() {
    const viewContainerRef = this.viewContainerRef();
    console.log('renderTooltipComponent', viewContainerRef);
    if (viewContainerRef) {
      // Clear any existing content
      viewContainerRef.clear();
      // Dynamically create the component
      this.tooltipRef = viewContainerRef.createComponent(
        this.tooltipComponent() as Type<D3TooltipBaseComponent>
      );
    }
  }

  loadChart() {
    // get the data
    const data: NwTopologyNode = this.getData();

    // Specify the charts’ dimensions. The height is variable, depending on the layout.
    const width = 1400;
    const minHeight = 800;
    const marginTop = 50;
    const marginRight = 50;
    const marginLeft = 100;

    // Rows are separated by dx pixels, columns by dy pixels.
    // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
    // “bottom”, in the data domain. The width of a column can based on the tree’s height.
    const root = d3.hierarchy(data);
    const dx = 30; //10;
    const dy = (width - marginRight - marginLeft) / (1 + root.height) + 50;

    // Define the tree layout and the shape for links.
    const tree = d3.tree<NwTopologyNode>().nodeSize([dx, dy]);
    const diagonal = d3
      .linkHorizontal<
        {
          source: { x?: number | undefined; y?: number | undefined };
          target: { x?: number | undefined; y?: number | undefined };
        },
        { x?: number | undefined; y?: number | undefined }
      >()
      .x((d) => d.y as number)
      .y((d) => d.x as number);

    // Create the SVG container, a layer for the links and a layer for the nodes.
    const svg = d3
      .select('#complex-tree-view')
      .append('svg')
      .attr('width', width)
      .attr('height', minHeight)
      .attr('viewBox', [-marginLeft, -marginTop, width, dx])
      .attr(
        'style',
        'max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;'
      );

    // create a dot grid using a pattern fill
    svg
      .append('defs')
      .append('pattern')
      .attr('id', 'd3dots')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 24)
      .attr('height', 24)
      .append('circle')
      .attr('cx', 1)
      .attr('cy', 1)
      .attr('r', 1)
      .attr('fill', 'grey');

    // Create a group for the tree
    const gTree = svg
      .append('g')
      .attr('class', 'drawarea gTree')
      .attr('fill', 'url(#d3dots)');

    // Fill the group bg with a rect of dot grid pattern, considering some buffer area.
    gTree
      .append('rect')
      .attr('x', -width * 2)
      .attr('y', -minHeight * 2)
      .attr('width', width * 5)
      .attr('height', minHeight * 5)
      .attr('fill', 'url(#d3dots)');

    const gLink = gTree
      .append('g') // Create a subgroup for the links
      .attr('class', 'gLink')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    const gNode = gTree
      .append('g') // Create a subgroup for the nodes
      .attr('class', 'gNode');

    // Add a Tooltip placeholder element, hidden by default
    const tooltip = d3
      .select<HTMLDivElement, unknown>('#tooltip')
      .style('display', 'none')
      .style('position', 'absolute')
      .attr('class', 'tooltip')
      .style('background-color', '#ffffffee')
      .style('border', '1px solid #F0F0F0')
      .style('border-radius', '4px');

    // Function to render the topology tree
    const update = (
      source: d3.HierarchyNode<NwTopologyNode>,
      event?: MouseEvent
    ) => {
      const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore((node) => {
        if (node.x! < left.x!) left = node;
        if (node.x! > right.x!) right = node;
      });

      // Create a transition
      const transition = d3.transition().duration(duration);

      // Update the nodes…
      const node = gNode
        .selectAll<SVGGElement, NwTopologyNode>('g')
        .data(nodes, (d) => d.nodeId as KeyType);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append('g')
        .attr(
          'transform',
          () =>
            `translate(${
              (source.y0 as number) + (source.data.labelWidth || 0)
            },${source.x0})`
        ) // shift groups origin position
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      //Calculate label text width by rendering dummy text with same font style
      nodeEnter
        .append('text')
        .style('font-size', '12px')
        .text((d) => d.data.name) // Display node name
        .each(function (d) {
          // For each node ( text node), calculate the width of text label and attach it to a property, say data.labelWidth.
          const textWidth = d3.select(this).node()?.getBBox().width;
          // Attach the labelWidth to the data object
          d.data.labelWidth = (textWidth || 0) + 28; // textWidth + padding
        })
        .remove();

      // Add Label pills
      nodeEnter
        .append('rect')
        .attr('y', -11) // Adjust vertical position
        .attr('width', (d) => d.data.labelWidth || 0) // Oval width
        .attr('height', 22) // Oval height
        .attr('rx', 15) // Rounded corner radius
        .attr('ry', 15) // Rounded corner radius
        .attr('fill', (d) => (d._children ? '#FECDCA' : '#E7F3FF'))
        .attr('stroke', '#00AEEF') // Border color
        .attr('stroke-width', 1);

      //Add label text
      nodeEnter
        .append('text')
        .attr('dy', 4) // Vertical alignment
        .attr('x', 18) // Adjust text position
        .attr('text-anchor', 'start') // start|middle|end
        .style('font-size', '12px')
        .style('fill', '#692ab7') // Text color
        .text((d) => d.data.name); // Display node name

      // Add an icon to the left of the label text
      nodeEnter
        .append('text')
        .attr('dy', 4) // Vertical alignment
        .attr('x', 6) // Icon position to the left
        .style('font-family', 'cn-icon') // Use Font icons
        .style('fill', (d) => (d._children ? '#FE00CA' : '#00AEEF')) // Icon color
        .attr('font-size', '10px')
        .text('\u{ea3f}');

      // Add node toggle circle
      const nodeWithChildrenEnter = nodeEnter.filter((d) =>
        d._children ? true : false
      );

      const nodeChildrenToggleFn = (
        event: MouseEvent,
        d: d3.HierarchyNode<NwTopologyNode>
      ) => {
        console.log('nodeClicked', d);
        d.children = d.children ? undefined : d._children;

        // Change icon of nodetrigger for expanded collapsed state
        gNode
          .select('text.nodetrigger_' + d.data.nodeId)
          .text(d.children ? '\u{ea36}' : '\u{ea40}');

        // Redraw the node children
        update(d, event);
      };

      nodeWithChildrenEnter
        .append('circle')
        .attr('cx', (d) => {
          return (d.data.labelWidth || 0) + 12;
        }) // Adjust horizontal position
        .attr('r', 10)
        .attr('fill', (d) => (d._children ? '#ff0000cc' : 'blue'))
        .attr('stroke-width', 10)
        .attr('cursor', 'pointer')
        .on('click', nodeChildrenToggleFn);
      nodeWithChildrenEnter
        .append('text')
        .attr('dy', 6) // Vertical alignment
        .attr('x', (d) => (d.data.labelWidth || 0) + 6) // Icon position to the left
        .style('font-family', 'cn-icon') // Use Font icons
        .style('fill', (d) => (d._children ? '#ffffff' : '#000000')) // Icon color
        .attr('font-size', '12px')
        .attr('class', (d) => 'nodetrigger_' + d.data.nodeId)
        .text((d) => (d.children !== undefined ? '\u{ea36}' : '\u{ea40}'))
        .attr('cursor', 'pointer')
        .on('click', nodeChildrenToggleFn);

      // Add corner circle for counts
      const nodeWithErrorCountEnter = nodeEnter.filter(
        (d) => d.data.value !== undefined && d.data.value > 5
      );
      nodeWithErrorCountEnter
        .append('circle')
        .attr('cx', (d) => (d.data.labelWidth || 0) - 4) // Adjust horizontal position
        .attr('cy', -10) // Adjust vertical position
        .attr('r', 7)
        .attr('fill', (d) => (d._children ? '#D92D20' : '#00ff00'))
        .attr('stroke-width', 10);
      nodeWithErrorCountEnter
        .append('text')
        .attr('dy', -6) // Vertical alignment
        .attr('x', (d) => (d.data.labelWidth || 0) - 4) // Adjust text position
        .attr('text-anchor', 'middle') // start|middle|end
        .style('font-size', '12px')
        .style('font-weight', '700')
        .style('fill', '#ffffff') // Text color
        .text((d) => {
          const count = d.data.value || 0;
          return count > 9 ? '9+' : count;
        }); // Display count

      // Transition nodes to their new position.
      node
        .merge(nodeEnter)
        .transition(transition)
        .attr('transform', (d) => `translate(${d.y},${d.x})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      node
        .exit()
        .transition(transition)
        .remove()
        .attr(
          'transform',
          () =>
            `translate(${
              (source.y as number) + (source.data.labelWidth || 0)
            },${source.x})`
        )
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      // Update the links…
      const link = gLink
        .selectAll<SVGPathElement, d3.HierarchyLink<NwTopologyNode>>(
          'path.link'
        )
        .data(
          links.flatMap((d) => [d, { ...d, dummy: true }]),
          (d) => d.target.data.nodeId as KeyType
        );

      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .append('path')
        .attr(
          'class',
          (d) =>
            'link ' + 'link_' + d.target.data.nodeId + (d.dummy ? 'dummy' : '')
        )
        .attr('d', () => {
          const o = {
            x: source.x0,
            y: (source.y0 as number) + (source.data.labelWidth || 0),
          };
          return diagonal({ source: o, target: o });
        })
        .attr('stroke', (d) => (d.dummy ? '#00000000' : '#808080'))
        .attr('stroke-width', (d) => (d.dummy ? 8 : 1))
        .attr('stroke-dasharray', '4 1') // Dotted line
        .attr('d', () => {
          const o = {
            x: source.x0,
            y: (source.y0 as number) + (source.data.labelWidth || 0),
          };
          return diagonal({ source: o, target: o });
        })
        .on('mouseover', (event, d) => {
          console.log('linkHovered', event, d); // May Display tooltip
          gLink
            .select('path.link_' + d.target.nodeId)
            .attr('stroke', '#36454F')
            .attr('stroke-width', 2);

          // Show tooltip
          tooltip.style('display', 'block');
        })
        .on(
          'mousemove',
          (e: MouseEvent, d: d3.HierarchyLink<NwTopologyNode>) => {
            const rect = tooltip.node()?.getBoundingClientRect();

            // Update tooltip
            this.tooltipRef.setInput('tooltipData', d.target.data);
            tooltip
              .style('left', e.pageX - (rect?.width || 0) / 2 + 'px')
              .style('top', e.pageY - (rect?.height || 0) - 10 + 'px');
          }
        )
        .on('mouseleave', (event, d) => {
          gLink
            .select('path.link_' + d.target.nodeId)
            .attr('stroke', '#808080')
            .attr('stroke-width', 1);

          // Hide tooltip
          const t = d3.timer(() => {
            tooltip.style('display', 'none');
            t.stop();
          }, 300);
        });

      // Transition links to their new position.
      link
        .merge(linkEnter)
        .transition(transition)
        .attr('d', (d) => {
          const s = {
            x: d.source.x,
            y: (d.source.y as number) + (d.source.data.labelWidth || 0),
          };
          const t = {
            x: d.target.x,
            y: d.target.y as number,
          };
          return diagonal({ source: s, target: t });
        });

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition(transition)
        .remove()
        .attr('d', () => {
          const o = {
            x: source.x,
            y: (source.y as number) + (source.data.labelWidth || 0),
          };
          return diagonal({ source: o, target: o });
        });

      // Stash the old positions for transition.
      root.eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };

    // Do the first update to the initial configuration of the tree
    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.nodeId = '' + (d.data.nodeId || i);
      d._children = d.children;

      //Add some logic to open/close some nodes for initial state here
      if (d.depth && d.data.name.length !== 7) d.children = undefined;
    });

    update(root);

    //----Zoom--
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5]) // Min and max zoom scale
      .on('zoom', (event) => {
        gTree.attr('transform', event.transform);
      });
    svg.call(zoom); // Attach the zoom behavior to the main SVG
  }

  getData() {
    const indiaStats = {
      name: 'India',
      type: 'Country',
      value: Math.floor(Math.random() * 11),
      nodeId: 'node-1',
      children: [
        {
          name: 'Maharashtra',
          type: 'State',
          value: Math.floor(Math.random() * 11),
          nodeId: 'node-2',
          children: [
            {
              name: 'Mumbai',
              type: 'City',
              value: Math.floor(Math.random() * 11),
              nodeId: 'node-3',
              children: Array.from({ length: 10 }, (_, i) => ({
                name: `Suburb ${i + 1}`,
                type: 'Suburb',
                value: Math.floor(Math.random() * 11),
                nodeId: `node-3-${i + 1}`,
              })),
            },
            {
              name: 'Pune',
              type: 'City',
              value: Math.floor(Math.random() * 11),
              nodeId: 'node-4',
            },
          ],
        },
        {
          name: 'Karnataka',
          type: 'State',
          value: Math.floor(Math.random() * 11),
          nodeId: 'node-5',
          children: [
            {
              name: 'Bengaluru',
              type: 'City',
              value: Math.floor(Math.random() * 11),
              nodeId: 'node-6',
              children: [
                {
                  name: 'Whitefield',
                  type: 'Locality',
                  value: Math.floor(Math.random() * 11),
                  nodeId: 'node-7',
                  children: Array.from({ length: 7 }, (_, i) => ({
                    name: `Zone ${i + 1}`,
                    type: 'Zone',
                    value: Math.floor(Math.random() * 11),
                    nodeId: `node-7-${i + 1}`,
                  })),
                },
                {
                  name: 'Koramangala',
                  type: 'Locality',
                  value: Math.floor(Math.random() * 11),
                  nodeId: 'node-8',
                  children: Array.from({ length: 8 }, (_, i) => ({
                    name: `Block ${i + 1}`,
                    type: 'Block',
                    value: Math.floor(Math.random() * 11),
                    nodeId: `node-8-${i + 1}`,
                  })),
                },
                {
                  name: 'EC',
                  type: 'Locality',
                  value: Math.floor(Math.random() * 11),
                  nodeId: 'node-9',
                  children: Array.from({ length: 12 }, (_, i) => ({
                    name: `Phase ${i + 1}`,
                    type: 'Phase',
                    value: Math.floor(Math.random() * 11),
                    nodeId: `node-9-${i + 1}`,
                  })),
                },
                {
                  name: 'Malleshwaram is a long name',
                  type: 'Locality',
                  value: Math.floor(Math.random() * 11),
                  nodeId: 'node-10',
                },
                {
                  name: 'Jayanagar is another longer name',
                  type: 'Locality',
                  value: Math.floor(Math.random() * 11),
                  nodeId: 'node-11',
                  children: Array.from({ length: 5 }, (_, i) => ({
                    name: `Block ${i + 1}`,
                    type: 'Block',
                    value: Math.floor(Math.random() * 11),
                    nodeId: `node-11-${i + 1}`,
                  })),
                },
              ],
            },
          ],
        },
        {
          name: 'Uttar Pradesh',
          type: 'State',
          value: Math.floor(Math.random() * 11),
          nodeId: 'node-12',
          children: [
            {
              name: 'Lucknow',
              type: 'City',
              value: Math.floor(Math.random() * 11),
              nodeId: 'node-13',
              children: [
                {
                  name: 'Hazratganj',
                  type: 'Locality',
                  value: Math.floor(Math.random() * 11),
                  nodeId: 'node-14',
                  children: Array.from({ length: 15 }, (_, i) => ({
                    name: `Street ${i + 1}`,
                    type: 'Street',
                    value: Math.floor(Math.random() * 11),
                    nodeId: `node-14-${i + 1}`,
                  })),
                },
              ],
            },
          ],
        },
        {
          name: 'Tamil Nadu',
          type: 'State',
          value: Math.floor(Math.random() * 11),
          nodeId: 'node-15',
          children: [
            {
              name: 'Chennai',
              type: 'City',
              value: Math.floor(Math.random() * 11),
              nodeId: 'node-16',
            },
          ],
        },
        {
          name: 'Rajasthan',
          type: 'State',
          value: Math.floor(Math.random() * 11),
          nodeId: 'node-17',
          children: [
            {
              name: 'Jaipur',
              type: 'City',
              value: Math.floor(Math.random() * 11),
              nodeId: 'node-18',
            },
            {
              name: 'Udaipur',
              type: 'City',
              value: Math.floor(Math.random() * 11),
              nodeId: 'node-19',
              children: [
                {
                  name: 'Lake Pichola',
                  type: 'Attraction',
                  value: Math.floor(Math.random() * 11),
                  nodeId: 'node-20',
                },
              ],
            },
          ],
        },
      ],
    };
    return indiaStats;
  }
}
