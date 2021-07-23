import React from 'react';

import { Plugins, Hooks, usePhylogenyTree } from '../hooks/usePhylogenyTree';
import { Newick, PhylogenyTreeOptions } from '../types/phylogeny-tree';
import { TreeCanvas } from './canvas';
import { ZoomButtons } from './zoom_buttons';

type TreeProps = {
  newick: Newick;
  options?: PhylogenyTreeOptions;
  plugins?: Plugins;
  hooks?: Hooks;
  interactive?: boolean;
  zoom?: boolean;
  zoomStyle?: React.CSSProperties;
};

export function PhylogenyTree({
  newick,
  options,
  plugins,
  hooks,
  interactive,
  zoom = true,
  zoomStyle,
}: TreeProps): JSX.Element {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const { handleZoomIn, handleZoomOut } = usePhylogenyTree(
    newick,
    canvas,
    options,
    plugins,
    hooks,
    interactive
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <TreeCanvas ref={canvas} />
      {interactive && zoom && (
        <ZoomButtons onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} style={zoomStyle} />
      )}
    </div>
  );
}
