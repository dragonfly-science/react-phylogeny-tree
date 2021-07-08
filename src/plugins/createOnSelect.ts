import { PhylocanvasTree } from '../types/phylocanvas';

export function createOnSelectPlugin(
  onSelect: (tree: PhylocanvasTree, selectedIds: string[]) => void
) {
  return function onSelectPlugin(tree: PhylocanvasTree, decorate) {
    decorate('selectNode', (delegate, args) => {
      delegate(...args);
      const selectedIds = tree.state.selectedIds;
      onSelect(tree, selectedIds);
    });
  };
}
