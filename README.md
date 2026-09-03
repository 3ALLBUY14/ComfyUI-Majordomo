<div align="center">

# <img src="icons/panel.svg" alt="Node Alignment" height="36"> Node Alignment Panel

### One-stop ComfyUI node organization tool

[中文](./README_CN.md)

</div>

---

<div align="center">
<img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/screenshot-en.png" alt="Panel Overview" width="400">
</div>

<br>

A ComfyUI custom node plugin that provides comprehensive workflow node organization tools. Align, resize, arrange, color-manage your nodes, create quick groups, and snap-drag with real-time alignment guides — all with a polished, animated UI.

---

### Installation

Clone into your ComfyUI `custom_nodes` directory:

```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/3ALLBUY14/ComfyUI-Majordomo.git
```

Restart ComfyUI to load the plugin. A floating button will appear on the canvas. Hover the button to activate the quick color popup, or right-click to activate the quick alignment popup. Select 1-2 or more nodes to use alignment and organization features.

---

### Floating Button

The circular floating button at the bottom-right of the canvas is the plugin entry point:

| Action | Behavior |
|---|---|
| Left-click | Open the main panel |
| Right-click | Toggle align popup |
| Drag (left-button hold + move >4px) | Freely move the button; all popups/hints auto-hide during drag |
| Hover (>350ms) | Show action hint bubble (left-click to open / right-click for align tools) |
| Hover (>200ms) | Show quick color popup (hover a chip to preview on nodes, click to apply) |

- Button position is saved to localStorage and restored on next launch
- Auto-clamped into the viewport on window resize

---

### Main Panel

<div align="center">
<img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/panel-en.png" alt="Panel Overview" width="400">
</div>

<br>

The main panel consists of five sections: title bar, alignment tools, palettes, custom colors, and opacity control.

#### Title Bar
- Plugin icon + title
- Draggable to move the entire panel (position auto-persisted)
- 🧹 Free VRAM/RAM button on the right (one-click release with sweep animation + Toast feedback)
- Language toggle button on the right (CN / EN)

#### Alignment Tools (14 Modes)

Each alignment button shows a blue dashed preview outline on the canvas when hovered — what you see is what you get.

| Category | Functions | Description | Nodes Required |
|----------|-----------|-------------|---|
| Edge Align | Left / Right / Top / Bottom | Align to the outermost selected node | ≥2 |
| Center Align | Height-Center / Width-Center | Align all node centers to a single line | ≥2 |
| Size Normalize | Width-Max/Min, Height-Max/Min | Normalize width or height across selected nodes | ≥2 |
| Size Normalize | Size-Max / Size-Min | Normalize overall dimensions | ≥2 / ≥1 |
| Flow Layout | H-Flow / V-Flow | Auto-arrange nodes by selection order with adjustable gap | ≥2 |

**Gap input**: Below the alignment tools, range 0-200, default 30, auto-persisted.

**Snap distance input**: Next to the gap input, range 4-16, default 8 — controls the drag-to-snap sensitivity. Only visible when snap is enabled.

**Undo / Redo buttons**: Next to the gap input — ↶ undoes and ↷ redoes the last alignment or size operation. These use an independent undo stack that does not interfere with ComfyUI's native undo (which still handles color changes).

#### Palette Section
- **14 preset palettes**, each with 25 colors in a 5×5 grid, professionally designed with 5 color families × 5 lightness levels, optimized for dark backgrounds: Original Warm, Original Mixed, Original Dark, Original Dreamy, Rainbow, Morandi Soft, Candy Bright, Midnight Dark, Warm Retro, Cool Tech, Minimal Mono, Forest Nature, Cyber Neon, Oil Painting Vintage
- **Custom palettes**: Save your own color collection as a named palette (💾 button), stored locally and appearing in the dropdown alongside presets; delete custom palettes with 🗑️ button
- **Dropdown menu** for quick palette selection (click the name to expand all palettes)
- Arrow navigation + index display (e.g., `3/10`)
- Dot indicators for direct palette switching
- Palette names are bilingual (EN / CN)

#### Custom Color Section
- **Hex input**: Type `#RRGGBB`, press Enter to save
- **Color picker**: Inline picker with live preview
- **Toolbar buttons** (in a dedicated row below the preview):
  - 💧 **Pick from node**: Read the color of the first selected node and load it into the custom color section
  - 🧪 **EyeDropper**: Pick any color visible on screen using the browser's native EyeDropper API (auto-hidden if unsupported)
  - 📋 **Copy**: Copy the current node's full color scheme (title, body, group, text)
  - 📥 **Paste**: Apply the copied color scheme to selected nodes/groups (shows color indicator when clipboard has content)
  - 🗂️ **Create group**: Create a native LGraphGroup with a live color preview dot — auto-applies the current color
  - 💾 **Save**: Save the current color to "Saved Colors" (max 25, with flash animation)
