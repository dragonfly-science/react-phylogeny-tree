# react-phylocanvas3

React wrapper component for [Phylocanvas3](https://github.com/mkoliba/phylocanvas3). Use prepared component `PhylogenyTree` or build your own with `usePhylocanvas` hook.

## Example

```TSX
import React from 'react';

import PhylogenyTree from 'react-phylocanvas3';
import {
  createOnSelectPlugin,
  scaleBarPlugin,
  createOnViewSubtreePlugin
} from 'react-phylocanvas3/plugins';
import {useLeafSubtree, useAutoResize} from 'react-phylocanvas3/hooks';
import 'react-phylocanvas3/css/zoom.css'; // in next.js css imports might need to go to pages/_app.js
import '@cgps/phylocanvas-plugin-context-menu/styles.css';
import '@cgps/phylocanvas-plugin-interactions/styles.css';

const newick = '(((A:0.2, B:0.3):0.3,(C:0.5, D:0.3):0.2):0.3, E:0.7):1.0;';
const hooks = [useAutoResize, useLeafSubtree];

export function YourComponent(props): JSX.Element {
  const [highlighted, setHighlighted] = React.useState( ['A']);
  const [subtreeID, setSubtreeID] = React.useState<string>();

  // memoized props, so they are not recreated on every render and pass on ref. equality
  const options = useMemo(
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
        console.log('list of selected IDs', selectedIds)
        setHighlighted( selectedIds );
      }),
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
        <div>
           {highlighted}
        </div>
        <button
          onClick={() => {
            setSubtreeID('B');
          }}
        >
        set subtree around leaf B
      </button>

    </div>
  )
}
```
## Components
`PhylogenyTree`: main component which contain `TreeCanvas` component and `usePhylocanvas` hook. Its props are:
- `newick`: newick tree string, type `string`, mandatory
- `options`: object, Phylocanvas options
- `plugins`: array of plugins, viz section Plugins bellow
- `hooks`: array of hooks, viz section Hooks bellow
- `interactive`: boolean, activate Phylocanvas interaction and context-menu plugins
- `zoom`: boolean, when `interactive` and `zoom` are `true` buttons for zoom appears.
- `zoomStyle`: `CSSProperties` object passed to zoom buttons container. 


`TreeCanvas`: helper component which contains canvas. Can be used if you decide to create your own PhylogenyTree component.

## Plugins
Plugins supported by Phylocanvas3 of type:

```typescript
((tree: Tree, decorate: (fnName: string, fn: unknown) => void) => void)[];
```

### Phylocanvas plugins
Patched versions of Phylocanvas3 `@cgps/phylocanvas-plugin-context-menu` and `@cgps/phylocanvas-plugin-interactions` are already integrated in package and are added on begging of plugin list when `interactive` is set `true` in `PhylogenyTree` props or `usePhylocanvas` arguments. 

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
import from `react-phylocanvas3/hooks`, their type is:
```typescript
((tree: Tree, options: PhylocanvasOptions) => void)[];
```

`useLeafSubtree`

`useAutoResize`

## Utils

```typescript
function setRootNLevelsUp(tree: Tree, nodeID: string, noLevels = 6, minLeafToRootLength = 5): void;
```

`useGetLatest`
