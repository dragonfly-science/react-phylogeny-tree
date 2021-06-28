import { useEffect } from 'react';

import { PhylocanvasTree } from '../types/phylocanvas';
import { setRootNLevelsUp, useGetLatest } from '../utils';

type SubtreeLeafOption = {
  leafSubtree: {
    leafID?: string;
    noLevels?: number;
    minLeafToRootLength?: number;
    setLeafLabels?: (ids: (string | number)[]) => void;
  };
};

export function useLeafSubtree(
  treeInstance: PhylocanvasTree | null,
  { leafSubtree: { leafID, noLevels, minLeafToRootLength, setLeafLabels } }: SubtreeLeafOption
) {
  const getTree = useGetLatest(treeInstance);

  useEffect(() => {
    const tree = getTree();
    if (tree && leafID) {
      setRootNLevelsUp(tree, leafID, noLevels, minLeafToRootLength);
      const ids = tree.nodes.leafNodes.map((value) => value.id);
      if (setLeafLabels) setLeafLabels(ids);
    }
  }, [leafID, noLevels, minLeafToRootLength, setLeafLabels, getTree]);
}
