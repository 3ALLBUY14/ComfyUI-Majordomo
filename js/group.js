// =============================================================================
// Node Alignment Quick Groups — Native LGraphGroup wrapper
//
// Follows the rgthree approach: use native LiteGraph groups as-is, with the
// native resizeTo() method to correctly position bounds around selected nodes.
// No custom rendering — the native drawGroups handles everything.
//
// Phase 1 (current): Quick group creation from floating button's align popup
// Phase 2 (future):  Group drag sync, resize handle, fold/mute/bypass, custom rendering
//
// -----------------------------------------------------------------------------
// Group Font Size Patch (v3.3)
//
// Since ComfyUI frontend v20.3, LGraphGroup.draw() uses hardcoded constants
// (GROUP_TEXT_SIZE=20, NODE_TITLE_HEIGHT=30) instead of this.font_size, making
// the right-click "Font size" menu option ineffective. This patch restores the
// pre-v20.3 behavior so font_size controls title text size and title bar height.
// Also patches configure()/serialize() to persist font_size in workflow data.
// On older kernels the patch is a transparent no-op (equivalent code).
// =============================================================================

// ── Constants ────────────────────────────────────────────────────────────────

const PAD           = 10;    // padding around nodes (matches LiteGraph default)
const DEFAULT_COLOR = "#3f789e";

// ── Group creation ───────────────────────────────────────────────────────────

/**
 * Create a native LGraphGroup that wraps all currently-selected nodes.
 *
 * Uses the native resizeTo() method (same as ComfyUI's right-click → "Add Group"
 * and rgthree's approach) to correctly position the group so the title bar
 * sits above the node title bars without overlapping.
 *
 * @returns {object|null} The created LGraphGroup, or null on failure.
 */
function createGroupFromSelection() {
  const graph = window.app && window.app.graph;
  if (!graph) return null;

  const selectedNodes = Object.values(graph._nodes || {}).filter(
    (n) => n && n.is_selected
  );
  if (selectedNodes.length === 0) return null;

  const LGraphGroup = window.LiteGraph && window.LiteGraph.LGraphGroup;
  if (!LGraphGroup) {
    console.warn("[Node Alignment] LGraphGroup not found");
    return null;
  }

  const group = new LGraphGroup();

  // Auto-generate title: "Group N"
  const existingCount = Array.isArray(graph._groups) ? graph._groups.length : 0;
  group.title = "Group " + (existingCount + 1);

  // Default color
  group.color = DEFAULT_COLOR;

  // Add to graph first
  graph.add(group);

  // Use native resizeTo() to correctly position the group around selected nodes.
  // This is the same method ComfyUI uses internally and what rgthree relies on.
  // It calculates bounds from node.boundingRect (which includes title bars),
  // then shifts the group up by titleHeight so the group title sits above nodes.
  if (typeof group.resizeTo === "function") {
    group.resizeTo(selectedNodes, PAD);
  } else {
    // Fallback for older LiteGraph versions without resizeTo
    _manualResizeTo(group, selectedNodes, PAD);
  }

  // Mark as HK-enhanced (for Phase 2)
  group._hkExtra = {
    titleColor: null,
    bodyColor: null,
    titleAlpha: 0.92,
    bodyAlpha: 0.12,
    fontSize: 14,
    linkColors: true,
  };

  // Trigger canvas redraw
  const canvas =
    (window.LGraphCanvas && window.LGraphCanvas.active_canvas) ||
    (window.app && window.app.canvas);
  if (canvas && typeof canvas.setDirty === "function") {
    canvas.setDirty(true, true);
  }

  return group;
}

// ── Fallback bounds calculation ──────────────────────────────────────────────

/**
 * Manually calculate and set group bounds, replicating the native resizeTo()
 * logic for older LiteGraph versions that don't have it.
 *
 * Native resizeTo does:
 *   pos[1] = bounds[1] - titleHeight   (shift up so title bar is above nodes)
 *   size[1] = bounds[3] + titleHeight   (compensate height)
 *
 * Where bounds[1] is the top of node title bars (node.boundingRect includes
 * the title bar, so pos[1] - NODE_TITLE_HEIGHT).
 */
