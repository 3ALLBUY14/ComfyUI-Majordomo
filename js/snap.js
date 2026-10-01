// =============================================================================
// Node Alignment Snap Align — drag-to-snap alignment guides
//
// Self-contained module. Does NOT modify any existing Node Alignment code.
// Default OFF. When disabled, the pointermove handler returns on the very
// first line (one boolean read) — zero overhead.
//
// Architecture (adapted from ComfyUI-Pixaroma js/align/index.js):
//   1. window.addEventListener("pointermove", …, false)  — BUBBLE phase
//      Runs AFTER LiteGraph applies its mouse delta, so we read the post-move
//      position and apply a snap correction on top.
//   2. window.addEventListener("pointerdown", …, true)   — CAPTURE phase
//      Snapshots all node sizes as the gesture-start baseline.
//   3. Monkey-patch LGraphCanvas.prototype.drawFrontCanvas
//      Draws guide lines AFTER LiteGraph finishes its render pass.
//
// Shift bypasses snap during drag.  Alt+S toggles on/off.
// =============================================================================

import { app } from "../../scripts/app.js";

const SETTING_ENABLED  = "Hk.Snap.Enabled";
const SETTING_SNAP_DIST = "Hk.Snap.SnapDistance";
const BRAND = "#8BC3F3";          // Node Alignment accent color
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 7v10"/><path d="M11 7v10"/><path d="M15 7v10"/><path d="M19 7v10"/></svg>`;

// Resolve the active UI language using the same key the Node Alignment panel
// persists ("hk-lang": "zh" | "en"). Keeps this module self-contained.
function snapLang() {
  try {
    if (localStorage.getItem("hk-lang") === "zh") return "zh";
  } catch {}
  return "en";
}

const state = {
  enabled: false,
  snapDistPx: 8,
  activeGuides: [],
  dragInfo: null,          // single-node drag session
  groupDrag: null,         // group drag session
  _prevNodeStates: null,   // per-tick node position cache
  _prevGroupRects: null,   // per-tick group rect cache
  _gestureSizes: null,     // gesture-start node sizes (resize guard)
  toolbarBtn: null,
  _panelCallbacks: [],     // panel snap-toggle state-change callbacks
};

// ── Geometry utilities ───────────────────────────────────────────────────────

function rectEdges(r) {
  return {
    left: r.x, right: r.x + r.w, centerX: r.x + r.w / 2,
    top: r.y, bottom: r.y + r.h, centerY: r.y + r.h / 2,
  };
}

function getTitleH(n) {
  if (n.flags?.collapsed) return 0;
  if (n.flags?.no_title) return 0;
  return window.LiteGraph?.NODE_TITLE_HEIGHT || 30;
}

function nodeRect(n) {
  if (n.flags?.collapsed) {
    const th = window.LiteGraph?.NODE_TITLE_HEIGHT || 30;
    const cw = n._collapsed_width || window.LiteGraph?.NODE_COLLAPSED_WIDTH || 80;
    return { x: n.pos[0], y: n.pos[1] - th, w: cw, h: th };
  }
  const titleH = getTitleH(n);
  return { x: n.pos[0], y: n.pos[1] - titleH, w: n.size[0], h: n.size[1] + titleH };
}

// Group geometry — defensive across litegraph versions (Float32Array safe)
function arrLike(v, n) { return v != null && typeof v.length === "number" && v.length >= n; }

function groupRect(g) {
  let x, y, w, h;
  if (arrLike(g?._pos, 2)) { x = g._pos[0]; y = g._pos[1]; }
  else if (arrLike(g?.pos, 2)) { x = g.pos[0]; y = g.pos[1]; }
  else if (arrLike(g?._bounding, 4)) { x = g._bounding[0]; y = g._bounding[1]; }
  else return null;
  if (arrLike(g?._size, 2)) { w = g._size[0]; h = g._size[1]; }
  else if (arrLike(g?.size, 2)) { w = g.size[0]; h = g.size[1]; }
  else if (arrLike(g?._bounding, 4)) { w = g._bounding[2]; h = g._bounding[3]; }
  else return null;
  return { x, y, w, h };
}

function setGroupPos(g, x, y) {
  if (arrLike(g._pos, 2)) { g._pos[0] = x; g._pos[1] = y; }
  if (arrLike(g._bounding, 4)) { g._bounding[0] = x; g._bounding[1] = y; }
  if (!g._pos && arrLike(g.pos, 2)) { g.pos[0] = x; g.pos[1] = y; }
}

function graphGroups(c) {
  return c?.graph?._groups || c?.graph?.groups || [];
}

// Unified alignment targets: every node + every group
function alignTargets(c) {
  const out = [];
  for (const n of (c.graph?._nodes || []))
    out.push({ ref: n, kind: "node", id: n.id, rect: nodeRect(n), collapsed: false });
  for (const g of graphGroups(c)) {
    const r = groupRect(g);
    if (r) out.push({ ref: g, kind: "group", id: g.id, rect: r, collapsed: false });
  }
  return out;
}

