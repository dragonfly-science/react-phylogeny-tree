import { useEffect } from 'react';

import { PhylocanvasTree } from '../types/phylocanvas';

export function useAutoResize(getTree: () => PhylocanvasTree | null) {
  useEffect(() => {
    // console.log('useAutoResize2', getTree());
    function updateWidthAndHeight() {
      const tree = getTree();
      // console.log('useAutoResize3', tree);
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
  }, [getTree]);
}
