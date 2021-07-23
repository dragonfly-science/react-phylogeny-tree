import { PhylogenyTree } from '../types/phylogeny-tree';

export function createOnRedrawReRootTreePlugin(
  onRedrawReRootTree: (tree: PhylogenyTree, leafsInTree: string[]) => void
) {
  // redraw original tree/re-root tree
  return function (tree: PhylogenyTree, decorate) {
    decorate('setSource', (delegate, args) => {
      delegate(...args);
      const ids = tree.nodes.leafNodes.map((value) => value.id);
      onRedrawReRootTree(tree, ids);
    });
  };
}
