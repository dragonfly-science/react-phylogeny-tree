import { Tree } from '../types/phylocanvas';

export function createOnViewSubtreePlugin(onViewSubtree: (tree: Tree, leafsInSubtree: (string | number)[]) => void) {
  return function onViewSubtreePlugin(tree: Tree, decorate) {
    decorate('setRoot', (delegate, args) => {
      delegate(...args);
      if (tree.nodes)
      {
        const ids = tree.nodes.leafNodes.map((value) => value.id);
        onViewSubtree(tree, ids);
      }
    });
  };
}
