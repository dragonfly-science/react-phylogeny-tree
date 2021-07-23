import { PhylogenyTree } from '../types/phylogeny-tree';

export function createOnSelectPlugin(
  onSelect: (tree: PhylogenyTree, selectedIds: string[]) => void
) {
  return function onSelectPlugin(tree: PhylogenyTree, decorate) {
    decorate('selectNode', (delegate, args) => {
      delegate(...args);
      const selectedIds = tree.state.selectedIds;
      onSelect(tree, selectedIds);
    });
  };
}
