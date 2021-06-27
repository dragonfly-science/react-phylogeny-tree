import contextMenuPlugin from '@cgps/phylocanvas-plugin-context-menu/index';
import { createTree } from '@cgps/phylocanvas/index';
import { useCallback, useEffect, useRef } from 'react';
// import interactionsPlugin from '@cgps/phylocanvas-plugin-interactions/index';

import { Newick, PhylocanvasOptions, Tree } from '../types/phylocanvas';

export type Plugins = ((tree: Tree, decorate: (fnName: string, fn: unknown) => void) => void)[];
export type Hooks = ((tree: Tree, options: PhylocanvasOptions) => void)[];

const defaultOptions = {
  nodeSize: 7,
  haloWidth: 2,
  highlightedStyle: '#34B6C7',
  haloStyle: '#34B6C7',
};

const emptyObject = {};
const emptyArray = [];

export function usePhylocanvas(
  newick: Newick,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  options: PhylocanvasOptions = emptyObject,
  plugins: Plugins = emptyArray,
  hooks: Hooks = emptyArray,
  interactive = false
) {
  const treeInstance = useRef(null);
  const getTree = useCallback<() => Tree | null>(() => treeInstance.current, []); // equivalent to useGetLatest(treeInstance.current);

  useEffect(() => {
    if (canvasRef.current) {
      const parrent = canvasRef.current.parentElement;
      
      if (parrent?.clientWidth && parrent?.clientHeight) {
        canvasRef.current.width = parrent.clientWidth;
        canvasRef.current.height = parrent.clientHeight;
      }

      let allPlugins = plugins;
      if (interactive) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const interactionsPlugin = require('@cgps/phylocanvas-plugin-interactions/index').default;
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
      tree.controlledOptions = options;
      treeInstance.current = tree;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newick, plugins]);

  useEffect(() => {
    const tree = getTree();
    if (tree?.controlledOptions) {
      tree.controlledOptions = options;
    }
  }, [options, getTree]);

  loopHooks(hooks, getTree(), options);

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

  return { handleZoomIn, handleZoomOut };
}

export const loopHooks = (hooks, context, options) => {
  hooks.forEach((hook) => {
    const nextValue = hook(context, options);
    if (process && process.env.NODE_ENV === 'development')
      if (typeof nextValue !== 'undefined') {
        throw new Error(
          'React Table: A loop-type hook ☝️ just returned a value! This is not allowed.'
        );
      }
  });
};
