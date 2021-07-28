# react-phylogeny-tree

React component (and hook) for phylogenetic tree visualisation from Newick tree format. Based on [@mkoliba/phylogeny-tree](https://github.com/mkoliba/phylogeny-tree), the fork of the Phylocanvas development branch phylocanvas-3 (developed by [The Centre for Genomic Pathogen Surveillance](https://www.pathogensurveillance.net/)).

It handles up to ~15 000 leaves.

Use prepared component `PhylogenyTree` or build your own component with `usePhylocanvas` hook.

![phylogeny-tree example illustration](https://github.com/mkoliba/phylogeny-tree/raw/main/illustration.jpg)

## Example

```TSX
import React from 'react';

import scaleBarPlugin from '@mkoliba/phylogeny-tree-plugin-scalebar';
import PhylogenyTree from 'react-phylogeny-tree';
import {
  createOnSelectPlugin,
  createOnViewSubtreePlugin,
  createOnRedrawReRootTreePlugin,
} from 'react-phylogeny-tree/plugins';
import {useLeafSubtree, useAutoResize} from 'react-phylogeny-tree/hooks';
import 'react-phylogeny-tree/css/zoom.css'; // in next.js css imports might need to go to pages/_app.js
import '@mkoliba/phylogeny-tree-plugin-context-menu/styles.css';
import '@mkoliba/phylogeny-tree-plugin-interactions/styles.css';

const newick = '(((A:0.2, B:0.3):0.3,(C:0.5, D:0.3):0.2):0.3, E:0.7):1.0;';
const hooks = [useAutoResize, useLeafSubtree];

export function YourComponent(props): JSX.Element {
  const [highlighted, setHighlighted] = React.useState(['A']);
  const [subtreeID, setSubtreeID] = React.useState<string>();
  const [leafs, setLeafs] = React.useState<string[]>();

  // memoized props, so they are not recreated on every render and pass on ref. equality
  const options = React.useMemo(
    () => ({
      selectedIds: highlighted,
      leafSubtree: { leafID: subtreeID, noLevels: 1, minLeafToRootLength: 0 },
      tooltipContent: (node) => {
        return `id: ${node.id}<br>
          branch length: ${node.branchLength}`;
      },
    }),
    [highlighted, subtreeID]
  );
  const plugins = React.useMemo(() => {
    return [
      scaleBarPlugin,
      createOnSelectPlugin((tree, selectedIds) => {
        setHighlighted(selectedIds);
      }),
      createOnViewSubtreePlugin((tree, leafsInTree) => {
        setSubtreeID(null)
        setLeafs(leafsInTree);
      }),
      createOnRedrawReRootTreePlugin((tree, leafsInTree) => {
        setSubtreeID(null)
        setLeafs(leafsInTree);
      })
    ];
  }, []);

  return (
    <div>
      <div className="containerToBeFilledWithCanvas">
        <PhylogenyTree
            newick={newick}
            options={options}
            hooks={hooks}
            plugins={plugins}
            interactive={true}
            zoom
          />
      </div>
      <button
        onClick={() => {
          setSubtreeID('B');
        }}
      >
        set subtree around leaf B
      </button>
      <div>leafs in subtree: {leafs}</div>
      <div>selected IDs: {highlighted}</div>
    </div>
  )
}
```

## Main API
`PhylogenyTree`: component containing `TreeCanvas`, `ZoomButtons` components and `usePhylocanvas` hook. Its props are:
- `newick`: newick tree string
  - type `string`
  - mandatory 
  - should be memoized, if changes phylogeny-tree instance is reinitialised
- `options`: object, phylogeny-tree options
- `plugins`: array of plugins, viz section Plugins bellow
  - should be memoized, if changes phylogeny-tree instance is reinitialised
- `hooks`: array of hooks, viz section Hooks bellow
- `interactive`: boolean, activate phylogeny-tree interaction and context-menu plugins
- `zoom`: boolean, when `interactive` and `zoom` are `true` buttons for zoom appears.
- `zoomStyle`: `CSSProperties` object passed to zoom buttons container. 

`usePhylocanvas`: react hook wrapping phylogeny-tree instance
- `newick`: newick tree string
  - type `string`
  - mandatory 
  - should be memoized, if changes phylogeny-tree instance is reinitialised
- `canvasRef`: `React.MutableRefObject<HTMLCanvasElement | null>`
- `options`: object, phylogeny-tree options
- `plugins`: array of plugins, viz section Plugins bellow
  - should be memoized, if changes phylogeny-tree instance is reinitialised
- `hooks`: array of hooks, viz section Hooks bellow
- `interactive` when true activate phylogeny-tree interaction and context-menu plugins
  - type: boolean

## Plugins
Plugins supported by react-phylogeny of type:

```typescript
((tree: Tree, decorate: (fnName: string, fn: unknown) => void) => void)[];
```

### phylogeny-tree plugins
`@mkoliba/phylogeny-tree-plugin-context-menu` and `@mkoliba/phylogeny-tree-plugin-interactions` are prepared in `usePhylocanvas` and are added on begging of plugin list when `interactive` is set to `true` in `PhylogenyTree` props or `usePhylocanvas` arguments. 

`scaleBarPlugin`: plugin which adds the scale bar as a reference for branch length.

### Plugin factories
Serve for creation of plugin function with callback. Import from `react-phylogeny-tree/plugins`.

`createOnSelectPlugin` type:
```typescript 
(onSelect: (tree: Tree, selectedIds: string[]) => void) => (tree: Tree, decorate: (fnName: string, fn: unknown) => void) => void
```
- `onSelect`: callback which will be called when tree leafs are selected and highlighted. 
- `tree`: phylogeny-tree instance
- `selectedIds`: string of selected leaf IDs/labels


`createOnRedrawReRootTreePlugin` type:
```typescript 
(onRedrawReRootTree: (tree: Tree, leafsInTree: (string | number)[]) => void) => (tree: Tree, decorate: (fnName: string, fn: unknown) => void) => void
```
- `onRedrawReRootTree`: callback which will be called when _redraw original tree_ or _reroot tree_ is invoked in context menu. 


`createOnViewSubtreePlugin`
```typescript 
(onViewSubtree: (tree: Tree, leafsInSubtree: (string | number)[]) => void) => (tree: Tree, decorate: (fnName: string, fn: unknown) => void) => void
```
- `onViewSubtree`: callback which will be called when _view subtree_ is invoked in context menu.

### custom plugins
You can create your own plugin for `phylogeny-tree`. They are just a function which accepts tree instance and internal decorate function from `phylogeny-tree`. 

## Hooks
import from `react-phylogeny-tree/hooks`. Pass in array with stable reference between rerenders (memoize). Their type is:
```typescript
((getTreeInstance: () => Tree | null, options: PhylogenyTreeOptions) => void)[];
```

`useLeafSubtree`: react hook which wraps `setRootNLevelsUp`. Needs to receive folowing object under key `leafSubtree` from `options`.
``` typescript
leafSubtree: {
    leafID?: string;
    noLevels?: number;
    minLeafToRootLength?: number;
    setLeafLabels?: (ids: (string | number)[]) => void;
  }
```

`useAutoResize`: react hook for autoresizing canvas when window size changes.

## Utils
`setRootNLevelsUp`: function which receive phylogeny-tree instance and ID of a leaf and show subtree which root is at least `noLevels` up in hierarchy and minimal length between leaf and new subtree root is `minLeafToRootLength`.
```typescript
(tree: Tree, nodeID: string, noLevels = 6, minLeafToRootLength = 5) => void;
```

## SSR
Package does not support SSR (server side rendering). It is necessary to exclude component which use package from SSR or transpile it. 

### In NEXT.js
import component which use this package using NEXT.js dynamic import:
```javascript
import dynamic from 'next/dynamic'

const ComponentWithTree = dynamic(
  () => import('../components/component_with_tree'),
  { ssr: false }
)
```

Or use [next-transpile-modules](https://github.com/martpie/next-transpile-modules):
```javascript
const withTM = require('next-transpile-modules')(['react-phylogeny-tree']);
module.exports = withTM();
```