// ── Snap math ────────────────────────────────────────────────────────────────

function findClosestSnap(movingValues, targetValues, threshold, stickyTarget, stickyThreshold) {
  let best = null;
  const sT = stickyThreshold == null ? threshold : stickyThreshold;
  for (const m of movingValues) {
    for (const t of targetValues) {
      const d = t - m;
      const allowed = (stickyTarget != null && Math.abs(t - stickyTarget) < 0.01) ? sT : threshold;
      if (Math.abs(d) <= allowed && (!best || Math.abs(d) < Math.abs(best.delta)))
        best = { delta: d, target: t };
    }
  }
  return best;
}

// ── Guide rendering ──────────────────────────────────────────────────────────

function pushGuide(axis, value, perpRange) {
  if (state.activeGuides.length >= 8) return;
  state.activeGuides.push({ axis, value, minPerp: perpRange[0], maxPerp: perpRange[1] });
}

function extendGuideRange(axis, value, baseLo, baseHi, candidates, skipFn) {
  const EPS = 0.5;
  let lo = baseLo, hi = baseHi;
  for (const cand of candidates) {
    if (skipFn(cand.ref)) continue;
    const oE = rectEdges(cand.rect);
    let match = false;
    if (axis === "X")
      match = Math.abs(oE.left - value) < EPS || Math.abs(oE.right - value) < EPS || Math.abs(oE.centerX - value) < EPS;
    else
      match = Math.abs(oE.top - value) < EPS || Math.abs(oE.bottom - value) < EPS || Math.abs(oE.centerY - value) < EPS;
    if (!match) continue;
    if (axis === "X") { lo = Math.min(lo, cand.rect.y); hi = Math.max(hi, cand.rect.y + cand.rect.h); }
    else              { lo = Math.min(lo, cand.rect.x); hi = Math.max(hi, cand.rect.x + cand.rect.w); }
  }
  return [lo, hi];
}

// ── Position application ─────────────────────────────────────────────────────

// Works in both Legacy (direct mutation) and Vue / Nodes 2.0 (array replacement
// in rAF wins over Vue's own cursor-driven write).
function applyNodePos(node, x, y, snapActive) {
  if (!snapActive) return;
  node.pos[0] = x;
  node.pos[1] = y;
  requestAnimationFrame(() => { node.pos = [x, y]; });
}

// ── Group drag ───────────────────────────────────────────────────────────────

function refreshGroupCache(c) {
  if (!state._prevGroupRects) state._prevGroupRects = new Map();
  state._prevGroupRects.clear();
  for (const g of graphGroups(c)) { const r = groupRect(g); if (r) state._prevGroupRects.set(g, r); }
}

function findDraggedGroup(c) {
  const prev = state._prevGroupRects;
  if (!prev) return null;
  for (const g of graphGroups(c)) {
    const r = groupRect(g), p = prev.get(g);
    if (!r || !p) continue;
    const moved = Math.abs(r.x - p.x) > 0.01 || Math.abs(r.y - p.y) > 0.01;
    const resized = Math.abs(r.w - p.w) > 0.01 || Math.abs(r.h - p.h) > 0.01;
    if (moved && !resized) return g;
  }
  return null;
}

function groupContainedNodes(c, g, gRect) {
  if (Array.isArray(g._nodes) && g._nodes.length) return g._nodes.slice();
  const out = [];
  for (const n of (c.graph?._nodes || [])) {
    const r = nodeRect(n);
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    if (cx >= gRect.x && cx <= gRect.x + gRect.w && cy >= gRect.y && cy <= gRect.y + gRect.h)
      out.push(n);
  }
  return out;
}

// The item set a native group drag moves (frontend getAllNestedItems): the
// group's children — nodes, link reroutes, nested groups, recursively — minus
// pinned items. The snap correction must cover the SAME set, otherwise
// reroutes / nested groups drift off the group rect by the snap delta and
// pinned members get yanked on snap ticks only (F2).
function groupDragItems(c, g, gRect) {
  const isPinned = (it) => !!(it?.pinned || it?.flags?.pinned);
  const iterable = (v) => v != null && typeof v[Symbol.iterator] === "function";
  const kids = g?.children;
  if (iterable(kids)) {
    const out = [], seen = new Set();
    const walk = (item) => {
      if (!item || seen.has(item) || isPinned(item)) return;
      seen.add(item);
      out.push(item);
      if (iterable(item.children)) for (const ch of item.children) walk(ch);
    };
    for (const ch of kids) walk(ch);
    if (out.length) return out;
  }
  // Classic litegraph fallback: _nodes / geometric containment as before,
  // plus graph-level reroutes and nested groups geometrically inside the rect
  const out = groupContainedNodes(c, g, gRect).filter((n) => !isPinned(n));
  const inside = (x, y) =>
    x >= gRect.x && x <= gRect.x + gRect.w && y >= gRect.y && y <= gRect.y + gRect.h;
  const rrs = c?.graph?.reroutes;
  if (Array.isArray(rrs))
    for (const r of rrs)
      if (r && !isPinned(r) && arrLike(r.pos, 2) && inside(r.pos[0], r.pos[1])) out.push(r);
  for (const sg of graphGroups(c)) {
    if (sg === g) continue;
    const sr = groupRect(sg);
    // Fully-contained only: a merely OVERLAPPING sibling group (often the very
    // snap target this drag is about to align with) is not a nested child —
    // centre-point tests would swallow it into the member set and kill the snap
    if (sr && !isPinned(sg) &&
        sr.x >= gRect.x && sr.y >= gRect.y &&
        sr.x + sr.w <= gRect.x + gRect.w && sr.y + sr.h <= gRect.y + gRect.h)
      out.push(sg);
  }
  return out;
}

