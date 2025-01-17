export type Newick = string;

type NodeStyle = Partial<{ shape: string; [key: string]: unknown }>;

export type Decorate = (fnName: string, fn: unknown) => void;

type PhylogenyTreeState = {
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
  interactions?: { highlight: boolean; pan: boolean; selection: boolean; tooltip: boolean; zoom: boolean };
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
  renderInternalLabels: boolean;
  renderLabels: boolean;
  renderLeafLabels: boolean;
  rootId: string | null;
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
  selectableInternalNodes: boolean;
  selectableLeafNodes: boolean;
  selectedIds: string[];
  showLabels: boolean;
  showNodes: boolean;
  size: { width: number; height: number };
  source: Newick;
  stepScale: number;
  strokeStyle: string;
  styleLeafLabels: boolean;
  styleNodeLines: boolean;
  styles: NodeStyle;
  type: string;
  zoomFactor: number;
};

type TreeNodes = {
  leafNodes: Leaf[];
  maxLabelWidth: number;
  nodeById: { [key: string]: TreeNode };
  originalSource: Newick;
  postorderTraversal: TreeNode[];
  preorderTraversal: TreeNode[];
  rootNode: TreeNode;
  source: Newick;
};

export type TreeNode = {
  angle: number;
  branchLength: number;
  children?: TreeNode[]
  distanceFromRoot: number;
  id: string | number;
  isCollapsed: boolean;
  isHidden: boolean;
  name?: string;
  isLeaf: boolean;
  parent: TreeNode;
  postIndex: number;
  preIndex: number;
  totalLeafLength: number;
  totalLeaves: number;
  totalNodes: number;
  visibleLeaves: number;
  x: number;
  y: number;
};

export type Leaf = {
  id: string;
} & TreeNode;

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

type NodeOrId = string | number | TreeNode;
type LeafNodeOrId = string | TreeNode;

type VirtualTree = {
  nodeById: NodeOrId;
  rootNode: TreeNode;
  leafNodes: Leaf;
  postorderTraversal: TreeNode[];
  preorderTraversal: TreeNode[];
  source: Newick;
  originalSource: Newick;
};

type Layout = { maxLabelWidth: number } & VirtualTree;

export type PhylogenyTree = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  state: PhylogenyTreeState;
  nodes: TreeNodes;
  pixelRatio: number;
  contextMenu?: ContextMenu;
  cache: (name) => void;
  chain: (...pipeline) => { [keys: string]: unknown };
  changeBranchScale: (delta: number, point: { x: number; y: number }) => void;
  changeScale: (dz: number, point: { x: number; y: number }) => void;
  changeStepScale: (delta: number, point: { x: number; y: number }) => void;
  collapseNode: (nodeOrId: NodeOrId, { refit }: { refit: boolean }) => void;
  destroy: () => void;
  drawBGLayer: (layout) => void;
  drawHighlight: (node: TreeNode) => void;
  drawNode: (layout, node: TreeNode) => void;
  drawNodeShape: (node, shape: string, size: number, radius: number) => void;
  exportPNG: () => unknown;
  fitInPanel: () => void;
  getBounds: () => {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  getCentrePoint: () => { x: number; y: number };
  getDrawingArea: () => {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  getInitialState: (options: PhylogenyTreeOptions) => PhylogenyTreeState;
  getLabel: (node: NodeOrId) => string | number;
  getLeafIds: (node: NodeOrId) => string[];
  getLeafLabels: (node: NodeOrId) => string[];
  getLeafNodes: (nodeOrId: LeafNodeOrId) => Leaf;
  getNewick: (nodeOrId: LeafNodeOrId, option: PhylogenyTreeOptions) => string;
  getNodeAtPoint: (x: number, y: number) => TreeNode | null;
  getNodeById: (nodeOrId: NodeOrId) => TreeNode;
  getNodeLabels: (nodeIds: string | number) => string[];
  getVirtualTree: () => VirtualTree;
  highlightNode: (nodeOrId: NodeOrId) => void;
  init: (options: PhylogenyTreeOptions) => void;
  layout: () => Layout;
  measureTextWidth: (text: string, weight: string) => number;
  mergeState: (state: Partial<PhylogenyTreeState>) => void;
  postRender: (nodes: VirtualTree) => void;
  preRender: (layout: Layout) => void;
  render: () => void;
  rerootNode: (layout: Layout, parent: TreeNode, sourceNode: TreeNode) => void;
  reset: (source) => void;
  resetCollapsedNodes: ({ refit }: { refit: boolean }) => void;
  resize: (width: number, heigh: number) => void;
  resizeCanvas: () => void;
  rotateNode: (nodeOrId: NodeOrId, { refit }: { refit: boolean }) => void;
  selectLeafNodes: (ids: string[], append: boolean) => void;
  selectNode: (nodeOrId: NodeOrId, append: boolean) => void;
  setBranchScale: (branchScale: number, point: { x: number; y: number }) => void;
  setFontSize: (fontSize: number) => void;
  setNodeSize: (nodeSize: number) => void;
  setRoot: (nodeOrId: string | number | TreeNode | null) => void;
  setScale: (scale: number, point: { x: number; y: number }) => void;
  setSource: (source: Newick) => void;
  setState: (updater: Partial<PhylogenyTreeState>) => void;
  setStepScale: (stepScale: number, point: { x: number; y: number }) => void;
  setStyles: (styles: NodeStyle) => void;
  setTreeType: (type) => void;
  toggleAlignLeafLabels: () => void;
  toggleLeafLabels: () => void;
  transform: (dx?: number, dy?: number, dz?: number, point?: { x: number; y: number }) => void;
  trigger: (eventName, args) => void;
};

export type PhylogenyTreeOptions = { [keys: string]: unknown } & Partial<PhylogenyTreeState>;
