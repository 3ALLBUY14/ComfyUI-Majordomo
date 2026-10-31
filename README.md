<div align="center">

<img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/icons/panel.svg" alt="ComfyUI-Majordomo Logo" width="80" height="80">

# ComfyUI-Majordomo

Node Alignment Panel · Turn scattered nodes into a clear workflow.

</div>

![A clearer workflow: alignment, layout, colors and groups, with 14 layout tools, 14 palettes and English/Chinese support](https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/readme-cover-en.svg)

<p align="center">
  <a href="https://github.com/3ALLBUY14/ComfyUI-Majordomo/blob/main/README_CN.md"><strong>CN 中文</strong></a> ·
  <a href="#installation"><strong>Install</strong></a> ·
  <a href="#getting-started">Get started</a> ·
  <a href="#demos">Demos</a> ·
  <a href="#shortcuts">Shortcuts</a> ·
  <a href="#faq">FAQ</a>
</p>

<details>
<summary>See the before-and-after comparison</summary>

![The same nodes before and after organizing their layout](https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/readme-overview-en.svg)

This is a feature illustration. See the demos below for actual operation.

</details>

<br>

## Installation

Open a terminal in ComfyUI's `custom_nodes` folder and run:

```bash
git clone https://github.com/3ALLBUY14/ComfyUI-Majordomo.git
```

> **Restart ComfyUI, then refresh the page.** A round floating button appears at the bottom-right of the canvas.

<details>
<summary>No Git? Install from a ZIP file</summary>

On the [repository page](https://github.com/3ALLBUY14/ComfyUI-Majordomo), choose **Code → Download ZIP**. Extract the archive and place the plugin folder in `ComfyUI/custom_nodes/`.

Make sure `__init__.py` is directly inside the plugin folder, with no extra nested folder. Restart ComfyUI and refresh the page.

</details>

<br>

## Getting started

1. **Select nodes**: alignment and layout usually need at least 2 nodes. Colors work with a single node or group.
2. **Open the panel**: left-click the round floating button, or press **Alt + V**.
3. **Preview and apply**: hover over an alignment button to see a blue dashed preview, then click to apply.

You do not need to add a node to your workflow. Drag the floating button wherever it is convenient.

<p align="center">
  <img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/panel-en.png" alt="Floating button and quick color popup: left-click opens the full panel, right-click opens alignment tools" width="460"><br>
  <sub>Left-click: full panel · Right-click: alignment tools · Hover: quick colors</sub>
</p>

<br>

## Demos

### Align and arrange

Align node edges or centers in one click. Automatic layout follows node connections horizontally or vertically, with adjustable spacing.

<p align="center">
  <img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/alignment-en.gif" alt="Node alignment demonstration" width="840">
</p>

> **Snap while dragging:** use the snap switch in the panel header, or press **Alt + S**. Hold **Shift** while dragging to temporarily disable the plugin's snapping.

### Match node sizes

Give selected nodes the same width or height, or use “Shrink each to its minimum size” to remove extra space. Shrinking also works on a single node.

<details>
<summary><strong>Watch demo</strong> · Resize nodes</summary>

<p align="center">
  <img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/size-alignment-en.gif" alt="Matching node widths and heights" width="840">
</p>

</details>

### Color your nodes

Select nodes or groups, then click a swatch. Choose a preset palette or your own colors, with separate controls for title and body colors.

- **Preview first**: hover over a swatch in the quick color popup. Moving away restores the original; clicking applies the color.
- **Reuse a color scheme**: right-click a node or group to copy, paste or reset its colors.
- **Keep favorites**: save colors you like, or combine them into a custom palette.

<details>
<summary><strong>Watch demo</strong> · Node colors</summary>

<p align="center">
  <img src="https://raw.githubusercontent.com/3ALLBUY14/ComfyUI-Majordomo/main/doc/color-en.gif" alt="Applying colors to nodes and groups" width="840">
</p>

</details>

### Groups and other tools

| Tool | How to use it |
| --- | --- |
| **Quick groups** | Select nodes and click “Create group” to wrap the selection. You can also adjust the group title size. |
| **Mute / bypass a group** | Click a group title to select it, then choose “Mute group” or “Bypass group.” Click again to restore; pinned nodes are skipped. |
| **Handy extras** | Switch languages or free VRAM and RAM from the header. Move the panel, adjust its opacity, and keep organizing inside subgraphs. |

Group titles have **20 / 40 / 60 / 80 / 100** font-size presets. Right-click or press **F2** to customize a preset; editing does not apply it immediately. Resizing expands the title upward without moving the nodes. Group titles use white text by default.

<br>

## Shortcuts

| Shortcut | Action |
| --- | --- |
| <kbd>Alt</kbd> + <kbd>V</kbd> | Open / close the main panel |
| <kbd>Alt</kbd> + <kbd>S</kbd> | Toggle drag snapping |
| Hold <kbd>Shift</kbd> while dragging | Temporarily disable the plugin's snapping |
| <kbd>Alt</kbd> + <kbd>U</kbd> | Undo alignment, size or layout changes |
| <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> | Redo alignment, size or layout changes |
| <kbd>Esc</kbd> | Close the main panel or quick alignment popup |

Alignment undo / redo shortcuts work while the main panel is open. **Use the color section's undo / redo buttons for colors.** Ctrl / Cmd + Z continues to control ComfyUI's own undo.

<br>

## FAQ

<details>
<summary>Where is the floating button after installation?</summary>

Restart ComfyUI, refresh the page, and try **Alt + V**. If the panel still does not appear, check that the plugin is in `ComfyUI/custom_nodes/ComfyUI-Majordomo/` and look for plugin loading errors in the startup log.

If an update still shows the old interface, try a hard refresh: **Ctrl + F5** on Windows / Linux, or **Cmd + Shift + R** on macOS.

</details>

<details>
<summary>Why are some buttons disabled?</summary>

Most alignment, size matching and layout tools need at least 2 selected nodes. “Shrink each to its minimum size” works on a single node. To mute or bypass a group, click its title to select it first.

</details>

<details>
<summary>How do I restore colors?</summary>

Use the color section's undo button to undo a color change. To restore the theme's default colors, right-click a node or group and choose the reset color option.

</details>

<details>
<summary>Are colors and settings saved?</summary>

Saved colors, custom palettes, panel position and opacity are stored in the current browser. Switching browsers or clearing site data resets them.

Node and group colors are saved with the workflow, so remember to save your workflow after making changes.

</details>

---

<p align="center">
  <a href="https://github.com/3ALLBUY14/ComfyUI-Majordomo/blob/main/CHANGES_LOG.md">Changelog</a> ·
  <a href="https://github.com/3ALLBUY14/ComfyUI-Majordomo/issues">Report an issue</a> ·
  <a href="https://github.com/3ALLBUY14/ComfyUI-Majordomo/blob/main/LICENSE">MIT License</a>
</p>
