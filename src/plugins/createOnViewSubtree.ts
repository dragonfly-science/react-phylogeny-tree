import { PhylogenyTree } from '../types/phylogeny-tree';

export function createOnViewSubtreePlugin(
  onViewSubtree: (tree: PhylogenyTree, leafsInSubtree: string[]) => void
) {
  return function onViewSubtreePlugin(tree: PhylogenyTree, decorate) {
    decorate('setRoot', (delegate, args) => {
      delegate(...args);

      if (tree.nodes) {
        const ids = tree.nodes.leafNodes.map((value) => value.id);
        onViewSubtree(tree, ids);
      }
    });
  };
}
