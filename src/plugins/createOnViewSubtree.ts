import { PhylocanvasTree } from '../types/phylocanvas';

export function createOnViewSubtreePlugin(
  onViewSubtree: (tree: PhylocanvasTree, leafsInSubtree: string[]) => void
) {
  return function onViewSubtreePlugin(tree: PhylocanvasTree, decorate) {
    decorate('setRoot', (delegate, args) => {
      delegate(...args);

      if (tree.nodes) {
        const ids = tree.nodes.leafNodes.map((value) => value.id);
        onViewSubtree(tree, ids);
      }
    });
  };
}