function handleGroupDrag(c, group, e) {
  const scale = c.ds?.scale || 1;
  const snapGraph = state.snapDistPx / scale;
  const gRect = groupRect(group);
  if (!gRect) { state.groupDrag = null; return; }

  // Size change → resize, not move → bail
  if (state.groupDrag && state.groupDrag.ref === group &&
      (Math.abs(gRect.w - state.groupDrag.w) > 0.01 || Math.abs(gRect.h - state.groupDrag.h) > 0.01)) {
    state.groupDrag = null; return;
  }

  // Init session
  if (!state.groupDrag || state.groupDrag.ref !== group) {
    const contained = groupDragItems(c, group, gRect).map((item) => {
      // Origin via groupRect: nested groups carry _pos/_bounding, not plain pos
      const o = groupRect(item) || (arrLike(item?.pos, 2) ? { x: item.pos[0], y: item.pos[1] } : null);
      if (!o) return null;
      return { item, off: [o.x - gRect.x, o.y - gRect.y],
               isGroup: item._pos != null || item._bounding != null };
    }).filter(Boolean);
    state.groupDrag = {
      ref: group, gx0: gRect.x, gy0: gRect.y, w: gRect.w, h: gRect.h,
      cursorX: e.clientX, cursorY: e.clientY,
      contained, containedSet: new Set(contained.map((cn) => cn.item)),
      stickyX: null, stickyY: null,
    };
    return;
  }

  const di = state.groupDrag;
  const desiredX = di.gx0 + (e.clientX - di.cursorX) / scale;
  const desiredY = di.gy0 + (e.clientY - di.cursorY) / scale;
  const movingRect = { x: desiredX, y: desiredY, w: di.w, h: di.h };
  const movingE = rectEdges(movingRect);
  const movingX = [movingE.left, movingE.right, movingE.centerX];
  const movingY = [movingE.top, movingE.bottom, movingE.centerY];

  const stickyG = snapGraph * 1.5;
  const targets = alignTargets(c);
  // Exclude nodes inside other groups (snap frame-to-frame, not to nested nodes)
  const groupedNodes = new Set();
  for (const t of targets) {
    if (t.kind !== "group" || t.ref === group) continue;
    for (const n of groupContainedNodes(c, t.ref, t.rect)) groupedNodes.add(n);
  }

  let bestX = null, bestY = null, bestXRect = null, bestYRect = null;
  for (const t of targets) {
    if (t.ref === group) continue;
    if (di.containedSet.has(t.ref)) continue;   // any dragged member: node, nested group, …
    if (t.kind === "node" && groupedNodes.has(t.ref)) continue;
    const oRect = t.rect;
    const dxc = Math.max(0, Math.max(oRect.x - (movingRect.x + movingRect.w), movingRect.x - (oRect.x + oRect.w)));
    const dyc = Math.max(0, Math.max(oRect.y - (movingRect.y + movingRect.h), movingRect.y - (oRect.y + oRect.h)));
    if (dxc > 2 * stickyG && dyc > 2 * stickyG) continue;
    const oE = rectEdges(oRect);
    const mx = findClosestSnap(movingX, [oE.left, oE.right, oE.centerX], snapGraph, di.stickyX, stickyG);
    if (mx && (!bestX || Math.abs(mx.delta) < Math.abs(bestX.delta))) { bestX = mx; bestXRect = oRect; }
    const my = findClosestSnap(movingY, [oE.top, oE.bottom, oE.centerY], snapGraph, di.stickyY, stickyG);
    if (my && (!bestY || Math.abs(my.delta) < Math.abs(bestY.delta))) { bestY = my; bestYRect = oRect; }
  }
  di.stickyX = bestX ? bestX.target : null;
  di.stickyY = bestY ? bestY.target : null;

  const fx = bestX ? desiredX + bestX.delta : desiredX;
  const fy = bestY ? desiredY + bestY.delta : desiredY;
  const snapActive = !!(bestX || bestY);

  setGroupPos(group, fx, fy);
  for (const cn of di.contained) {
    if (!snapActive) continue;
    const nx = fx + cn.off[0], ny = fy + cn.off[1];
    if (cn.isGroup) {
      setGroupPos(cn.item, nx, ny);
    } else {
      // Element writes + rAF whole-array fallback (frontend view revert) stay
      cn.item.pos[0] = nx;
      cn.item.pos[1] = ny;
      requestAnimationFrame(() => { cn.item.pos = [nx, ny]; });
    }
  }

  // Guides
  const finalRect = { x: fx, y: fy, w: di.w, h: di.h };
  const skip = (ref) => ref === group || di.containedSet.has(ref) || groupedNodes.has(ref);
  state.activeGuides = [];
  if (bestX && bestXRect) {
    const range = extendGuideRange("X", bestX.target,
      Math.min(finalRect.y, bestXRect.y), Math.max(finalRect.y + finalRect.h, bestXRect.y + bestXRect.h),
      targets, skip);
    pushGuide("X", bestX.target, range);
  }
  if (bestY && bestYRect) {
    const range = extendGuideRange("Y", bestY.target,
      Math.min(finalRect.x, bestYRect.x), Math.max(finalRect.x + finalRect.w, bestYRect.x + bestYRect.w),
      targets, skip);
    pushGuide("Y", bestY.target, range);
  }
  c.setDirty?.(true, true);
}

