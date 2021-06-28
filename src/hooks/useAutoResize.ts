import { useEffect } from 'react';

import { PhylocanvasTree } from '../types/phylocanvas';
import { useGetLatest } from '../utils';

export function useAutoResize(treeInstance: PhylocanvasTree | null) {
  const getTree = useGetLatest(treeInstance);
  // console.log('useAutoResize1', treeInstance, treeInstance?.state);
  useEffect(() => {
    // console.log('useAutoResize2', treeInstance);
    function updateWidthAndHeight() {
      const tree = getTree();
      if (tree) {
        const width = tree.canvas.parentElement?.clientWidth;
        const height = tree.canvas.parentElement?.clientHeight;
        if (width && height) {

          tree.resize(width, height);
        }
      }
    }
    window.addEventListener('resize', updateWidthAndHeight);

    return function cleanUpAutoResize() {
      window.removeEventListener('resize', updateWidthAndHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
