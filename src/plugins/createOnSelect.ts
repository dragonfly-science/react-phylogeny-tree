import { Tree } from '../types/phylocanvas';

export function createOnSelectPlugin(onSelect: (tree: Tree, selectedIds: string[]) => void) {
  return function onSelectPlugin(tree, decorate) {
    decorate('selectNode', (delegate, args) => {
      delegate(...args);
      const selectedIds = tree.state.selectedIds;
      console.log('onSelect', tree.state.scale);
      onSelect(tree, selectedIds);
      // if (selectedIds && selectedIds.length) {
      //   actions.setSelectedIDs(tree.state.selectedIds);
      // } else {
      //   // const ids = tree.nodes.leafNodes.map((value) => value.id);
      //   actions.deselectIDs();
      // }
    });
  };
}