// ── Reset ────────────────────────────────────────────────────────────────────

function resetDrag() {
  state.dragInfo = null;
  state.groupDrag = null;
  if (state.activeGuides.length) {
    state.activeGuides = [];
    app.canvas?.setDirty?.(true, true);
  }
}

// ── Pointer handlers ─────────────────────────────────────────────────────────

// Returns true when the pointer is over any Node Alignment UI element.
// Uses elementFromPoint for accurate hit-testing during active drags,
// because e.target stays frozen at the pointerdown element during a drag.
// While interacting with the panel / floating button / popups, snap alignment
// is bypassed (same effect as holding Shift) to avoid conflicts.
const _HK_UI_SELECTOR =
  '.hk-wrapper, .hk-floating-btn, .hk-quick-color-popup, ' +
  '.hk-align-popup, .hk-float-hint, .hk-align-btn-hint, .hk-dblclose-hint, ' +
  '.hk-sv-picker, .hk-custom-toolbar';
function isOverHKUI(e) {
  // Fast path: check e.target (accurate at pointerdown)
  const t = e.target;
  if (t && typeof t.closest === 'function' && t.closest(_HK_UI_SELECTOR)) return true;
  // During an active drag, e.target is frozen — use elementFromPoint instead
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (el && typeof el.closest === 'function' && el.closest(_HK_UI_SELECTOR)) return true;
  return false;
}

function onWindowPointerDown(e) {
  if (!state.enabled || e.button !== 0) return;
  if (isOverHKUI(e)) return;
  const c = app.canvas;
  if (!c?.graph?._nodes) return;
  // Snapshot node sizes for resize guard (skip malformed nodes — A4).
  // Ref-keyed: with duplicate ids an id-keyed map keeps only the last clone's
  // size and the resize guard misjudges (A2)
  const sizes = new Map();
  for (const n of c.graph._nodes) { if (n && n.pos && n.size) sizes.set(n, [n.size[0], n.size[1]]); }
  state._gestureSizes = sizes;
  // Baseline group rects
  const grects = new Map();
  for (const g of graphGroups(c)) { const r = groupRect(g); if (r) grects.set(g, r); }
  state._prevGroupRects = grects;
}

