import { useCallback, useRef } from 'react';

import { PhylocanvasTree, TreeNode } from './types/phylocanvas';

export function setRootNLevelsUp(
  tree: PhylocanvasTree,
  nodeID: string,
  noLevels = 6,
  minLeafToRootLength = 5
): void {
  let node: TreeNode | null = null;
  let upLength = 0;
  if (nodeID !== null) {
    node = tree.getNodeById(nodeID);
    if (node !== null) {
      upLength += node.branchLength;

      const noLevelsUp = noLevels >= 1 ? noLevels : 1;
      for (let i = 0; i < noLevelsUp; i++) {
        if (node?.parent) {
          node = node.parent;
          upLength += node.parent.branchLength;
        } else break;
      }
      while (upLength < minLeafToRootLength && node?.parent) {
        upLength += node.parent.branchLength;
        node = node.parent;
      }
    }
  }
  tree.setRoot(node ? node.id : null);
}

export function useGetLatest<T>(obj: T): () => T {
  const ref = useRef<T>();
  ref.current = obj;
  return useCallback(() => ref.current as T, []);
}