function _manualResizeTo(group, nodes, padding) {
  const nodeTitleH = (window.LiteGraph && window.LiteGraph.NODE_TITLE_HEIGHT) || 30;
  const fontSize = group.font_size || (window.LiteGraph && window.LiteGraph.DEFAULT_GROUP_FONT) || 24;
  const titleH = fontSize * 1.4;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    // Node bounding rect: title bar starts ABOVE pos[1]
    const nx = n.pos[0];
    const ny = n.pos[1] - nodeTitleH;
    const nw = (n.size && n.size[0]) || n.width || 150;
    const nh = ((n.size && n.size[1]) || n.height || 100) + nodeTitleH;
    if (nx < minX) minX = nx;
    if (ny < minY) minY = ny;
    if (nx + nw > maxX) maxX = nx + nw;
    if (ny + nh > maxY) maxY = ny + nh;
  }
  if (minX === Infinity) return;

  // Apply the same formula as native resizeTo:
  // pos = (minX - pad, minY - pad - titleH)
  // size = ((maxX - minX) + 2*pad, (maxY - minY) + 2*pad + titleH)
  const gx = minX - padding;
  const gy = (minY - padding) - titleH;
  const gw = (maxX - minX) + padding * 2;
  const gh = (maxY - minY) + padding * 2 + titleH;

  // Set position
  if (group._pos && group._pos.length >= 2) {
    group._pos[0] = gx;
    group._pos[1] = gy;
  } else if (group.pos) {
    group.pos[0] = gx;
    group.pos[1] = gy;
  }

  // Set size
  const minWidth = (window.LiteGraph && window.LiteGraph.LGraphGroup && window.LiteGraph.LGraphGroup.minWidth) || 140;
  const minHeight = (window.LiteGraph && window.LiteGraph.LGraphGroup && window.LiteGraph.LGraphGroup.minHeight) || 80;
  if (group._size && group._size.length >= 2) {
    group._size[0] = Math.max(minWidth, gw);
    group._size[1] = Math.max(minHeight, gh);
  } else if (group.size) {
    group.size[0] = Math.max(minWidth, gw);
    group.size[1] = Math.max(minHeight, gh);
  }

  // Also update _bounding if it exists (some versions use a single array)
  if (group._bounding && group._bounding.length >= 4) {
    group._bounding[0] = gx;
    group._bounding[1] = gy;
    group._bounding[2] = Math.max(minWidth, gw);
    group._bounding[3] = Math.max(minHeight, gh);
  }
}

// ── Group Font Size Patch ────────────────────────────────────────────────────

/**
 * Patch LGraphGroup to restore font_size support on ComfyUI frontend v20.3+.
 *
 * Since v20.3, the LGraphGroup.draw() method uses hardcoded constants
 * (GROUP_TEXT_SIZE=20, NODE_TITLE_HEIGHT=30) instead of this.font_size,
 * making the right-click "Font size" menu option ineffective.
 *
 * This patch restores the pre-v20.3 behavior:
 *   - draw()         uses this.font_size for both font and title bar height
 *   - titleHeight    returns font_size * 1.4 (proportional, not fixed 30)
 *   - configure()    restores font_size from serialized workflow data
 *   - serialize()    saves font_size to workflow data
 *
 * On older kernels where draw() already uses this.font_size, this patch
 * is transparent — it replaces with equivalent code.
 */
