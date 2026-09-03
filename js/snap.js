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
    const contained = groupContainedNodes(c, group, gRect).map((n) => ({
      node: n, off: [n.pos[0] - gRect.x, n.pos[1] - gRect.y],
    }));
    state.groupDrag = {
      ref: group, gx0: gRect.x, gy0: gRect.y, w: gRect.w, h: gRect.h,
      cursorX: e.clientX, cursorY: e.clientY,
      contained, containedSet: new Set(contained.map((cn) => cn.node)),
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
    if (t.kind === "node" && di.containedSet.has(t.ref)) continue;
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
    if (snapActive) {
      cn.node.pos[0] = fx + cn.off[0];
      cn.node.pos[1] = fy + cn.off[1];
      requestAnimationFrame(() => { cn.node.pos = [fx + cn.off[0], fy + cn.off[1]]; });
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
  // Snapshot node sizes for resize guard
  const sizes = new Map();
  for (const n of c.graph._nodes) sizes.set(n.id, [n.size[0], n.size[1]]);
  state._gestureSizes = sizes;
  // Baseline group rects
  const grects = new Map();
  for (const g of graphGroups(c)) { const r = groupRect(g); if (r) grects.set(g, r); }
  state._prevGroupRects = grects;
}

function onWindowPointerMove(e) {
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
  const draggedGroup = findDraggedGroup(c) || state.groupDrag?.ref || null;
  refreshGroupCache(c);
  if (draggedGroup) {
    handleGroupDrag(c, draggedGroup, e);
    return;
  }

  // ── Node drag ──
  // Detect dragged node by position change (legacy) or by selection (Vue)
  let draggedNode = null;
  if (state.dragInfo?.nodeId != null) {
    const id = state.dragInfo.nodeId;
    const node = c.graph?._nodes?.find((n) => n.id === id) || null;
    const stillSelected = node && c.selected_nodes &&
      Object.values(c.selected_nodes).some((s) => s && s.id === id);
    if (stillSelected) draggedNode = node;
    else state.dragInfo = null;
  }
  if (!draggedNode) {
    const sel = c.selected_nodes;
    const keys = sel ? Object.keys(sel) : [];
    if (keys.length >= 1) draggedNode = sel[keys[0]];
  }
  // Legacy change-detection fallback
  if (!draggedNode && state._prevNodeStates && c.graph?._nodes) {
    for (const n of c.graph._nodes) {
      const p = state._prevNodeStates.get(n.id);
      if (p && (p.x !== n.pos[0] || p.y !== n.pos[1] || p.w !== n.size[0] || p.h !== n.size[1])) {
        draggedNode = n; break;
      }
    }
  }

  // Refresh node cache for next tick
  if (c.graph?._nodes) {
    if (!state._prevNodeStates) state._prevNodeStates = new Map();
    state._prevNodeStates.clear();
    for (const n of c.graph._nodes)
      state._prevNodeStates.set(n.id, { x: n.pos[0], y: n.pos[1], w: n.size[0], h: n.size[1] });
  }

  if (!draggedNode) {
    if (state.activeGuides.length) { state.activeGuides = []; c.setDirty?.(true, true); }
    return;
  }
  if (draggedNode.flags?.pinned) { resetDrag(); return; }

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
    const sessionMatches = state.dragInfo?.multiSelect && state.dragInfo.origIds?.has(draggedNode.id);
    if (!sessionMatches) {
      const origPositions = new Map();
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const n of multiNodes) {
        origPositions.set(n.id, { x: n.pos[0], y: n.pos[1] });
        const r = nodeRect(n);
        minX = Math.min(minX, r.x); minY = Math.min(minY, r.y);
        maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h);
      }
      state.dragInfo = {
        nodeId: draggedNode.id, cursorX: e.clientX, cursorY: e.clientY,
        multiSelect: true, origPositions,
        origBBox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
        origIds: new Set(multiNodes.map((n) => n.id)),
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
      if (tg.kind === "node" && di.origIds.has(tg.id)) continue;
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
    for (const n of (c.graph?._nodes || [])) {
      if (!di.origIds.has(n.id)) continue;
      const orig = di.origPositions.get(n.id);
      if (orig) applyNodePos(n, orig.x + finalDx, orig.y + finalDy, snapActive);
    }
    const finalBBox = { x: di.origBBox.x + finalDx, y: di.origBBox.y + finalDy, w: di.origBBox.w, h: di.origBBox.h };
    state.activeGuides = [];
    if (bestX && bestXRect) {
      const range = extendGuideRange("X", bestX.target,
        Math.min(finalBBox.y, bestXRect.y), Math.max(finalBBox.y + finalBBox.h, bestXRect.y + bestXRect.h),
        targets, (ref) => ref && di.origIds.has(ref.id));
      pushGuide("X", bestX.target, range);
    }
    if (bestY && bestYRect) {
      const range = extendGuideRange("Y", bestY.target,
        Math.min(finalBBox.x, bestYRect.x), Math.max(finalBBox.x + finalBBox.w, bestYRect.x + bestYRect.w),
        targets, (ref) => ref && di.origIds.has(ref.id));
      pushGuide("Y", bestY.target, range);
    }
    c.setDirty?.(true, true);
    return;
  }

  // ── Single-node drag ──
  // Initialise a fresh session if none exists, or the existing one is
  // multi-select / belongs to a different node.
  if (!state.dragInfo || state.dragInfo.multiSelect || state.dragInfo.nodeId !== draggedNode.id) {
    state.dragInfo = {
      nodeId: draggedNode.id,
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
  btn.title = "Toggle Node Alignment drag snap (Alt+S, hold Shift to bypass)";
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
