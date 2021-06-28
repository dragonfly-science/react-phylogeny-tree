# react-phylocanvas3

React wrapper for [Phylocanvas3](https://github.com/mkoliba/phylocanvas3), phylogeny tree visualisation library. Use prepared component `PhylogenyTree` or build your own with `usePhylocanvas` hook.

## Example

```TSX
import React from 'react';

import PhylogenyTree from 'react-phylocanvas3';
import {
  createOnSelectPlugin,
  scaleBarPlugin,
  createOnViewSubtreePlugin,
  createOnRedrawReRootTreePlugin,
} from 'react-phylocanvas3/plugins';
import {useLeafSubtree, useAutoResize} from 'react-phylocanvas3/hooks';
import 'react-phylocanvas3/css/zoom.css'; // in next.js css imports might need to go to pages/_app.js
import '@cgps/phylocanvas-plugin-context-menu/styles.css';
import '@cgps/phylocanvas-plugin-interactions/styles.css';

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
    <div className="containerToBeFilledWithCanvas">
      <PhylogenyTree
          newick={newick}
          options={options}
          hooks={hooks}
          plugins={plugins}
          interactive={true}
          zoom
        />
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
- `newick`: newick tree string, type `string`, mandatory
- `options`: object, Phylocanvas options
- `plugins`: array of plugins, viz section Plugins bellow
- `hooks`: array of hooks, viz section Hooks bellow
- `interactive`: boolean, activate Phylocanvas interaction and context-menu plugins
- `zoom`: boolean, when `interactive` and `zoom` are `true` buttons for zoom appears.
- `zoomStyle`: `CSSProperties` object passed to zoom buttons container. 

`usePhylocanvas`: react hook wrapping Phylocanvas instance
- `newick`: newick tree string, type `string`, mandatory,
- `canvasRef`: `React.MutableRefObject<HTMLCanvasElement | null>`
- `options`: object, Phylocanvas options
- `plugins`: array of plugins, viz section Plugins bellow
- `hooks`: array of hooks, viz section Hooks bellow
- `interactive` = false

## Plugins
Plugins supported by Phylocanvas3 of type:

```typescript
((tree: Tree, decorate: (fnName: string, fn: unknown) => void) => void)[];
```

### Phylocanvas plugins
Patched versions of Phylocanvas3 `@cgps/phylocanvas-plugin-context-menu` and `@cgps/phylocanvas-plugin-interactions` are prepared in `usePhylocanvas` and are added on begging of plugin list when `interactive` is set to `true` in `PhylogenyTree` props or `usePhylocanvas` arguments. 

`scaleBarPlugin`: plugin which adds the scale bar as a reference for branch length.

### Plugin factories
Serve for creation of plugin function with callback. Import from `react-phylocanvas3/plugins`.

`createOnSelectPlugin` type:
```typescript 
(onSelect: (tree: Tree, selectedIds: string[]) => void) => (tree: Tree, decorate: (fnName: string, fn: unknown) => void) => void
```
- `onSelect`: callback which will be called when tree leafs are selected and highlighted. 
- `tree`: phylocanvas instance
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
You can create your own plugin for phylocanvas3. They are just a function which accepts tree instance and internal decorate function from Phylocanvas. 

## Hooks
import from `react-phylocanvas3/hooks`. Pass in array with stable reference between rerenders (memoize). Their type is:
```typescript
((tree: Tree, options: PhylocanvasOptions) => void)[];
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
`setRootNLevelsUp`: function which receive Phylocanvas instance and ID of a leaf and show subtree which root is at least `noLevels` up in hierarchy and minimal length between leaf and new subtree root is `minLeafToRootLength`.
```typescript
(tree: Tree, nodeID: string, noLevels = 6, minLeafToRootLength = 5) => void;
```