- **↶↷ Undo/Redo color buttons**: Located next to the palette dots, undo or redo color application (up to 50 steps)
- **Saved colors strip**: User-saved colors (max 25), with ◀▶ pagination (9 per page), click to apply
- **Recent colors strip**: Recently used colors (max 9), click to apply

#### Opacity Control
- Slider range 20% - 100%, default 85%
- Real-time panel opacity adjustment
- Auto-persisted

#### Panel Interactions
- **Smooth open/close animation**: Panel scales in/out with a 0.25s cubic-bezier transition
- **Double-click to close**: Double-click outside buttons/inputs/chips to close
- **Double-click close hint**: After 500ms hovering the top title bar, a "Double-click to close" hint follows the cursor
- **Selection sync**: Panel handle highlights when >1 node is selected

---

### Quick Color Popup

A small color panel that appears after hovering the floating button for 200ms:
- 3×3 grid layout: 8 recent colors + 1 random color button (🎲) in the center
- **Dual-color preview**: Each chip shows a gradient with title color (top 38%) and body color (bottom 62%) — see both colors at a glance
- **Action bar** below the grid with three icon-only buttons:
  - 💧 **Pick**: Read color from the first selected node or group
  - 📋 **Copy**: Copy the current node's color scheme (title, body, group, text) — button shows color indicator when clipboard has content
  - 📥 **Paste**: Apply the copied color scheme to selected nodes/groups
- Smart positioning: left or right of the button based on available space
- **Hover a chip to preview**: Nodes update in real-time, move away to revert
- Click a color to apply it permanently to the currently selected nodes
- **🎲 Random button**: Click the center dice to apply a random color — the grid refreshes instantly to show the new color in recent history

---

### Align Popup (Right-click Floating Button)

Identical to the main panel's alignment section, plus a **Create Group** button at the bottom.

| Trigger | Behavior |
|---|---|
| Hover a button | Show blue dashed preview outline on the canvas |
| Click a button | Execute alignment, popup stays open for consecutive operations |
| Click outside / press Escape / mouse leaves popup | Close popup |
| Start dragging floating button / open main panel | Close popup immediately |

**Create Group button**: Wraps all selected nodes in a native LGraphGroup with correct padding (title bar sits above nodes, no overlap). Shows a live color preview dot. If a color was recently picked (💧) or copied (📋), it is automatically applied to the group and all contained nodes.

**Group Font-Size Slider**: At the bottom of the align popup, below the Create Group button. Drag the slider or type a value (10–300px) to adjust group title font size in real-time.

Button enabled/disabled states sync with canvas node selection in real time.

---

### Demo

<div align="center">

**Node Alignment**

<img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/alignment-en.gif" alt="Node Alignment Demo" width="600">

**Size Normalization**

<img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/size-alignment-en.gif" alt="Size Alignment Demo" width="600">

**Color Management**

<img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/color-en.gif" alt="Color Management Demo" width="600">

</div>

---

### Usage

<div align="center">

**Method 1: Quick Floating Popup**

<img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/handler1-en.gif" alt="Handler Usage 1" width="600">

**Method 2: Full Adjustment Panel**

<img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/handler2-en.gif" alt="Handler Usage 2" width="600">

</div>

---

### Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| **Alt+V** | Toggle main panel |
| **Alt+S** | Toggle drag-to-snap alignment guides |
| **Escape** | Close main panel / align popup |
| **Enter** (in hex input) | Save custom color |
| **Ctrl/Cmd + Z** | Undo alignment / size operation (independent stack, panel open only) |
| **Ctrl/Cmd + Y** or **Ctrl/Cmd + Shift + Z** | Redo alignment / size operation |
| **Ctrl/Cmd + Z** (no alignment undo available) | Falls through to ComfyUI native undo |
| **Shift** (while dragging) | Temporarily bypass snap alignment |

---

### Other Features

#### Undo System (Dual-Stack)
The plugin uses **three independent undo stacks** that do not conflict with each other:
- **Alignment & Size undo** (custom stack): Handles position and size changes from alignment, size normalization, and flow layout. Up to 50 steps. Accessed via the ↶ / ↷ buttons or `Ctrl/Cmd+Z` / `Ctrl/Cmd+Y` when the panel is open.
- **Color undo** (custom stack): Handles color application from palette chips, quick popup, and custom color. Up to 50 steps. Accessed via the ↶ / ↷ buttons in the custom color section.
- **ComfyUI native undo**: Fallback for any other operations.

When the panel is open and there are alignment operations to undo, `Ctrl/Cmd+Z` is intercepted by the panel. Otherwise, it falls through to ComfyUI's native undo. Input fields are never intercepted.

#### Auto Color
When coloring a node, the plugin keeps your selected color as the background and auto-computes the title bar color and group color. **Title text** automatically switches to pure white or black based on the title bar brightness. **Slot label text** stays pure white by default, switching to black only when the node background is near-white (luminance ≥ 0.85), ensuring maximum readability on any color.