function onWindowPointerMove(e) {
  try {
  if (!state.enabled) { resetDrag(); return; }
  if (e.shiftKey) { resetDrag(); return; }       // Shift bypasses
  if (!(e.buttons & 1)) { resetDrag(); return; }  // left button only
  // Lower priority when dragging the Node Alignment floating quick button —
  // prevents snap guides and float-btn drag from firing simultaneously.
  if (window.__hkFloatingDrag) { resetDrag(); return; }
  // Node Alignment UI (panel, popups, floating btn, SV picker) always takes
  // highest priority — snap is bypassed whenever the pointer is over it.
  if (isOverHKUI(e)) { resetDrag(); return; }
  const c = app.canvas;
  if (!c) { resetDrag(); return; }
  if (c.dragging_rectangle != null) { resetDrag(); return; }
  if (c.dragging_canvas) { resetDrag(); return; }

  // ── Group drag takes precedence ──
  // If the group this drag session tracked got deleted mid-gesture (Delete /
  // Ctrl+Z), drop the stale session instead of dragging a ghost rect (A9)
  if (state.groupDrag && !graphGroups(c).includes(state.groupDrag.ref)) state.groupDrag = null;
  const draggedGroup = findDraggedGroup(c) || state.groupDrag?.ref || null;
  refreshGroupCache(c);
  if (draggedGroup) {
    handleGroupDrag(c, draggedGroup, e);
    return;
  }

  // ── Node drag ──
  // Detect dragged node: active session → litegraph's actually-dragged node →
  // real position change → selection (A10: selected_nodes[0] is key-order, not
  // the node under the cursor — dragging a pinned selection mate must not
  // ghost-move an innocent selected node)
  let draggedNode = null;
  if (state.dragInfo?.node) {
    // Hold the node REFERENCE, never its id: duplicate ids are real (hand-edited
    // workflows, stale pastes) and find-by-id resolves to whichever clone sits
    // earlier in _nodes — the drag session would be hijacked and the innocent
    // clone ghost-moved (A2)
    const node = state.dragInfo.node;
    const stillSelected = c.graph?._nodes?.includes(node) && c.selected_nodes &&
      Object.values(c.selected_nodes).some((s) => s === node);
    if (stillSelected) draggedNode = node;
    else state.dragInfo = null;
  }
  // Prefer whatever litegraph itself reports as dragged (classic builds)
  if (!draggedNode) {
    const _nd = c.node_dragged || c.dragging_node || null;
    if (_nd && _nd.pos && !_nd.flags?.pinned) draggedNode = _nd;
  }
  // Real position change beats selection guessing: dragging a pinned node
  // moves nothing at all, and the moved node may not be selected_nodes[0]
  // (Keyed by node ref — with duplicate ids an id-keyed cache would keep only
  // the last clone's state and misattribute the move, A2)
  if (!draggedNode && state._prevNodeStates && c.graph?._nodes) {
    for (const n of c.graph._nodes) {
      const p = state._prevNodeStates.get(n);
      if (p && (p.x !== n.pos[0] || p.y !== n.pos[1] || p.w !== n.size[0] || p.h !== n.size[1])) {
        draggedNode = n; break;
      }
    }
  }
  if (!draggedNode) {
    const sel = c.selected_nodes;
    const keys = sel ? Object.keys(sel) : [];
    if (keys.length >= 1) draggedNode = sel[keys[0]];
    // B6: reaching this fallback means litegraph reported no dragged node AND
    // nothing actually moved. If the selection also contains a pinned node,
    // the user is most likely grabbing that pinned node (nothing can move) —
    // never ghost-drag the smallest-id ordinary node instead.
    if (draggedNode && !draggedNode.flags?.pinned) {
      const _selVals = sel ? Object.values(sel) : [];
      if (_selVals.some((s) => s && s.flags?.pinned)) { resetDrag(); return; }
    }
  }

  // Refresh node cache for next tick (ref-keyed, see A2 note above)
  if (c.graph?._nodes) {
    if (!state._prevNodeStates) state._prevNodeStates = new Map();
    state._prevNodeStates.clear();
    for (const n of c.graph._nodes)
      state._prevNodeStates.set(n, { x: n.pos[0], y: n.pos[1], w: n.size[0], h: n.size[1] });
  }

  if (!draggedNode) {
    if (state.activeGuides.length) { state.activeGuides = []; c.setDirty?.(true, true); }
    return;
  }
  if (draggedNode.flags?.pinned) { resetDrag(); return; }

  // Resize guard: pointerdown snapshotted node sizes (_gestureSizes). If the
  // node's size changed since then this gesture is a resize, not a move —
  // the desired position below would be a ghost rect drifting away from the
  // real node, so bail (same guard the group path applies in handleGroupDrag).
  const _gSize = state._gestureSizes && draggedNode.size ? state._gestureSizes.get(draggedNode) : null;
  if (_gSize && (Math.abs(_gSize[0] - draggedNode.size[0]) > 0.01 || Math.abs(_gSize[1] - draggedNode.size[1]) > 0.01)) {
    resetDrag();
    return;
  }

  // Multi-select detection
  let multiNodes = null;
  {
    const sel = c.selected_nodes;
    if (sel) {
      const selVals = Object.values(sel);
      if (selVals.length > 1 && selVals.includes(draggedNode)) {
        const live = selVals.filter((n) => n && !(n.flags?.pinned));
        if (live.length > 1) multiNodes = live;
      }
    }
  }

  const scale = c.ds?.scale || 1;
  const snapGraph = state.snapDistPx / scale;

  // ── Multi-select drag ──
  if (multiNodes) {
    const sessionMatches = state.dragInfo?.multiSelect && state.dragInfo.origNodes?.has(draggedNode);
    if (!sessionMatches) {
      const origPositions = new Map();
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const n of multiNodes) {
        origPositions.set(n, { x: n.pos[0], y: n.pos[1] });
        const r = nodeRect(n);
        minX = Math.min(minX, r.x); minY = Math.min(minY, r.y);
        maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h);
      }
      state.dragInfo = {
        node: draggedNode, cursorX: e.clientX, cursorY: e.clientY,
        multiSelect: true, origPositions,
        origBBox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
        origNodes: new Set(multiNodes),   // node refs, not ids (A2)
        stickyMoveX: null, stickyMoveY: null,
      };
      return;
    }
    const di = state.dragInfo;
    const dxGraph = (e.clientX - di.cursorX) / scale;
    const dyGraph = (e.clientY - di.cursorY) / scale;
    const movingRect = { x: di.origBBox.x + dxGraph, y: di.origBBox.y + dyGraph, w: di.origBBox.w, h: di.origBBox.h };
    const movingE = rectEdges(movingRect);
    const movingX = [movingE.left, movingE.right, movingE.centerX];
    const movingY = [movingE.top, movingE.bottom, movingE.centerY];
    const stickyG = snapGraph * 1.5;
    const targets = alignTargets(c);
    let bestX = null, bestY = null, bestXRect = null, bestYRect = null;
    for (const tg of targets) {
      if (di.origNodes.has(tg.ref)) continue;
      const oRect = tg.rect;
      const dxc = Math.max(0, Math.max(oRect.x - (movingRect.x + movingRect.w), movingRect.x - (oRect.x + oRect.w)));
      const dyc = Math.max(0, Math.max(oRect.y - (movingRect.y + movingRect.h), movingRect.y - (oRect.y + oRect.h)));
      if (dxc > 2 * stickyG && dyc > 2 * stickyG) continue;
      const oE = rectEdges(oRect);
      const mx = findClosestSnap(movingX, [oE.left, oE.right, oE.centerX], snapGraph, di.stickyMoveX, stickyG);
      if (mx && (!bestX || Math.abs(mx.delta) < Math.abs(bestX.delta))) { bestX = mx; bestXRect = oRect; }
      const my = findClosestSnap(movingY, [oE.top, oE.bottom, oE.centerY], snapGraph, di.stickyMoveY, stickyG);
      if (my && (!bestY || Math.abs(my.delta) < Math.abs(bestY.delta))) { bestY = my; bestYRect = oRect; }
    }
    di.stickyMoveX = bestX ? bestX.target : null;
    di.stickyMoveY = bestY ? bestY.target : null;
    const finalDx = dxGraph + (bestX ? bestX.delta : 0);
    const finalDy = dyGraph + (bestY ? bestY.delta : 0);
    const snapActive = !!(bestX || bestY);
    for (const n of di.origNodes) {
      const orig = di.origPositions.get(n);
      if (orig) applyNodePos(n, orig.x + finalDx, orig.y + finalDy, snapActive);
    }
    const finalBBox = { x: di.origBBox.x + finalDx, y: di.origBBox.y + finalDy, w: di.origBBox.w, h: di.origBBox.h };
    state.activeGuides = [];
    if (bestX && bestXRect) {
      const range = extendGuideRange("X", bestX.target,
        Math.min(finalBBox.y, bestXRect.y), Math.max(finalBBox.y + finalBBox.h, bestXRect.y + bestXRect.h),
        targets, (ref) => ref && di.origNodes.has(ref));
      pushGuide("X", bestX.target, range);
    }
    if (bestY && bestYRect) {
      const range = extendGuideRange("Y", bestY.target,
        Math.min(finalBBox.x, bestYRect.x), Math.max(finalBBox.x + finalBBox.w, bestYRect.x + bestYRect.w),
        targets, (ref) => ref && di.origNodes.has(ref));
      pushGuide("Y", bestY.target, range);
    }
    c.setDirty?.(true, true);
    return;
  }

  // ── Single-node drag ──
  // Initialise a fresh session if none exists, or the existing one is
  // multi-select / belongs to a different node (ref compare — A2).
  if (!state.dragInfo || state.dragInfo.multiSelect || state.dragInfo.node !== draggedNode) {
    state.dragInfo = {
      node: draggedNode,
      posX: draggedNode.pos[0], posY: draggedNode.pos[1],
      cursorX: e.clientX, cursorY: e.clientY,
      multiSelect: false,
      stickyMoveX: null, stickyMoveY: null,
    };
    return; // baseline tick — no correction so the node never jumps on grab
  }

  const di = state.dragInfo;
  const desiredX = di.posX + (e.clientX - di.cursorX) / scale;
  const desiredY = di.posY + (e.clientY - di.cursorY) / scale;

  const collapsed = !!draggedNode.flags?.collapsed;
  const TH = window.LiteGraph?.NODE_TITLE_HEIGHT || 30;
  const titleH = collapsed ? TH : getTitleH(draggedNode);
  const w = collapsed ? (draggedNode._collapsed_width || window.LiteGraph?.NODE_COLLAPSED_WIDTH || 80) : draggedNode.size[0];
  const h = collapsed ? 0 : draggedNode.size[1];
  const movingRect = { x: desiredX, y: desiredY - titleH, w, h: h + titleH };
  const movingE = rectEdges(movingRect);
  const movingX = [movingE.left, movingE.right, movingE.centerX];
  const movingY = [movingE.top, movingE.bottom, movingE.centerY];

  const stickyG = snapGraph * 1.5;
  const targets = alignTargets(c);
  let bestX = null, bestY = null, bestXRect = null, bestYRect = null;
  for (const t of targets) {
    if (t.ref === draggedNode) continue;
    const oRect = t.rect;
    const dxc = Math.max(0, Math.max(oRect.x - (movingRect.x + movingRect.w), movingRect.x - (oRect.x + oRect.w)));
    const dyc = Math.max(0, Math.max(oRect.y - (movingRect.y + movingRect.h), movingRect.y - (oRect.y + oRect.h)));
    if (dxc > 2 * stickyG && dyc > 2 * stickyG) continue;
    const oE = rectEdges(oRect);
    const mx = findClosestSnap(movingX, [oE.left, oE.right, oE.centerX], snapGraph, di.stickyMoveX, stickyG);
    if (mx && (!bestX || Math.abs(mx.delta) < Math.abs(bestX.delta))) { bestX = mx; bestXRect = oRect; }
    const my = findClosestSnap(movingY, [oE.top, oE.bottom, oE.centerY], snapGraph, di.stickyMoveY, stickyG);
    if (my && (!bestY || Math.abs(my.delta) < Math.abs(bestY.delta))) { bestY = my; bestYRect = oRect; }
  }
  di.stickyMoveX = bestX ? bestX.target : null;
  di.stickyMoveY = bestY ? bestY.target : null;

  const fx = bestX ? desiredX + bestX.delta : desiredX;
  const fy = bestY ? desiredY + bestY.delta : desiredY;
  applyNodePos(draggedNode, fx, fy, !!(bestX || bestY));

  const finalRect = { x: fx, y: fy - titleH, w, h: h + titleH };
  state.activeGuides = [];
  if (bestX && bestXRect) {
    const range = extendGuideRange("X", bestX.target,
      Math.min(finalRect.y, bestXRect.y), Math.max(finalRect.y + finalRect.h, bestXRect.y + bestXRect.h),
      targets, (ref) => ref === draggedNode);
    pushGuide("X", bestX.target, range);
  }
  if (bestY && bestYRect) {
    const range = extendGuideRange("Y", bestY.target,
      Math.min(finalRect.x, bestYRect.x), Math.max(finalRect.x + finalRect.w, bestYRect.x + bestYRect.w),
      targets, (ref) => ref === draggedNode);
    pushGuide("Y", bestY.target, range);
  }
  c.setDirty?.(true, true);
  } catch (err) {
    // One malformed node (missing pos/size while loading, buggy plugin, …)
    // must not kill the whole drag-snap loop or spam one exception per
    // mousemove — abort this gesture and skip the tick (A4)
    resetDrag();
  }
}

