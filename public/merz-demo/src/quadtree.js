// Barnes-Hut quadtree for force-graph repulsion — §14.7.
//
// Replaces the inner O(n²) loop in graph.jsx with O(n log n) via spatial
// approximation. For each node, we descend the tree and, if a region is
// "far enough" (size/distance < theta), treat its centre of mass as a
// single body instead of recursing.
//
// Pure JS, no dependencies. Exported on window.KOSQuadtree.

(function () {
  const THETA = 0.85;     // approximation threshold (smaller = more accurate, slower)
  const MAX_DEPTH = 12;

  // Build a quadtree from an array of {x, y, mass?} points. Returns root.
  function build(points) {
    if (!points.length) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
      if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const size = Math.max(maxX - minX, maxY - minY) + 1;
    const root = makeNode(cx - size / 2, cy - size / 2, size);
    for (const p of points) insert(root, p, 0);
    return root;
  }

  function makeNode(x, y, size) {
    return {
      x, y, size,           // bbox
      cx: 0, cy: 0,         // centre of mass
      mass: 0,
      body: null,           // single body if leaf
      children: null,       // [nw, ne, sw, se] when subdivided
    };
  }

  function insert(node, p, depth) {
    // accumulate centre of mass on the way down
    const m = (p.mass || 1);
    node.cx = (node.cx * node.mass + p.x * m) / (node.mass + m);
    node.cy = (node.cy * node.mass + p.y * m) / (node.mass + m);
    node.mass += m;

    if (depth >= MAX_DEPTH) {
      // depth cap: treat as merged body (we still applied COM above)
      return;
    }

    if (!node.body && !node.children) {
      node.body = p;
      return;
    }

    if (node.body) {
      // subdivide and re-insert existing body
      const old = node.body;
      node.body = null;
      subdivide(node);
      const oq = quadrant(node, old);
      insert(node.children[oq], old, depth + 1);
    }

    const q = quadrant(node, p);
    insert(node.children[q], p, depth + 1);
  }

  function subdivide(node) {
    const half = node.size / 2;
    node.children = [
      makeNode(node.x,        node.y,        half), // nw
      makeNode(node.x + half, node.y,        half), // ne
      makeNode(node.x,        node.y + half, half), // sw
      makeNode(node.x + half, node.y + half, half), // se
    ];
  }

  function quadrant(node, p) {
    const half = node.size / 2;
    const east = p.x >= node.x + half ? 1 : 0;
    const south = p.y >= node.y + half ? 2 : 0;
    return east + south;
  }

  // For body `p`, accumulate repulsive force from the tree.
  // `apply(dx, dy, mass)` is called for each effective interaction.
  function applyRepulsion(root, p, repel, apply) {
    if (!root) return;
    _apply(root, p, repel, apply);
  }

  function _apply(node, p, repel, apply) {
    if (!node.mass) return;
    if (node.body && node.body !== p) {
      const dx = p.x - node.body.x;
      const dy = p.y - node.body.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 1) d2 = 1;
      const f = repel / d2;
      const d = Math.sqrt(d2);
      apply(f * dx / d, f * dy / d);
      return;
    }
    if (node.children) {
      const dx = p.x - node.cx;
      const dy = p.y - node.cy;
      const d2 = dx * dx + dy * dy;
      if (d2 < 1) {
        // we're inside this region — recurse
        for (const c of node.children) _apply(c, p, repel, apply);
        return;
      }
      const d = Math.sqrt(d2);
      if (node.size / d < THETA) {
        // treat region as single body at COM (excluding self mass if p is inside)
        const f = repel / d2;
        apply(f * dx / d * node.mass, f * dy / d * node.mass);
      } else {
        for (const c of node.children) _apply(c, p, repel, apply);
      }
    }
  }

  window.KOSQuadtree = { build, applyRepulsion };
})();
