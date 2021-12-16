import { QuickSelect } from "./mod.ts";

/**
 * @author       Vladimir Agafonkin
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
export class RTree {
  private _maxEntries: number;
  private _minEntries: number;
  public data: any;
  public format = [
    ".left",
    ".right",
    ".top",
    ".bottom",
  ];
  constructor(maxEntries = 9) {
    this._maxEntries = Math.max(4, maxEntries);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
    this.clear();
  }

  public all() {
    return this._all(this.data, []);
  }
  public search(bbox: any) {
    let node = this.data;
    let result = [];
    let toBBox = this.toBBox;
    if (!intersects(bbox, node)) return result;

    let nodesToSearch = [];
    let i: number;
    let len: number;
    let child: any;
    let childBBox: any;

    while (node) {
      for (i = 0, len = node.children.length; i < len; i++) {
        child = node.children[i];
        childBBox = node.leaf ? toBBox(child) : child;

        if (intersects(bbox, childBBox)) {
          if (node.leaf) result.push(child);
          else if (contains(bbox, childBBox)) this._all(child, result);
          else nodesToSearch.push(child);
        }
      }
      node = nodesToSearch.pop();
    }
    return result;
  }
  public collides(bbox: any) {
    let node = this.data;
    let toBBox = this.toBBox;
    if (!intersects(bbox, node)) return false;

    let nodesToSearch = [];
    let i: number;
    let len: number;
    let child: any;
    let childBBox: any;

    while (node) {
      for (i = 0, len = node.children.length; i < len; i++) {
        child = node.children[i];
        childBBox = node.leaf ? toBBox(child) : child;

        if (intersects(bbox, childBBox)) {
          if (node.leaf || contains(bbox, childBBox)) return true;
          nodesToSearch.push(child);
        }
      }
      node = nodesToSearch.pop();
    }
    return false;
  }
  public load(data: any) {
    if (!data || data.length === 0) return this;

    if (data.length < this._minEntries) {
      for (let i = 0; i < data.length; i++) {
        this.insert(data[i]);
      }
      return this;
    }

    // recursively build the tree with the given data from stratch using OMT algorithm
    let node = this._build(data.slice(), 0, data.length - 1, 0);

    // save the result
    this.data = node;

    return this;
  }
  public insert(item: any) {
    if (item) this._insert(item, this.data.height - 1, true);
    return this;
  }
  public clear() {
    this.data = createNode([]);
    return this;
  }
  public remove(item: any) {
    if (!item) return this;

    let node = this.data,
      bbox = this.toBBox(item),
      path = [],
      indexes = [],
      i: number,
      parent: any,
      index: number,
      goingUp: boolean;

    // depth-first iterative tree traversal
    while (node || path.length) {
      if (!node) { // go up
        node = path.pop();
        parent = path[path.length - 1];
        i = indexes.pop();
        goingUp = true;
      }

      if (node.leaf) { // check current node
        index = findItem(item, node.children, this.toBBox);

        if (index !== -1) {
          // item found, remove the item and condense tree upwards
          node.children.splice(index, 1);
          path.push(node);
          this._condense(path);
          return this;
        }
      }

      if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
        path.push(node);
        indexes.push(i);
        i = 0;
        parent = node;
        node = node.children[0];
      } else if (parent) { // go right
        i++;
        node = parent.children[i];
        goingUp = false;
      } else node = null; // nothing found
    }

    return this;
  }
  public toJSON() {
    return this.data;
  }
  public fromJSON(data: any) {
    this.data = data;
    return this;
  }
  public _all(node: any, result: any) {
    let nodesToSearch: any = [];
    while (node) {
      if (node.leaf) result.push.apply(result, node.children);
      else nodesToSearch.push.apply(nodesToSearch, node.children);

      node = nodesToSearch.pop();
    }
    return result;
  }
  public _build(items: any, left: number, right: number, height: number) {
    let N = right - left + 1,
      M = this._maxEntries,
      node;

    if (N <= M) {
      // reached leaf level; return leaf
      node = createNode(items.slice(left, right + 1));
      calcBBox(node, this.toBBox);
      return node;
    }

    if (!height) {
      // target height of the bulk-loaded tree
      height = Math.ceil(Math.log(N) / Math.log(M));

      // target number of root entries to maximize storage utilization
      M = Math.ceil(N / Math.pow(M, height - 1));
    }

    node = createNode([]);
    node.leaf = false;
    node.height = height;

    // split the items into M mostly square tiles

    let N2 = Math.ceil(N / M),
      N1 = N2 * Math.ceil(Math.sqrt(M)),
      i,
      j,
      right2,
      right3;

    multiSelect(items, left, right, N1, this.compareMinX);

    for (i = left; i <= right; i += N1) {
      right2 = Math.min(i + N1 - 1, right);

      multiSelect(items, i, right2, N2, this.compareMinY);

      for (j = i; j <= right2; j += N2) {
        right3 = Math.min(j + N2 - 1, right2);

        // pack each entry recursively
        node.children.push(this._build(items, j, right3, height - 1));
      }
    }

    calcBBox(node, this.toBBox);

    return node;
  }
  public _chooseSubtree(bbox: any, node: any, level: number, path: any) {
    let i: number,
      len: number,
      child: any,
      targetNode: any,
      area: any,
      enlargement: any,
      minArea: any,
      minEnlargement: any;

    while (true) {
      path.push(node);

      if (node.leaf || path.length - 1 === level) break;

      minArea = minEnlargement = Infinity;

      for (i = 0, len = node.children.length; i < len; i++) {
        child = node.children[i];
        area = bboxArea(child);
        enlargement = enlargedArea(bbox, child) - area;

        // choose entry with the least area enlargement
        if (enlargement < minEnlargement) {
          minEnlargement = enlargement;
          minArea = area < minArea ? area : minArea;
          targetNode = child;
        } else if (enlargement === minEnlargement) {
          // otherwise choose one with the smallest area
          if (area < minArea) {
            minArea = area;
            targetNode = child;
          }
        }
      }

      node = targetNode;
    }

    return node;
  }
  public _insert(item: any, level: number, isNode: boolean) {
    let toBBox = this.toBBox,
      bbox = isNode ? item : toBBox(item),
      insertPath = [];

    // find the best node for accommodating the item, saving all nodes along the path too
    let node = this._chooseSubtree(bbox, this.data, level, insertPath);

    // put the item into the node
    node.children.push(item);
    extend(node, bbox);

    // split on node overflow; propagate upwards if necessary
    while (level >= 0) {
      if (insertPath[level].children.length > this._maxEntries) {
        this._split(insertPath, level);
        level--;
      } else break;
    }

    // adjust bboxes along the insertion path
    this._adjustParentBBoxes(bbox, insertPath, level);
  }
  public _split(insertPath: any, level: number) {
    let node = insertPath[level],
      M = node.children.length,
      m = this._minEntries;

    this._chooseSplitAxis(node, m, M);

    let splitIndex = this._chooseSplitIndex(node, m, M);

    let newNode = createNode(
      node.children.splice(splitIndex, node.children.length - splitIndex),
    );
    newNode.height = node.height;
    newNode.leaf = node.leaf;

    calcBBox(node, this.toBBox);
    calcBBox(newNode, this.toBBox);

    if (level) insertPath[level - 1].children.push(newNode);
    else this._splitRoot(node, newNode);
  }
  public _splitRoot(node: any, newNode: any) {
    // split root node
    this.data = createNode([node, newNode]);
    this.data.height = node.height + 1;
    this.data.leaf = false;
    calcBBox(this.data, this.toBBox);
  }
  public _chooseSplitIndex(node: any, m: number, M: number) {
    let i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

    minOverlap = minArea = Infinity;

    for (i = m; i <= M - m; i++) {
      bbox1 = distBBox(node, 0, i, this.toBBox);
      bbox2 = distBBox(node, i, M, this.toBBox);

      overlap = intersectionArea(bbox1, bbox2);
      area = bboxArea(bbox1) + bboxArea(bbox2);

      // choose distribution with minimum overlap
      if (overlap < minOverlap) {
        minOverlap = overlap;
        index = i;

        minArea = area < minArea ? area : minArea;
      } else if (overlap === minOverlap) {
        // otherwise choose distribution with minimum area
        if (area < minArea) {
          minArea = area;
          index = i;
        }
      }
    }

    return index;
  }
  // sorts node children by the best axis for split
  public _chooseSplitAxis(node: any, m: number, M: number) {
    const compareMinX = node.leaf ? this.compareMinX : compareNodeMinX;
    const compareMinY = node.leaf ? this.compareMinY : compareNodeMinY;
    const xMargin = this._allDistMargin(node, m, M, compareMinX);
    const yMargin = this._allDistMargin(node, m, M, compareMinY);

    // if total distributions margin value is minimal for x, sort by minX,
    // otherwise it's already sorted by minY
    if (xMargin < yMargin) node.children.sort(compareMinX);
  }
  // total margin of all possible split distributions where each node is at least m full
  public _allDistMargin(node: any, m: number, M: number, compare: any) {
    node.children.sort(compare);
    const toBBox = this.toBBox;
    const leftBBox = distBBox(node, 0, m, toBBox);
    const rightBBox = distBBox(node, M - m, M, toBBox);
    let margin = bboxMargin(leftBBox) + bboxMargin(rightBBox);
    let i: number, child: any;

    for (i = m; i < M - m; i++) {
      child = node.children[i];
      extend(leftBBox, node.leaf ? toBBox(child) : child);
      margin += bboxMargin(leftBBox);
    }

    for (i = M - m - 1; i >= m; i--) {
      child = node.children[i];
      extend(rightBBox, node.leaf ? toBBox(child) : child);
      margin += bboxMargin(rightBBox);
    }

    return margin;
  }
  public _adjustParentBBoxes(bbox: any, path: any, level: number) {
    // adjust bboxes along the given tree path
    for (let i = level; i >= 0; i--) {
      extend(path[i], bbox);
    }
  }
  public _condense(path: Array<any>) {
      // go through the path, removing empty nodes and updating bboxes
      for (let i = path.length - 1, siblings; i >= 0; i--) {
          if (path[i].children.length === 0) {
              if (i > 0) {
                  siblings = path[i - 1].children;
                  siblings.splice(siblings.indexOf(path[i]), 1);

              } else this.clear();

          } else calcBBox(path[i], this.toBBox);
      }
  }
  public compareMinX(a: any, b: any) {
        return a.left - b.left;
  }

  public compareMinY(a: any, b: any): number {
        return a.top - b.top;
  }

  public toBBox(a: any) {
        return {
            minX: a.left,
            minY: a.top,
            maxX: a.right,
            maxY: a.bottom
        }
    }
}

function findItem(item: any, items: any[], equalsFn: any) {
  if (!equalsFn) return items.indexOf(item);

  for (let i = 0; i < items.length; i++) {
    if (equalsFn(item, items[i])) return i;
  }
  return -1;
}

// calculate node's bbox from bboxes of its children
function calcBBox(node: any, toBBox: any) {
  distBBox(node, 0, node.children.length, toBBox, node);
}

// min bounding rectangle of node children from k to p-1
function distBBox(node: any, k: number, p: number, toBBox: any, destNode: any = createNode(null)) {
  destNode.minX = Infinity;
  destNode.minY = Infinity;
  destNode.maxX = -Infinity;
  destNode.maxY = -Infinity;

  for (let i = k, child; i < p; i++) {
    child = node.children[i];
    extend(destNode, node.leaf ? toBBox(child) : child);
  }

  return destNode;
}

function extend(a: any, b: any) {
  a.minX = Math.min(a.minX, b.minX);
  a.minY = Math.min(a.minY, b.minY);
  a.maxX = Math.max(a.maxX, b.maxX);
  a.maxY = Math.max(a.maxY, b.maxY);
  return a;
}

const compareNodeMinX = (a: any, b: any) => a.minX - b.minX;
const compareNodeMinY = (a: any, b: any) => a.minY - b.minY;

const bboxArea = (a: any) => (a.maxX - a.minX) * (a.maxY - a.minY);
const bboxMargin = (a: any) => (a.maxX - a.minX) + (a.maxY - a.minY);

function enlargedArea(a: any, b: any) {
  return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
    (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}

function intersectionArea(a: any, b: any) {
  let minX = Math.max(a.minX, b.minX),
    minY = Math.max(a.minY, b.minY),
    maxX = Math.min(a.maxX, b.maxX),
    maxY = Math.min(a.maxY, b.maxY);

  return Math.max(0, maxX - minX) *
    Math.max(0, maxY - minY);
}

function contains(a: any, b: any) {
  return a.minX <= b.minX &&
    a.minY <= b.minY &&
    b.maxX <= a.maxX &&
    b.maxY <= a.maxY;
}

function intersects(a: any, b: any) {
  return b.minX <= a.maxX &&
    b.minY <= a.maxY &&
    b.maxX >= a.minX &&
    b.maxY >= a.minY;
}

function createNode(children: any) {
  return {
    children: children,
    height: 1,
    leaf: true,
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
}

// sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
// combines selection algorithm with binary divide & conquer approach

function multiSelect(
  arr: Array<any>,
  left: number,
  right: number,
  n: number,
  compare: any,
) {
  let stack = [left, right],
    mid;

  while (stack.length) {
    right = stack.pop();
    left = stack.pop();

    if (right - left <= n) continue;

    mid = left + Math.ceil((right - left) / n / 2) * n;
    QuickSelect(arr, mid, left, right, compare);

    stack.push(left, mid, mid, right);
  }
}