// ── Draw hook ────────────────────────────────────────────────────────────────

let _drawHookInstalled = false;

function installDrawHook() {
  if (_drawHookInstalled) return;
  const proto = window.LGraphCanvas?.prototype;
  if (typeof proto?.drawFrontCanvas !== "function") {
    console.warn("[Node Alignment.Snap] LGraphCanvas.drawFrontCanvas not found — guides will not render");
    return;
  }
  const orig = proto.drawFrontCanvas;
  proto.drawFrontCanvas = function () {
    const ret = orig.apply(this, arguments);
    if (state.activeGuides.length === 0) return ret;
    const ctx = this.ctx;
    if (!ctx) return ret;
    const scale = this.ds?.scale || 1;
    const offset = this.ds?.offset || [0, 0];
    const overhang = 16;
    const toScreenX = (gx) => (gx + offset[0]) * scale;
    const toScreenY = (gy) => (gy + offset[1]) * scale;
    ctx.save();
    ctx.strokeStyle = BRAND;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const g of state.activeGuides.slice(0, 8)) {
      if (g.axis === "X") {
        const x = toScreenX(g.value);
        ctx.moveTo(x, toScreenY(g.minPerp - overhang));
        ctx.lineTo(x, toScreenY(g.maxPerp + overhang));
      } else {
        const y = toScreenY(g.value);
        ctx.moveTo(toScreenX(g.minPerp - overhang), y);
        ctx.lineTo(toScreenX(g.maxPerp + overhang), y);
      }
    }
    ctx.stroke();
    ctx.restore();
    return ret;
  };
  _drawHookInstalled = true;
}

