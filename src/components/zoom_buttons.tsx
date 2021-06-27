import React from 'react';

export function ZoomButtons({ onZoomIn, onZoomOut, style }): JSX.Element {
  return (
    <div className="react-phylocanvas3-ctrl-group" style={style}>
      <button className="react-phylocanvas3-ctrl-zoom-in" type="button" onClick={onZoomIn} title="Zoom In">
        <span className="react-phylocanvas3-ctrl-icon" aria-hidden="true"></span>
      </button>
      <button className="react-phylocanvas3-ctrl-zoom-out" type="button" onClick={onZoomOut} title="Zoom Out">
        <span className="react-phylocanvas3-ctrl-icon" aria-hidden="true"></span>
      </button>
    </div>
  );
}
