import { PhylocanvasTree } from '../types/phylocanvas';

export function createOnRedrawReRootTreePlugin(
  onRedrawReRootTree: (tree: PhylocanvasTree, leafsInTree: string[]) => void
) {
  // redraw original tree/re-root tree
  return function (tree: PhylocanvasTree, decorate) {
    decorate('setSource', (delegate, args) => {
      delegate(...args);
      const ids = tree.nodes.leafNodes.map((value) => value.id);
      onRedrawReRootTree(tree, ids);
    });
  };
}