// ── Toolbar button ───────────────────────────────────────────────────────────

function injectToolbarCSS() {
  if (document.getElementById("hk-snap-css")) return;
  const style = document.createElement("style");
  style.id = "hk-snap-css";
  style.textContent = `
    .hk-snap-btn .hk-snap-icon { display:inline-block; width:18px; height:18px; }
    .hk-snap-btn .hk-snap-icon svg { width:18px; height:18px; }
    .hk-snap-btn:not(.hk-snap-on) { opacity:0.55; }
    .hk-snap-btn:not(.hk-snap-on):hover { opacity:0.8; }
    .hk-snap-btn.hk-snap-on { color:${BRAND} !important; }
    .hk-snap-btn.hk-snap-on:hover { filter:brightness(1.15); }
  `;
  document.head.appendChild(style);
}

function updateToolbarTint() {
  if (state.toolbarBtn) state.toolbarBtn.classList.toggle("hk-snap-on", state.enabled);
  // Notify panel snap-toggle buttons
  state._panelCallbacks.forEach((cb) => { try { cb(); } catch (e) {} });
}

// ── Public API for panel integration ─────────────────────────────────────────
window.HkSnap = {
  toggle: toggleEnabled,
  isEnabled: () => state.enabled,
  onStateChange: (cb) => { if (typeof cb === "function") state._panelCallbacks.push(cb); },
  getSnapDist: () => state.snapDistPx,
  setSnapDist: (v) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 4 || n > 16) return;
    state.snapDistPx = n;
    const s = app.ui?.settings;
    if (s) s.setSettingValue(SETTING_SNAP_DIST, n);
  },
};