#### Dual-Track Color Mode
The custom color section supports independent title (T) and body (B) color editing:
- **🔗 Link button**: Toggle between linked mode (title auto-derived from body) and unlinked mode
- **T / B buttons**: Select which track to edit when unlinked
- **SV + Hue picker**: Click the color preview to open an inline saturation/value + hue picker for precise color selection

#### Drag-to-Snap Alignment
When enabled (Alt+S or toolbar button), dragging nodes or groups snaps to nearby edges and centers with blue guide lines:
- Snaps to left, right, top, bottom, and center of other nodes and groups
- **Sticky snap**: Targets within 1.5× snap distance get extra tolerance for natural alignment
- **Shift bypass**: Hold Shift while dragging to temporarily disable snap
- **Auto-bypass on UI**: Snap automatically disables when the pointer is over any panel UI element (panel, floating button, popups) — no conflicts
- Configurable snap distance (4–16 screen pixels) in the panel alignment section
- Zero overhead when disabled (single boolean check)

#### Quick Group
Create a native LGraphGroup that wraps all selected nodes with correct padding:
- Accessible from the align popup's "Create group" button
- Uses native `resizeTo()` for correct bounds — group title bar sits above node titles
- Auto-applies the last picked (💧) or copied (📋) color to the group and all contained nodes
- Fully compatible with ComfyUI's native group editing, resizing, and properties

#### Group Font Size Fix (v20.3+)
Since ComfyUI frontend v20.3, the native `LGraphGroup.draw()` method uses hardcoded constants (`GROUP_TEXT_SIZE=20`, `NODE_TITLE_HEIGHT=30`) instead of `this.font_size`, making the right-click "Font size" menu option ineffective. The plugin patches `LGraphGroup` to restore the pre-v20.3 behavior:
- **draw()** uses `this.font_size` for both title text size and title bar height (`font_size * 1.4`)
- **titleHeight** getter returns `font_size * 1.4` (proportional, not fixed 30)
- **configure()** restores `font_size` from serialized workflow data
- **serialize()** saves `font_size` to workflow data
- On older kernels (pre-v20.3) the patch is a transparent no-op

#### Toast Notifications
Top-right slide-in notifications that auto-dismiss after 3 seconds, covering operation success/failure, insufficient nodes, and other scenarios.

#### Accessibility
All buttons have `aria-label`, alignment buttons support keyboard focus to trigger canvas preview.

---

### localStorage Persistence

| Key | Purpose | Default |
|---|---|---|
| `hk-lang` | Current language | `"en"` |
| `hk-panel-opacity` | Panel opacity | `0.85` |
| `hk-float-btn-pos` | Floating button position | Bottom-right 24px |
| `hk-position` | Main panel position | Centered on cursor |
| `hk-align-gap` | Flow alignment gap | `30` |
| `hk-recent-colors` | Recent colors (max 9) | Default color set |
| `hk-saved-colors` | Saved colors (max 25) | Empty array |
| `hk-custom-palettes` | Custom palettes | Empty array |
| `hk-snap-enabled` | Drag snap on/off (fallback) | `false` |
| `Hk.Snap.Enabled` | Drag snap on/off (settings) | `false` |
| `Hk.Snap.SnapDistance` | Snap distance in pixels | `8` |

---

### Project Structure

```
ComfyUI-Majordomo/
├── __init__.py              # Plugin entry point
├── ComfyUIFEExampleVueBasic.py  # Frontend node definition
├── pyproject.toml           # Project configuration
├── js/
│   ├── main.js              # Core logic
│   ├── icons.js             # Icon resources
│   ├── panel_style.js       # Style definitions
│   ├── snap.js              # Drag-to-snap alignment guides
│   └── group.js             # Quick group creation
├── icons/                   # SVG icon files
├── locales/
│   ├── en/main.json         # English locale
│   └── zh/main.json         # Chinese locale
└── doc/                     # Documentation & demo assets
```

> **Note**: All frontend code under `js/` is plain, hand-maintained JavaScript loaded directly by ComfyUI — there is no build step.

---

## Changelog

### v1 — 2026-07-28

Initial release with the following features:

- **14 alignment modes**: Edge align, center align, size normalize, flow layout
- **14 professional palettes** with 25 colors each, plus unlimited custom palettes
- **Dual-track color mode** with SV + hue picker, copy/paste color, eyedropper
- **Smart text color** (auto white/black based on brightness)
- **Drag-to-snap alignment** with blue guide lines, Alt+S toggle, Shift bypass
- **Quick group** creation with auto-color
- **Group font-size slider** (10–300px) with real-time preview
- **Group font size fix** for ComfyUI v20.3+
- **Floating button** with quick color popup and right-click align popup
- **Free VRAM/RAM button** with Toast feedback
- **Dual undo/redo stacks** (alignment + color, 50 steps each)
- **Full keyboard shortcuts** and i18n (EN/CN)
- **Panel opacity control**, draggable panel, smooth animations
- **Toast notifications** and accessibility support

See [CHANGES_LOG.md](./CHANGES_LOG.md) for detailed history.

---

## License

MIT License
