# Releases

> Bilingual release notes (English / 中文) — click a version to jump.

| Version | Date | Highlights |
|---------|------|------------|
| [v1](#v1--2026-07-28) | 2026-07-28 | Initial release: alignment panel, 14 palettes, dual-track color, drag-to-snap, quick group, font slider |

---

## v1 — 2026-07-28

### 🇬🇧 English

#### ✨ What's New

**Major Features:**

- **🎯 Node Alignment Panel** — One-stop ComfyUI node organization tool with alignment, resizing, flow layout, and color management
- **📏 14 Alignment Modes** — Edge align (left/right/top/bottom), center align (horizontal/vertical), size normalize (width/height/overall max/min), flow layout (horizontal/vertical) with adjustable gap
- **🎨 14 Professional Palettes** — Each with 25 colors (5 families × 5 lightness levels), optimized for dark backgrounds
- **💾 Custom Palettes** — Save your color collections as named palettes (unlimited), stored locally
- **🎨 Dual-Track Color Mode** — Independently edit title (T) and body (B) colors with a link toggle (🔗)
- **🎯 SV + Hue Picker** — Inline saturation/value picker with hue strip for precise color selection
- **📋 Copy / Paste Color** — Copy a node's full color scheme and paste it to other nodes or groups
- **🧪 EyeDropper** — Screen-wide color picking via browser native EyeDropper API
- **🔤 Smart Text Color** — Node title and slot label text automatically switches between pure white and black based on brightness
- **↶↷ Dual Undo/Redo Stacks** — Independent stacks for alignment (50 steps) and color operations (50 steps)
- **⚡ Free VRAM/RAM Button** — One-click memory release with sweep animation + Toast feedback
- **🖱️ Floating Button** — Freely draggable, supports hover quick popup and right-click align popup
- **🎨 Quick Color Popup** — Hover floating button 200ms for recent colors panel with live preview
- **📦 Quick Group** — Create native LGraphGroup wrapping selected nodes with auto-color
- **🔤 Group Font-Size Slider** — Font-size slider (10–300px) in align popup with real-time preview
- **📏 Drag-to-Snap Alignment** — Drag nodes/groups to snap to nearby edges and centers with blue guide lines
- **⌨️ Keyboard Shortcuts** — `Alt+V` toggle panel, `Alt+S` toggle snap, `Ctrl/Cmd+Z` undo, `Ctrl/Cmd+Y` redo, `Escape` close
- **📢 Toast Notifications** — Top-right slide-in, 4 types (info/success/warning/error)
- **🔮 Opacity Control** — Panel opacity slider (20%-100%), real-time adjustment
- **🌐 Full i18n** — All messages support EN/CN switching
- **♿ Accessibility** — All buttons have `aria-label`, alignment buttons support keyboard focus

#### 🔧 Technical

- **Modular architecture** — Core logic (`main.js`), styles (`panel_style.js`), snap (`snap.js`), group (`group.js`) as independent modules
- **Async loading** — Snap and group modules load asynchronously, failure never blocks the main panel
- **Compatibility** — Works with both Legacy and Vue / Nodes 2.0 canvas
- **Group font fix** — Patches `LGraphGroup` to restore `font_size` behavior on ComfyUI v20.3+
- **Performance** — Reduced polling when panel closed, zero overhead when snap disabled

---

### 🇨🇳 中文

#### ✨ 新特性

**主要功能：**

- **🎯 节点对齐面板** — 一站式 ComfyUI 节点整理工具，提供对齐、尺寸统一、流式排列、颜色管理等全方位功能
- **📏 14 种对齐模式** — 边缘对齐（左/右/上/下）、居中对齐（水平/垂直）、尺寸统一（宽/高/整体最大最小）、流式排列（水平/垂直），间距可调
- **🎨 14 套专业调色板** — 每套 25 色（5 色系 × 5 明度等级），针对深色背景优化
- **💾 自定义调色板** — 将颜色集合保存为命名调色板（数量不限），本地存储
- **🎨 双轨配色模式** — 标题色（T）和正文色（B）可独立编辑，带联动开关（🔗）
- **🎯 SV + 色相拾色器** — 内联饱和度/明度拾色器 + 色相条，精确选色
- **📋 复制/粘贴颜色** — 复制节点的完整配色方案，粘贴到其他节点或组
- **🧪 屏幕取色滴管** — 使用浏览器原生 EyeDropper API 拾取屏幕上任意位置的颜色
- **🔤 智能文字颜色** — 节点标题和接口标签文字根据标题栏亮度自动切换为纯白或纯黑
- **↶↷ 双栈撤销/重做** — 对齐操作和颜色操作各有独立的撤销栈（各 50 步）
- **⚡ 清理显存/内存按钮** — 标题栏一键释放 VRAM/RAM，含脉冲动画 + Toast 反馈
- **🖱️ 浮动按钮** — 可自由拖拽到屏幕任意位置，支持悬停快捷弹窗和右键对齐弹窗
- **🎨 快捷颜色弹窗** — 悬停浮动按钮 200ms 弹出最近使用颜色面板，支持实时预览
- **📦 快速打组** — 对齐弹窗新增「创建分组」按钮，自动包裹选中节点并应用颜色
- **🔤 组标题字体滑动条** — 右键对齐弹窗底部新增字体大小滑动条（范围 10–300px），实时预览
- **📏 拖拽吸附对齐** — 拖拽节点或组时自动吸附到其他元素的边缘和中心，画布上实时绘制蓝色引导线
- **⌨️ 完整键盘快捷键** — `Alt+V` 开关面板、`Alt+S` 开关吸附、`Ctrl/Cmd+Z` 撤销、`Ctrl/Cmd+Y` 重做、`Escape` 关闭
- **📢 Toast 通知系统** — 右上角滑入式提示，支持 4 种类型
- **🔮 透明度控制** — 面板透明度滑块（20%-100%），实时调节并持久化
- **🌐 完整 i18n** — 所有提示消息支持中英文切换
- **♿ 无障碍支持** — 所有按钮均设置 `aria-label`，对齐按钮支持键盘 focus 触发画布预览

#### 🔧 技术细节

- **模块化架构** — 核心逻辑（`main.js`）、样式定义（`panel_style.js`）、拖拽吸附（`snap.js`）、快速打组（`group.js`）独立模块
- **异步加载** — 吸附和打组模块异步加载，加载失败不影响主面板
- **兼容性** — 兼容 Legacy 和 Vue / Nodes 2.0 画布
- **组标题字体修复** — Patch `LGraphGroup` 恢复 ComfyUI v20.3+ 之前的 `font_size` 行为
- **性能优化** — 面板关闭时降低轮询频率，吸附关闭时零开销（仅一次布尔读取）

---

### 📦 Download & Install

```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/3ALLBUY14/ComfyUI-Majordomo.git
```

Restart ComfyUI and enjoy!

---

## 📋 Detailed Changelog

For the complete commit-level history, see [CHANGES_LOG.md](./CHANGES_LOG.md).

## 📄 License

MIT License
