export type Newick = string;

type NodeStyle = Partial<{ shape: string; [key: string]: unknown }>;

export type Decorate = (fnName: string, fn: unknown) => void;

type PhylocanvasState = {
  alignLabels: boolean;
  branchScale: number;
  collapsedIds: string[];
  fillStyle: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  haloRadius: number;
  haloStyle: string;
  haloWidth: number;
  highlightedId: null | string[];
  highlightedStyle: string;
  interactions?: { highlight: true; pan: true; selection: true; tooltip: true; zoom: true };
  internalNodeStyle: NodeStyle;
  labelThreshold: number;
  leafNodeStyle: NodeStyle;
  lineWidth: number;
  maxScale: number;
  minScale: number;
  nodeSize: number;
  nodesPowRatio: number;
  offsetX: number;
  offsetY: number;
  padding: number;
  renderInternalLabels: false;
  renderLabels: true;
  renderLeafLabels: true;
  rootId: null;
  rotatedIds: [];
  scale: number;
  scalebar?: {
    background: string;
    digits: number;
    fillStyle: string;
    fontSize: number;
    height: number;
    lineWidth: number;
    padding: number;
    position: { left: number; bottom: number };
    strokeStyle: string;
    textAlign: string;
    textBaseline: string;
    textBaselineOffset: number;
    width: number;
  };
  selectableInternalNodes: true;
  selectableLeafNodes: true;
  selectedIds: string[];
  showLabels: false;
  showNodes: true;
  size: { width: number; height: number };
  source: Newick;
  stepScale: number;
  strokeStyle: string;
  styleLeafLabels: false;
  styleNodeLines: false;
  styles: NodeStyle;
  type: string;
  zoomFactor: number;
};

type TreeNodes = {
  leafNodes: Leaf[];
  maxLabelWidth: 28;
  nodeById: { [key: string]: TreeNode };
  originalSource: Newick;
  postorderTraversal: TreeNode[];
  preorderTraversal: TreeNode[];
  rootNode: TreeNode;
  source: Newick;
};

export type TreeNode = {
  angle: 0;
  branchLength: 0.1;
  distanceFromRoot: 0.1;
  id: string | number;
  isCollapsed: false;
  isHidden: false;
  isLeaf: true;
  parent: TreeNode;
  postIndex: 0;
  preIndex: 1;
  totalLeafLength: 0.1;
  totalLeaves: 1;
  totalNodes: 1;
  visibleLeaves: 1;
  x: 3.439360929557008;
  y: 0;
};

export type Leaf = {
  id: string
} & TreeNode

type ContextMenu = {
  close: unknown;
  el: HTMLElement;
  filenames: { [key: string]: string };
  invalidate: boolean;
  nodeMenuItems: unknown[][];
  open: unknown;
  parent: HTMLBodyElement;
  treeMenuItems: unknown[][];
};

export type PhylocanvasTree = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  state: PhylocanvasState;
  nodes: TreeNodes;
  pixelRatio: number;
  contextMenu?: ContextMenu;
  cache: () => void;
  chain: () => void;
  changeBranchScale: () => void;
  changeScale: () => void;
  changeStepScale: () => void;
  collapseNode: () => void;
  destroy: () => void;
  drawHighlight: () => void;
  drawNode: () => void;
  drawNodeShape: () => void;
  exportPNG: () => void;
  fitInPanel: () => void;
  getBounds: () => void;
  getCentrePoint: () => void;
  getDrawingArea: () => void;
  getInitialState: () => void;
  getLabel: () => void;
  getLeafIds: () => void;
  getLeafLabels: () => void;
  getLeafNodes: (nodeOrId: string | TreeNode) => void;
  getNewick: () => void;
  getNodeAtPoint: () => void;
  getNodeById: (nodeOrId: string| number | TreeNode) => TreeNode;
  getNodeLabels: () => void;
  getVirtualTree: () => void;
  highlightNode: () => void;
  index: () => void;
  init: () => void;
  layout: () => void;
  measureTextWidth: () => void;
  mergeState: () => void;
  postRender: () => void;
  preRender: () => void;
  render: () => void;
  rerootNode: () => void;
  reset: () => void;
  resetCollapsedNodes: () => void;
  resize: (width: number, heigh: number) => void;
  resizeCanvas: () => void;
  rotateNode: () => void;
  selectLeafNodes: () => void;
  selectNode: () => void;
  setBranchScale: () => void;
  setFontSize: () => void;
  setNodeSize: () => void;
  setRoot: (nodeOrId: string| number | TreeNode | null) => void;
  setScale: () => void;
  setSource: () => void;
  setState: (updater: PhylocanvasState) => void;
  setStepScale: () => void;
  setStyles: () => void;
  setTreeType: () => void;
  toggleAlignLeafLabels: () => void;
  toggleLeafLabels: () => void;
  transform: (dx?: number, dy?: number, dz?: number, point?: { x: number; y: number }) => void;
  trigger: () => void;
};

export type PhylocanvasOptions = { [keys: string]: unknown } & Partial<PhylocanvasState>;