function patchGroupFont() {
  const LG = window.LiteGraph;
  if (!LG || !LG.LGraphGroup) {
    // LiteGraph not ready yet — retry shortly
    setTimeout(patchGroupFont, 200);
    return;
  }

  const proto = LG.LGraphGroup.prototype;
  if (proto._hkGroupFontPatched) return;
  proto._hkGroupFontPatched = true;

  // Constants (with fallbacks for older kernels)
  const GROUP_TEXT_SIZE  = LG.GROUP_TEXT_SIZE || LG.DEFAULT_GROUP_FONT_SIZE || 24;
  const GROUP_FONT       = LG.GROUP_FONT || 'Arial';
  const PAD              = (LG.LGraphGroup.padding != null) ? LG.LGraphGroup.padding : 4;
  const RESIZE_LEN       = (LG.LGraphGroup.resizeLength != null) ? LG.LGraphGroup.resizeLength : 10;
  const DEFAULT_COLOUR   = LG.LGraphGroup.defaultColour || '#335';
  const BOX_OUTLINE_CLR  = LG.NODE_BOX_OUTLINE_COLOR || '#FFF';

  // ── Patch titleHeight getter ──────────────────────────────────────────
  // New kernel (v20.3+): returns fixed NODE_TITLE_HEIGHT (30)
  // Old kernel: returns this.font_size * 1.4
  // We restore the proportional behavior so the title bar grows with font size
  try {
    Object.defineProperty(proto, 'titleHeight', {
      get() { return (this.font_size || GROUP_TEXT_SIZE) * 1.4; },
      configurable: true,
    });
  } catch (e) {
    console.warn('[Node Alignment] Failed to patch LGraphGroup.titleHeight:', e);
  }

  // ── Patch draw() ──────────────────────────────────────────────────────
  // Replaces the entire draw method to use this.font_size for rendering.
  // Replicates the pre-v20.3 logic: font size controls both text and title
  // bar height (font_size * 1.4).
  proto.draw = function (canvas, ctx) {
    const fontSize = this.font_size || GROUP_TEXT_SIZE;
    const titleH   = fontSize * 1.4;

    // Position & size (handle both Float32Array and regular array)
    const pos  = this._pos  || this.pos;
    const size = this._size || this.size;
    if (!pos || !size) return;
    const x = pos[0], y = pos[1], w = size[0], h = size[1];
    const color = this.color || DEFAULT_COLOUR;

    // --- Title bar background (semi-transparent) ---
    ctx.globalAlpha = 0.25 * canvas.editor_alpha;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x + 0.5, y + 0.5, w, titleH);
    ctx.fill();

    // --- Full group background ---
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x + 0.5, y + 0.5, w, h);
    ctx.fill();

    // --- Border ---
    ctx.globalAlpha = canvas.editor_alpha;
    ctx.stroke();

    // --- Resize corner triangle ---
    ctx.beginPath();
    ctx.moveTo(x + w, y + h);
    ctx.lineTo(x + w - RESIZE_LEN, y + h);
    ctx.lineTo(x + w, y + h - RESIZE_LEN);
    ctx.fill();

    // --- Title text ---
    ctx.font = `${fontSize}px ${GROUP_FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = color;   // title text uses same color as group
    ctx.fillText(this.title + (this.pinned ? '📌' : ''), x + PAD, y + fontSize);

    // --- Highlight selected group (replicates native strokeShape for BOX) ---
    if (LG.highlight_selected_group && this.selected) {
      const prevLineWidth  = ctx.lineWidth;
      const prevStroke     = ctx.strokeStyle;
      const prevAlpha      = ctx.globalAlpha;
      ctx.lineWidth   = 1;
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = BOX_OUTLINE_CLR;
      ctx.beginPath();
      ctx.rect(x - PAD, y - PAD, w + 2 * PAD, h + 2 * PAD);
      ctx.stroke();
      ctx.lineWidth   = prevLineWidth;
      ctx.strokeStyle = prevStroke;
      ctx.globalAlpha = prevAlpha;
    }
  };

  // ── Patch configure() to restore font_size ────────────────────────────
  const _origConfigure = proto.configure;
  if (typeof _origConfigure === 'function') {
    proto.configure = function (data) {
      _origConfigure.call(this, data);
      if (data && data.font_size != null) {
        this.font_size = data.font_size;
      }
    };
  }

  // ── Patch serialize() to save font_size ───────────────────────────────
  const _origSerialize = proto.serialize;
  if (typeof _origSerialize === 'function') {
    proto.serialize = function () {
      const result = _origSerialize.call(this);
      if (this.font_size != null) {
        result.font_size = this.font_size;
      }
      return result;
    };
  }
}

// Apply the patch as soon as the module loads
patchGroupFont();

// ── Group font size helper ──────────────────────────────────────────────────

/**
 * Set font_size on selected groups (or all groups if none selected).
 * Priority: directly selected groups > groups containing selected nodes > all groups.
 * Triggers a canvas redraw so the change is immediately visible.
 * @param {number} size  Font size in pixels (clamped to 8–300)
 */
function setGroupFontSize(size) {
  const n = Math.max(8, Math.min(300, Math.round(size)));
  const graph = window.app && window.app.graph;
  if (!graph || !Array.isArray(graph._groups)) return;

  // Priority 1: groups directly selected (user clicked on group title)
  let targets = graph._groups.filter((g) => g && g.selected);

  if (targets.length === 0) {
    // Priority 2: groups containing selected nodes
    const selNodes = Object.values(graph._nodes || {}).filter((nd) => nd && nd.is_selected);
    const selGroupIds = new Set(selNodes.map((nd) => nd.group && nd.group.id).filter(Boolean));
    if (selGroupIds.size > 0) {
      targets = graph._groups.filter((g) => selGroupIds.has(g.id));
    }
  }

  if (targets.length === 0) {
    // Priority 3: all groups (fallback)
    targets = graph._groups;
  }

  targets.forEach((g) => {
    g.font_size = n;
  });

  // Trigger redraw
  const c = (window.LGraphCanvas && window.LGraphCanvas.active_canvas) || (window.app && window.app.canvas);
  if (c && c.setDirty) c.setDirty(true, true);
}

/**
 * Get the font_size of the first selected group, or the first group, or default.
 * Priority: directly selected groups > groups containing selected nodes > first group.
 * @returns {number}
 */
function getGroupFontSize() {
  const graph = window.app && window.app.graph;
  if (!graph || !Array.isArray(graph._groups) || graph._groups.length === 0) {
    return (window.LiteGraph && window.LiteGraph.DEFAULT_GROUP_FONT_SIZE) || 20;
  }
  // Priority 1: directly selected groups
  const selGroups = graph._groups.filter((g) => g && g.selected);
  if (selGroups.length > 0) return selGroups[0].font_size || 20;
  // Priority 2: groups containing selected nodes
  const selNodes = Object.values(graph._nodes || {}).filter((nd) => nd && nd.is_selected);
  for (const nd of selNodes) {
    if (nd.group && nd.group.font_size) return nd.group.font_size;
  }
  // Priority 3: first group
  return graph._groups[0].font_size || 20;
}

// ── Public API ───────────────────────────────────────────────────────────────

window.HkGroups = window.HkGroups || {};
Object.assign(window.HkGroups, {
  createGroupFromSelection,
  patchGroupFont,
  setGroupFontSize,
  getGroupFontSize,
});

export { createGroupFromSelection, patchGroupFont };
