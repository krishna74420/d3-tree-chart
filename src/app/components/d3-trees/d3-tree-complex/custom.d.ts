// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword

import * as d3 from 'd3';

declare module 'd3' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HierarchyNode<Datum> {
    nodeId?: string | undefined;
    x0?: number | undefined;
    y0?: number | undefined;
    _children?: d3.HierarchyNode<Datum>[] | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HierarchyLink<Datum> {
    dummy?: boolean;
  }
}
