import contextMenuPlugin from '@mkoliba/phylocanvas-plugin-context-menu/index';
import { createTree } from '@mkoliba/phylocanvas/index';
import { useCallback, useEffect, useRef } from 'react';
// import interactionsPlugin from '@mkoliba/phylocanvas-plugin-interactions/index';

import { Newick, PhylogenyTreeOptions, PhylogenyTree } from 'react-phylocanvas3/src/types/phylogeny-tree';

export type Plugins = ((
  tree: PhylogenyTree,
  decorate: (fnName: string, fn: unknown) => void
) => void)[];
export type Hooks = ((
  getTree: () => PhylogenyTree | null,
  options: PhylogenyTreeOptions
) => void)[];

const defaultOptions = {
  nodeSize: 7,
  haloWidth: 2,
  highlightedStyle: '#34B6C7',
  haloStyle: '#34B6C7',
};

const emptyObject = {};
const emptyArray = [];

export function usePhylogenyTree(
  newick: Newick,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  options: PhylogenyTreeOptions = emptyObject,
  plugins: Plugins = emptyArray,
  hooks: Hooks = emptyArray,
  interactive = false
) {
  const treeInstance = useRef(null);
  const getTree = useCallback<() => PhylogenyTree | null>(() => treeInstance.current, []);

  useEffect(() => {
    if (canvasRef.current) {
      const parrent = canvasRef.current.parentElement;

      if (parrent?.clientWidth && parrent?.clientHeight) {
        canvasRef.current.width = parrent.clientWidth;
        canvasRef.current.height = parrent.clientHeight;
      }

      let allPlugins = plugins;
      if (interactive) {
        const interactionsPlugin =
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
          require('@mkoliba/phylocanvas-plugin-interactions/index').default;
        allPlugins = [contextMenuPlugin, interactionsPlugin, ...plugins];
      }

      const tree = createTree(
        canvasRef.current,
        {
          source: newick,
          ...defaultOptions,
          ...options,
        },
        allPlugins
      );
      treeInstance.current = tree;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newick, plugins]);

  useEffect(() => {
    const tree = getTree();
    if (tree) {
      tree.setState(options);
    }
  }, [options, getTree]);

  const handleZoomIn = useCallback(() => {
    const tree = getTree();
    if (tree && tree.state.scale < tree.state.maxScale * tree.pixelRatio) {
      tree.transform(0, 0, 1);
    }
  }, [getTree]);

  const handleZoomOut = useCallback(() => {
    const tree = getTree();
    if (tree && tree.state.scale > tree.state.minScale * tree.pixelRatio) {
      tree.transform(0, 0, -1);
    }
  }, [getTree]);

  loopHooks(hooks, getTree, options);

  return { handleZoomIn, handleZoomOut };
}

export const loopHooks = (hooks, getInstance, options) => {
  hooks.forEach((hook) => {
    const nextValue = hook(getInstance, options);
    if (process && process.env.NODE_ENV === 'development')
      if (typeof nextValue !== 'undefined') {
        throw new Error(
          'React Table: A loop-type hook ☝️ just returned a value! This is not allowed.'
        );
      }
  });
};