function mountToolbarButton() {
  if (state.toolbarBtn?.isConnected) return;
  // Try Vue frontend floating toolbar first
  const settingsGroupEl = app.menu?.settingsGroup?.element;
  if (!settingsGroupEl) {
    if (mountToolbarButton._tries == null) mountToolbarButton._tries = 0;
    if (++mountToolbarButton._tries > 40) return; // give up silently after ~10s
    setTimeout(mountToolbarButton, 250);
    return;
  }
  injectToolbarCSS();
  const btn = document.createElement("button");
  btn.className = "comfyui-button hk-snap-btn";
  const btnTitle = () => snapLang() === "zh"
    ? "节点对齐拖拽吸附开关（Alt+S，按住 Shift 可临时绕过）"
    : "Toggle Node Alignment drag snap (Alt+S, hold Shift to bypass)";
  btn.title = btnTitle();
  // Tooltip text is captured at mount; refresh lazily so a language toggle
  // in the Node Alignment panel (persisted to "hk-lang") is picked up
  // without a page reload.
  btn.addEventListener("mouseenter", () => { btn.title = btnTitle(); });
  btn.innerHTML = `<span class="hk-snap-icon">${ICON_SVG}</span>`;
  btn.addEventListener("click", toggleEnabled);
  const group = document.createElement("div");
  group.className = "comfyui-button-group";
  group.appendChild(btn);
  settingsGroupEl.before(group);
  state.toolbarBtn = btn;
  updateToolbarTint();
}

function toggleEnabled() {
  const s = app.ui?.settings;
  if (!s) {
    // Fallback: toggle state directly + localStorage
    state.enabled = !state.enabled;
    try { localStorage.setItem("hk-snap-enabled", String(state.enabled)); } catch {}
    updateToolbarTint();
    return;
  }
  const next = !s.getSettingValue(SETTING_ENABLED);
  s.setSettingValue(SETTING_ENABLED, next);
  state.enabled = next;
  updateToolbarTint();
}
// forward declaration so window.HkSnap above sees the real function

// ── Keyboard shortcut: Alt+S ─────────────────────────────────────────────────

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (e.key === "s" || e.key === "S")) {
    const el = e.target;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
    e.preventDefault();
    toggleEnabled();
  }
});

// ── Register extension ───────────────────────────────────────────────────────

app.registerExtension({
  name: "hk.snap",
  settings: [
    {
      id: SETTING_ENABLED,
      type: "hidden",
      defaultValue: false,
      onChange: (v) => {
        state.enabled = !!v;
        updateToolbarTint();
      },
    },
    {
      id: SETTING_SNAP_DIST,
      type: "hidden",
      defaultValue: 8,
      onChange: (v) => {
        const n = Number(v);
        if (Number.isFinite(n) && n >= 4 && n <= 16) state.snapDistPx = n;
      },
    },
  ],
  setup() {
    // Read current settings (onChange only fires on subsequent changes)
    const s = app.ui?.settings;
    if (s) {
      state.enabled = !!s.getSettingValue(SETTING_ENABLED);
      const d = Number(s.getSettingValue(SETTING_SNAP_DIST));
      if (Number.isFinite(d) && d >= 4 && d <= 16) state.snapDistPx = d;
    } else {
      // Fallback: localStorage
      try { state.enabled = localStorage.getItem("hk-snap-enabled") === "true"; } catch {}
    }
    // Install hooks
    window.addEventListener("pointermove", onWindowPointerMove, false);
    window.addEventListener("pointerdown", onWindowPointerDown, true);
    window.addEventListener("pointerup", resetDrag, false);
    window.addEventListener("pointercancel", resetDrag, false);
    installDrawHook();
    mountToolbarButton();
  },
});
