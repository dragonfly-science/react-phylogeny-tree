import { Tree } from '../types/phylocanvas';

export function createOnRedrawReRootTreePlugin(onRedrawReRootTree: (tree: Tree, leafsInTree: (string | number)[]) => void) {
  // redraw original tree/re-root tree
  return function (tree, decorate) {
    decorate('setSource', (delegate, args) => {
      delegate(...args);
      const ids = tree.nodes.leafNodes.map((value) => value.id);
      onRedrawReRootTree(tree, ids);
    });
  };
}