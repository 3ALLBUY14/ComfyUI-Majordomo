import { app as v0 } from "../../scripts/app.js";
import { he, y0, k0, z0, A0, L0, E0, M0, S0, H0, F0, B0, N0, P0, _0 } from "./icons.js";
import { panelCSS } from "./panel_style.js";
let U2 = null;
const V0 = v0;
V0.registerExtension({
  name: "node-alignment-panel",
  async setup() {
    try {
      D0();
    } catch {
    }
  },
  nodeCreated(T) {
    T.constructor.comfyClass === "node-alignment-panel" && (T.setSize([200, 100]), T.title && (T.title = "🎯 Alignment Panel Active"));
  }
});
function D0() {
  try {
    if (window.LiteGraph && window.LiteGraph.LGraphNode) {
      const _proto = window.LiteGraph.LGraphNode.prototype;
      if (!_proto._hkPatchedDrawTitleText) {
        const _origDrawTitleText = _proto.drawTitleText;
        if (typeof _origDrawTitleText === "function") {
          _proto._hkPatchedDrawTitleText = true;
          _proto.drawTitleText = function(ctx, opts) {
            if (this.textcolor) {
              opts = Object.assign({}, opts, { default_title_color: this.textcolor });
            }
            return _origDrawTitleText.call(this, ctx, opts);
          };
        }
      }
      if (!_proto._hkPatchedDrawSlots) {
        const _origDrawSlots = _proto.drawSlots;
        if (typeof _origDrawSlots === "function") {
          _proto._hkPatchedDrawSlots = true;
          _proto.drawSlots = function(ctx, opts) {
            if (this.textcolor && window.LiteGraph.NODE_TEXT_COLOR) {
              // Slot label text: default white, black only when bgcolor is near-white
              let _slotColor = "#FFFFFF";
              if (this.bgcolor) {
                const _hex = String(this.bgcolor).replace("#", "");
                if (_hex.length === 6) {
                  const _r = parseInt(_hex.substr(0, 2), 16) / 255;
                  const _g = parseInt(_hex.substr(2, 2), 16) / 255;
                  const _b = parseInt(_hex.substr(4, 2), 16) / 255;
                  const _lum = 0.2126 * _r + 0.7152 * _g + 0.0722 * _b;
                  if (_lum >= 0.85) _slotColor = "#000000";
                }
              }
              const _orig = window.LiteGraph.NODE_TEXT_COLOR;
              window.LiteGraph.NODE_TEXT_COLOR = _slotColor;
              try { return _origDrawSlots.call(this, ctx, opts); }
              finally { window.LiteGraph.NODE_TEXT_COLOR = _orig; }
            }
            return _origDrawSlots.call(this, ctx, opts);
          };
        }
      }
      // Patch serialize to persist textcolor
      if (!_proto._hkPatchedSerialize) {
        const _origSerialize = _proto.serialize;
        if (typeof _origSerialize === "function") {
          _proto._hkPatchedSerialize = true;
          _proto.serialize = function() {
            const _o = _origSerialize.call(this);
            if (this.textcolor) _o.textcolor = this.textcolor;
            return _o;
          };
        }
      }
      // Patch configure to restore/recompute textcolor on workflow load
      if (!_proto._hkPatchedConfigure) {
        const _origConfigure = _proto.configure;
        if (typeof _origConfigure === "function") {
          _proto._hkPatchedConfigure = true;
          _proto.configure = function(data) {
            _origConfigure.call(this, data);
            if (data && data.textcolor) {
              this.textcolor = data.textcolor;
            } else if (this.color) {
              // Recompute textcolor from the restored title bar color
              const _hex = String(this.color).replace("#", "");
              if (_hex.length === 6) {
                const _r = parseInt(_hex.substr(0, 2), 16) / 255;
                const _g = parseInt(_hex.substr(2, 2), 16) / 255;
                const _b = parseInt(_hex.substr(4, 2), 16) / 255;
                const _lum = 0.2126 * _r + 0.7152 * _g + 0.0722 * _b;
                this.textcolor = _lum >= 0.5 ? "#000000" : "#FFFFFF";
              }
            }
          };
        }
      }
    }
  } catch {}
  let T = null, H = null, x2 = "en", d2 = null, K2 = null;
  const ue = {
    en: {
      title: "Node Alignment",
      basicAlignment: "Basic Alignment",
      sizeAdjustment: "Size Adjustment",
      flowAlignment: "Flow Alignment",
      presetPalettes: "Preset palettes",
      custom: "Custom",
      recentColors: "Recent colors",
      selectToApply: "Select nodes or groups to apply color",
      needTwoNodes: "Please select at least 2 nodes to align",
      errorAlign: "Error during alignment",
      errorHFlow: "Error in horizontal flow alignment",
      errorVFlow: "Error in vertical flow alignment",
      notEnoughNodes: "Not enough valid nodes: {valid}/{total} nodes are valid",
      opacity: "Opacity",
      saveColor: "Save",
      colorPreview: "Preview",
      savedColors: "Saved",
      floatHintLeft: "Left-click",
      floatHintRight: "Right-click",
      floatHintOpen: "Open panel",
      floatHintAlign: "Alignment tools",
      dblclickClose: "Double-click to close",
      randomColor: "Random color",
      clearVram: "Free VRAM & RAM",
      alignGap: "Spacing",
      undo: "Undo alignment",
      redo: "Redo alignment",
      noUndo: "Nothing to undo",
      noRedo: "Nothing to redo",
      pickColor: "Pick color from node",
      noNodeColor: "No color found on selected node",
      savePalette: "Save 25 colors as palette",
      paletteNamePrompt: "Enter palette name:",
      paletteSaved: "Palette saved",
      paletteDeleted: "Palette deleted",
      deletePalette: "Delete palette",
      confirmDeletePalette: "Delete this custom palette?",
      noSavedColors: "No saved colors to create palette",
      colorUndo: "Undo color",
      colorRedo: "Redo color",
      noColorUndo: "No color to undo",
      noColorRedo: "No color to redo",
      saveAsTemplate: "Save as palette",
      "align:left": "Align left edges",
      "align:height-center": "Center horizontally",
      "align:right": "Align right edges",
      "align:top": "Align top edges",
      "align:width-center": "Center vertically",
      "align:bottom": "Align bottom edges",
      "align:width-max": "Match widest width",
      "align:width-min": "Match narrowest width",
      "align:height-max": "Match tallest height",
      "align:height-min": "Match shortest height",
      "align:size-max": "Match largest size",
      "align:size-min": "Match smallest size",
      "align:horizontal-flow": "Distribute horizontally",
      "align:vertical-flow": "Distribute vertically",
      langLabel: "中",
      titleColor: "Title color",
      bodyColor: "Body color",
      dualLink: "Link title & body",
      copyColor: "Copy color",
      pasteColor: "Paste color",
      noColorClip: "No color copied",
      groupSection: "Grouping",
      createGroup: "Create group",
      groupCreated: "Group created",
      selectToGroup: "Select nodes to create group",
      groupFontSize: "Group font",
      eyedropper: "Eyedropper (pick from screen)",
      snapDistance: "Snap"
    },
    zh: {
      title: "节点对齐",
      basicAlignment: "基础对齐",
      sizeAdjustment: "尺寸调整",
      flowAlignment: "流式排列",
      presetPalettes: "预设调色板",
      custom: "自定义",
      recentColors: "最近使用",
      selectToApply: "选择节点或分组以应用颜色",
      needTwoNodes: "请至少选择 2 个节点进行对齐",
      errorAlign: "对齐过程中出错",
      errorHFlow: "水平流式排列出错",
      errorVFlow: "垂直流式排列出错",
      notEnoughNodes: "有效节点不足: {valid}/{total} 个节点有效",
      opacity: "透明度",
      saveColor: "保存",
      colorPreview: "预览",
      savedColors: "已保存",
      floatHintLeft: "左键",
      floatHintRight: "右键",
      floatHintOpen: "打开面板",
      floatHintAlign: "对齐工具",
      dblclickClose: "双击空白处关闭",
      randomColor: "随机配色",
      clearVram: "清理显存内存",
      alignGap: "间距",
      undo: "撤销对齐",
      redo: "重做对齐",
      noUndo: "没有可撤销的操作",
      noRedo: "没有可重做的操作",
      pickColor: "从节点取色",
      noNodeColor: "选中节点未找到颜色",
      savePalette: "将最近保存的25个颜色保存为调色板",
      paletteNamePrompt: "输入调色板名称：",
      paletteSaved: "调色板已保存",
      paletteDeleted: "调色板已删除",
      deletePalette: "删除调色板",
      confirmDeletePalette: "确认删除此自定义调色板？",
      noSavedColors: "没有已保存的颜色可创建调色板",
      colorUndo: "撤销颜色",
      colorRedo: "重做颜色",
      noColorUndo: "没有可撤销的颜色",
      noColorRedo: "没有可重做的颜色",
      saveAsTemplate: "保存为调色板",
      "align:left": "左对齐",
      "align:height-center": "水平居中",
      "align:right": "右对齐",
      "align:top": "顶对齐",
      "align:width-center": "垂直居中",
      "align:bottom": "底对齐",
      "align:width-max": "匹配最宽",
      "align:width-min": "匹配最窄",
      "align:height-max": "匹配最高",
      "align:height-min": "匹配最矮",
      "align:size-max": "匹配最大",
      "align:size-min": "匹配最小",
      "align:horizontal-flow": "水平流式排列",
      "align:vertical-flow": "垂直流式排列",
      langLabel: "EN",
      titleColor: "标题色",
      bodyColor: "正文色",
      dualLink: "标题/正文联动",
      copyColor: "复制颜色",
      pasteColor: "粘贴颜色",
      noColorClip: "未复制颜色",
      groupSection: "分组",
      createGroup: "创建分组",
      groupCreated: "已创建分组",
      selectToGroup: "请选择节点以创建分组",
      groupFontSize: "组字体",
      eyedropper: "屏幕取色滴管",
      snapDistance: "吸附"
    }
  };
  function _(i) {
    return ue[x2][i] || ue.en[i] || i;
  }
  function De() {
    var i;
    try {
      const t = (i = window.localStorage) == null ? void 0 : i.getItem("hk-lang");
      if (t === "zh" || t === "en") return t;
    } catch {
    }
    return "en";
  }
  function Te(i) {
    var t;
    try {
      (t = window.localStorage) == null || t.setItem("hk-lang", i);
    } catch {
    }
  }
  function Oe() {
    var i;
    try {
      const t = (i = window.localStorage) == null ? void 0 : i.getItem("hk-panel-opacity");
      if (t !== null) {
        const o = parseFloat(t);
        if (!isNaN(o)) return Math.max(0.2, Math.min(1, o));
      }
    } catch {
    }
    return 0.85;
  }
  function Re(i) {
    var t;
    try {
      (t = window.localStorage) == null || t.setItem("hk-panel-opacity", String(i));
    } catch {
    }
  }
  function k2(i, t = "info") {
    const o = document.createElement("div");
    o.textContent = i, o.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: ${t === "success" ? "#4CAF50" : t === "warning" ? "#FF9800" : t === "error" ? "#F44336" : "#2196F3"};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            z-index: 1001;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
        `, document.body.appendChild(o), setTimeout(() => {
      o.style.opacity = "1", o.style.transform = "translateX(0)";
    }, 10), setTimeout(() => {
      o.style.opacity = "0", o.style.transform = "translateX(20px)", setTimeout(() => {
        o.parentNode && o.parentNode.removeChild(o);
      }, 300);
    }, 3e3);
  }
  async function _freeVram() {
    try {
      const api = window.app?.api || window.api;
      if (!api || typeof api.fetchApi != "function") {
        k2(_("clearVram") + " ✗", "warning");
        return;
      }
      const resp = await api.fetchApi("/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unload_models: !0, free_memory: !0 })
      });
      if (resp.ok) {
        k2(_("clearVram") + " ✓", "success");
      } else {
        k2(_("clearVram") + " ✗", "warning");
      }
    } catch {
      k2(_("clearVram") + " ✗", "warning");
    }
  }
  function Ie() {
    if (!H) return;
    H.querySelectorAll("[data-i18n]").forEach((p) => {
      const d = p.getAttribute("data-i18n");
      d && (p.textContent = _(d));
    }), H.querySelectorAll("[data-i18n-label]").forEach((p) => {
      const d = p.getAttribute("data-i18n-label");
      if (d) {
        const lbl = _(d);
        p.setAttribute("data-label", lbl), p.setAttribute("title", lbl), p.setAttribute("aria-label", lbl);
      }
    }), d2 && (d2.textContent = _("langLabel"));
    const i = H.querySelector(".palette-index-display");
    i && (i.textContent = `${o2 + 1}/${_paletteCount()}`);
    const t = H.querySelector(".hk-palette-select");
    if (t) {
      t.setAttribute("aria-label", _("presetPalettes")), Array.from(t.options).forEach((p, d) => {
        p.textContent = `${d + 1}. ${N2(d)}`;
      }), t.value = String(o2);
    }
    H.querySelectorAll(".hk-palette-dot").forEach((p, d) => {
      const u = N2(d);
      p.setAttribute("aria-label", u || `Palette ${d + 1}`), p.title = u || `Palette ${d + 1}`;
    }), K2 && K2(), je();
    const o = H.querySelector(".hk-dblclose-hint") || document.querySelector(".hk-dblclose-hint");
    o && (o.textContent = _("dblclickClose"));
    const a = H.querySelector(".hk-opacity-slider");
    a && a.setAttribute("aria-label", _("opacity"));
    const l = H.querySelector(".hk-custom-preview");
    l && (l.setAttribute("aria-label", _("custom")), l.title = _("custom"));
    const c = H.querySelector(".hk-custom-save");
    c && c.setAttribute("aria-label", _("saveColor"));
  }
  let A = [], L2 = [], J2 = [], o2 = 0;
  const de = "hk-recent-colors", E2 = 9, Q2 = ["#353535", "#3f5159", "#593930", "#335533", "#333355", "#335555", "#553355", "#665533", "#000000"], fe = "hk-saved-colors", ee = 25;
  let f2 = Qe(), M2 = null, C2 = t0(), w2 = null, W = null, U = null, c2 = null, D2 = !1;
  const te = /* @__PURE__ */ new WeakMap(), T2 = /* @__PURE__ */ new WeakMap();
  function _ns(n) { let w = 150, h = 100; if (n.size && Array.isArray(n.size)) { n.size[0] && (w = n.size[0]); n.size[1] && (h = n.size[1]); } else { typeof n.width == "number" && (w = n.width); typeof n.height == "number" && (h = n.height); if (n.properties) { typeof n.properties.width == "number" && (w = n.properties.width); typeof n.properties.height == "number" && (h = n.properties.height); } } return { width: w, height: h }; }
  let O2 = null, ge = !1;
  const R2 = 48, Ze = 24;
  function be() {
    const i = document.querySelector("#comfyui-body-top, .comfyui-body-top");
    return i && i.getBoundingClientRect().top === 0 ? i : document.querySelector("#comfy-menu, .comfyui-menu, .litegraph-menu, .comfyui-toolbar");
  }
  function Ye() {
    const i = be();
    if (!i)
      return R2;
    const t = i.getBoundingClientRect();
    return !t || t.width === 0 && t.height === 0 ? R2 : t.top < 100 ? Math.max(R2, Math.ceil(t.bottom + 8)) : R2;
  }
  function S2() {
    const i = Ye(), t = window.innerHeight || document.documentElement.clientHeight || 0, o = Math.max(t - i - Ze, 280);
    document.documentElement.style.setProperty("--hk-top-offset", `${i}px`), document.documentElement.style.setProperty("--hk-panel-max-height", `${o}px`);
  }
  function me() {
    if (ge || (ge = !0, window.addEventListener("resize", S2), window.addEventListener("orientationchange", S2)), typeof ResizeObserver < "u") {
      const i = be();
      i && (O2 ? O2.disconnect() : O2 = new ResizeObserver(() => S2()), O2.observe(i));
    }
  }
  const xe = [
    { type: "left", icon: y0, label: "Align left edges", group: "basic" },
    { type: "height-center", icon: E0, label: "Center horizontally", group: "basic" },
    { type: "right", icon: k0, label: "Align right edges", group: "basic" },
    { type: "top", icon: z0, label: "Align top edges", group: "basic" },
    { type: "width-center", icon: L0, label: "Center vertically", group: "basic" },
    { type: "bottom", icon: A0, label: "Align bottom edges", group: "basic" }
  ], Ce = [
    { type: "width-max", icon: M0, label: "Match widest width", group: "size" },
    { type: "width-min", icon: S0, label: "Match narrowest width", group: "size" },
    { type: "height-max", icon: H0, label: "Match tallest height", group: "size" },
    { type: "height-min", icon: F0, label: "Match shortest height", group: "size" },
    { type: "size-max", icon: B0, label: "Match largest size", group: "size" },
    { type: "size-min", icon: N0, label: "Match smallest size", group: "size" }
  ], we = [
    { type: "horizontal-flow", icon: P0, label: "Distribute horizontally", group: "flow" },
    { type: "vertical-flow", icon: _0, label: "Distribute vertically", group: "flow" }
  ];
  function I2(i, t) {
    const _tr = _("align:" + i);
    return _tr !== "align:" + i ? _tr : t;
  }
  const g2 = [
    ["#ff6f61","#ff9a76","#ffc36a","#ffe29a","#ffd6d1","#ffa69e","#ff7b89","#ef5d60","#c03a53","#003f5c","#2f4b7c","#376996","#3f7cac","#49a3c7","#56cfe1","#72efdd","#80ffdb","#c0fdfb","#2a6041","#3b7d4f","#4f945c","#66ad71","#81c784","#a5d6a7","#dcedc8"],
    ["#93b48b","#6d8b74","#150050","#3f0071","#610094","#7b2cbf","#c77dff","#ff61d2","#ff97c1","#ffcbf2","#ffe5f1","#f6d1c1","#f5b5c4","#e9a6c1","#d4a5e3","#b4a0e5","#9fc9eb","#a7d7c5","#d5e2b8","#f1e3a0","#3d0c02","#7f2b0a","#b3541e","#d89a54","#f2d0a9"],
    ["#0d1b2a","#1b263b","#274060","#335c81","#406e8e","#4f83a1","#5f9bbf","#6faad1","#8fc0e6","#ff6f61","#ff9a76","#ffc36a","#ffe29a","#ffd6d1","#ffa69e","#ff7b89","#ef5d60","#c03a53","#003f5c","#2f4b7c","#376996","#3f7cac","#49a3c7","#56cfe1","#72efdd"],
    ["#335c81","#406e8e","#4f83a1","#5f9bbf","#6faad1","#8fc0e6","#2b193d","#412271","#6a4c93","#9b5de5","#f15bb5","#f9a1bc","#feeafa","#ffd6e0","#ffe5f1","#711D9B","#38A44A","#7EDB3B","#E44CB1","#349BCF","#7575D8","#B51A34","#2BB995","#D29569","#B8AE3F"],
    ["#DBB3B3","#CD7A7A","#C93636","#8F2924","#602620","#DDD0B1","#D0B577","#D0A02F","#95771E","#63551D","#B2DCC0","#78CF95","#36C967","#23904D","#20603B","#B4C1DA","#7C96CA","#3968C6","#26438C","#21305E","#D4B3DB","#BF7ACD","#B136C9","#82248F","#5B2060"],
    ["#D3BDBB","#B29795","#996A66","#6F4A44","#53342D","#D3CFBB","#B3AE93","#9D9362","#726C41","#54522B","#BBD3C1","#95B29C","#659A72","#437050","#2D533A","#BBC7D3","#95A3B2","#677F98","#45576E","#2D3C53","#CDBBD3","#AB94B3","#8E639C","#674270","#4D2D53"],
    ["#DCB1B9","#CF7786","#C9364E","#8F2430","#602024","#DED3B0","#D3BB74","#D0A82F","#957D1E","#63581D","#B2DCC3","#78CF9C","#36C973","#239056","#215E41","#B1D5DC","#77C1CF","#36B1C9","#24788F","#204F60","#D5B1DC","#C177CF","#B136C9","#82248F","#5B2060"],
    ["#D8B6BE","#C68092","#BF4060","#8A283C","#5E212A","#DACDB4","#CBB17B","#C99836","#927221","#63531D","#B6D8CA","#80C6A9","#40BF8A","#288A66","#215E4B","#B7C2D7","#8298C4","#436BBC","#2B4588","#23305D","#CFB6D8","#B580C6","#9F40BF","#77288A","#55215E"],
    ["#D8B9B6","#C8857E","#C2483D","#8A3528","#5E2C21","#D8CEB6","#C8B27E","#C69C39","#8D7326","#5F5221","#CBD5B9","#ABC284","#90BC43","#61862C","#425B25","#BBD3D3","#89BDBD","#4FB0B0","#347B7F","#295256","#D3C5BB","#B4A093","#9F7A60","#725840","#53402D"],
    ["#B4DAD7","#7DCAC3","#3DC2B7","#288A87","#215D5E","#B4C4DA","#7C9DCA","#3D74C2","#284C8A","#21355E","#BAB4DA","#897CCA","#5139C6","#3C268C","#31205F","#DAB4BA","#CA7D89","#C63951","#8D2532","#5E2125","#B3DBB3","#7BCC7B","#3AC53A","#268D2B","#225E28"],
    ["#BBC3D3","#959EB2","#6C7993","#4A5369","#2D3653","#C7C7C7","#A3A3A3","#808080","#595959","#404040","#D3C5BB","#B2A195","#967C69","#6B5847","#53402D","#E2D0AC","#D8B56E","#DA9E25","#9C7617","#685517","#B3CADB","#7AAACD","#368CC9","#245D8F","#213F5E"],
    ["#CCD6B7","#AEC581","#94BC43","#64862C","#435B25","#B6D8CA","#80C6A9","#40BF8A","#2B8866","#235C4A","#D6C4B8","#C39E83","#B97646","#84562E","#5D4122","#D3D5B9","#BEC384","#B3BD42","#7B872B","#505926","#B9C5D5","#859EC2","#4576BA","#2F4E84","#263659"],
    ["#DEAFCF","#D175B2","#CC3399","#912266","#611F44","#CFAFDE","#B375D1","#9933CC","#712291","#511F61","#B1DCDC","#77CFCF","#36C9C9","#24898F","#205960","#B0DEB0","#75D175","#32CD32","#219127","#1E6125","#E2D0AC","#D8B56E","#D79D28","#99751A","#66541A"],
    ["#D4BEB9","#C19086","#B55C4A","#814231","#583428","#D5D3B9","#C3BE84","#BAB045","#85822D","#595A25","#C1D4BA","#95C086","#65B54A","#418231","#2F5828","#B9BBD5","#858AC2","#454FBA","#2F3284","#272659","#D1B8D6","#B983C3","#A842BD","#7B2D86","#57255B"]
  ], ye = {
    en: [
      "Original Warm",
      "Original Mixed",
      "Original Dark",
      "Original Dream",
      "Rainbow",
      "Morandi Soft",
      "Candy Bright",
      "Midnight Dark",
      "Warm Retro",
      "Cool Tech",
      "Minimal Mono",
      "Forest Nature",
      "Cyber Neon",
      "Oil Painting"
    ],
    zh: [
      "原版暖色",
      "原版混合",
      "原版暗色",
      "原版梦幻",
      "标准彩虹",
      "莫兰迪柔和",
      "糖果亮色",
      "深夜暗色",
      "暖调复古",
      "冷调科技",
      "极简单色",
      "森林自然",
      "赛博霓虹",
      "油画复古"
    ]
  };
  const _CUSTOM_PALETTE_KEY = "hk-custom-palettes";
  let _customPalettes = [];
  function _loadCustomPalettes() {
    try {
      const t = localStorage.getItem(_CUSTOM_PALETTE_KEY);
      if (t) { const o = JSON.parse(t); if (Array.isArray(o)) _customPalettes = o.filter(p => p && p.name && Array.isArray(p.colors)); }
    } catch {}
  }
  function _saveCustomPalettes() {
    try { localStorage.setItem(_CUSTOM_PALETTE_KEY, JSON.stringify(_customPalettes)); } catch {}
  }
  function _allPalettes() { return [...g2, ..._customPalettes.map(p => p.colors)]; }
  function _paletteCount() { return g2.length + _customPalettes.length; }
  function _isCustomPalette(i) { return i >= g2.length; }
  function N2(i) {
    if (i < g2.length) return (ye[x2] || ye.en)[i] || "";
    const ci = i - g2.length;
    return (_customPalettes[ci] && _customPalettes[ci].name) || `Custom ${ci + 1}`;
  }
  const ie = 4.5, We = "#AAAAAA";
  function Xe() {
    const i = "node-alignment-panel-styles";
    if (document.getElementById(i)) return;
    const t = document.createElement("style");
    t.id = i, t.textContent = panelCSS, document.head.appendChild(t);
  }
  Xe(), me(), S2();
  function ke() {
    const i = document.createElement("section");
    return i.className = "hk-section", i;
  }
  function H2(i, t) {
    const o = document.createElement("p");
    return o.className = "hk-subtitle", o.textContent = i, t && o.setAttribute("data-i18n", t), o;
  }
  function Z2(i, t) {
    const o = document.createElement("div");
    return o.className = `hk-button-grid hk-button-grid-${t}`, i.forEach((a) => {
      o.appendChild($e(a));
    }), o;
  }
  function $e(i) {
    const t = document.createElement("button");
    t.type = "button", t.className = "hk-button", t.dataset.alignmentType = i.type, t.dataset.labelEn = i.label;
    const o = I2(i.type, i.label);
    t.setAttribute("aria-label", o), t.title = o;
    const a = document.createElement("img");
    return a.src = i.icon, a.alt = "", a.draggable = !1, t.appendChild(a), t.addEventListener("mouseenter", (l) => {
      _e(i.type), Ge(t, I2(i.type, i.label));
    }), t.addEventListener("mouseleave", () => {
      X2(), ze();
    }), t.addEventListener("focus", () => _e(i.type)), t.addEventListener("blur", () => X2()), t.addEventListener("click", () => {
      y2(i.type);
    }), t;
  }
  let b2 = null;
  function qe() {
    return b2 || (b2 = document.createElement("div"), b2.className = "hk-align-btn-hint", document.body.appendChild(b2), b2);
  }
  function Ge(i, t) {
    const o = qe();
    o.textContent = t;
    const a = i.getBoundingClientRect();
    o.style.visibility = "hidden", o.classList.add("visible");
    const l = o.offsetWidth, c = o.offsetHeight;
    let p = a.left + a.width / 2 - l / 2, d = a.top - c - 8;
    p = Math.max(6, Math.min(p, window.innerWidth - l - 6)), d < 6 && (d = a.bottom + 8), o.style.left = p + "px", o.style.top = d + "px", o.style.visibility = "";
  }
  function ze() {
    b2 && b2.classList.remove("visible");
  }
  function je() {
    if (!H) return;
    H.querySelectorAll(".hk-button").forEach((o) => {
      const a = o.dataset.alignmentType || "", l = o.dataset.labelEn || "", c = I2(a, l);
      o.setAttribute("aria-label", c), o.title = c;
    }), document.querySelectorAll(".hk-align-popup .hk-button").forEach((o) => {
      const a = o.dataset.alignmentType || "", l = o.dataset.labelEn || "", c = I2(a, l);
      o.setAttribute("aria-label", c), o.title = c;
    });
    const _popupTitles = document.querySelectorAll(".hk-align-popup-title");
    const _titleKeys = ["basicAlignment", "sizeAdjustment", "flowAlignment", "groupSection"];
    _popupTitles.forEach((el, idx) => { if (_titleKeys[idx]) el.textContent = _(_titleKeys[idx]); });
    const _gBtnEl = document.querySelector(".hk-align-popup .hk-create-group-btn");
    if (_gBtnEl) {
      _gBtnEl.setAttribute("aria-label", _("createGroup"));
      const _gSpan = _gBtnEl.querySelector("span");
      if (_gSpan) _gSpan.textContent = _("createGroup");
    }
    const _fsLabEl = document.querySelector(".hk-align-popup .hk-grp-font-label");
    if (_fsLabEl) _fsLabEl.textContent = _("groupFontSize");
    const _fsSlEl = document.querySelector(".hk-align-popup .hk-grp-font-slider");
    if (_fsSlEl) _fsSlEl.setAttribute("aria-label", _("groupFontSize"));
  }
  function Ae(i) {
    const t = i.replace("#", "");
    if (t.length === 3) {
      const o = parseInt(t[0] + t[0], 16), a = parseInt(t[1] + t[1], 16), l = parseInt(t[2] + t[2], 16);
      return { r: o, g: a, b: l };
    }
    return t.length === 6 ? {
      r: parseInt(t.slice(0, 2), 16),
      g: parseInt(t.slice(2, 4), 16),
      b: parseInt(t.slice(4, 6), 16)
    } : null;
  }
  function Ue(i, t, o) {
    const a = (l) => Math.max(0, Math.min(255, Math.round(l))).toString(16).padStart(2, "0");
    return `#${a(i)}${a(t)}${a(o)}`;
  }
  function re(i) {
    const t = Ae(i);
    if (!t) return null;
    const o = t.r / 255, a = t.g / 255, l = t.b / 255, c = Math.max(o, a, l), p = Math.min(o, a, l), d = c - p;
    let u = 0;
    d !== 0 && (c === o ? u = (a - l) / d % 6 : c === a ? u = (l - o) / d + 2 : u = (o - a) / d + 4), u = Math.round(u * 60), u < 0 && (u += 360);
    const y = (c + p) / 2, x = d === 0 ? 0 : d / (1 - Math.abs(2 * y - 1));
    return { h: u, s: x, l: y };
  }
  function Le(i, t, o) {
    const a = (1 - Math.abs(2 * o - 1)) * t, l = a * (1 - Math.abs(i / 60 % 2 - 1)), c = o - a / 2;
    let p = 0, d = 0, u = 0;
    return 0 <= i && i < 60 ? (p = a, d = l, u = 0) : 60 <= i && i < 120 ? (p = l, d = a, u = 0) : 120 <= i && i < 180 ? (p = 0, d = a, u = l) : 180 <= i && i < 240 ? (p = 0, d = l, u = a) : 240 <= i && i < 300 ? (p = l, d = 0, u = a) : (p = a, d = 0, u = l), Ue((p + c) * 255, (d + c) * 255, (u + c) * 255);
  }
  function Y2(i, t) {
    const o = re(i);
    if (!o) return i;
    const a = Math.max(0, Math.min(1, o.l + t));
    return Le(o.h, o.s, a);
  }
  function P2(i) {
    const t = Ae(i);
    return t ? Ke(t) : 0;
  }
  function Ke(i) {
    const t = (o) => {
      const a = o / 255;
      return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * t(i.r) + 0.7152 * t(i.g) + 0.0722 * t(i.b);
  }
  function Ee(i, t) {
    const o = Math.max(i, t), a = Math.min(i, t);
    return (o + 0.05) / (a + 0.05);
  }
  function p2(i) {
    if (typeof i != "string") return null;
    let t = i.trim();
    return t ? (t.startsWith("#") || (t = `#${t}`), /^#([0-9a-fA-F]{3})$/.test(t) && (t = `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}`), /^#([0-9a-fA-F]{6})$/.test(t) ? t.toLowerCase() : null) : null;
  }
  function Je() {
    var o;
    const i = [], t = (o = window.LGraphCanvas) == null ? void 0 : o.node_colors;
    if (t)
      for (const a of Object.keys(t)) {
        const l = t[a], c = (l == null ? void 0 : l.bgcolor) || (l == null ? void 0 : l.color) || (l == null ? void 0 : l.groupcolor), p = p2(c);
        if (p && !i.includes(p) && i.push(p), i.length >= E2) break;
      }
    return i.length || Q2.forEach((a) => {
      const l = p2(a);
      l && !i.includes(l) && i.length < E2 && i.push(l);
    }), i.slice(0, E2);
  }
  function Qe() {
    var i;
    try {
      const t = (i = window.localStorage) == null ? void 0 : i.getItem(de);
      if (t) {
        const o = JSON.parse(t);
        if (Array.isArray(o)) {
          const a = o.map((l) => p2(l)).filter((l) => !!l);
          if (a.length)
            return a.slice(0, E2);
        }
      }
    } catch {
    }
    return Je();
  }
  function e0(i) {
    var t;
    try {
      (t = window.localStorage) == null || t.setItem(de, JSON.stringify(i));
    } catch {
    }
  }
  function t0() {
    var i;
    try {
      const t = (i = window.localStorage) == null ? void 0 : i.getItem(fe);
      if (t) {
        const o = JSON.parse(t);
        if (Array.isArray(o)) {
          const a = o.map((l) => p2(l)).filter((l) => !!l);
          if (a.length)
            return a.slice(0, ee);
        }
      }
    } catch {
    }
    return [];
  }
  function i0(i) {
    var t;
    try {
      (t = window.localStorage) == null || t.setItem(fe, JSON.stringify(i));
    } catch {
    }
  }
  let _savedPage = 0;
  function _sortColorsByHue(colors) {
    return colors.map(c => {
      const hsl = re(c);
      if (!hsl) return { hex: c, h: 0, s: 0, l: 0 };
      return { hex: c, h: hsl.h, s: hsl.s, l: hsl.l };
    }).sort((a, b) => {
      const aGrey = a.s < 0.12, bGrey = b.s < 0.12;
      if (aGrey && !bGrey) return 1;
      if (!aGrey && bGrey) return -1;
      if (aGrey && bGrey) return a.l - b.l;
      const ba = Math.floor(a.h / 30), bb = Math.floor(b.h / 30);
      if (ba !== bb) return ba - bb;
      return a.l - b.l;
    }).map(x => x.hex);
  }
  function Me() {
    if (w2) {
      if (w2.replaceChildren(), !C2.length) {
        const i = document.createElement("span");
        i.className = "hk-saved-empty", i.textContent = "—", w2.appendChild(i);
        return;
      }
      const _perPage = 9;
      const _total = C2.length;
      const _maxPage = Math.max(0, Math.ceil(_total / _perPage) - 1);
      _savedPage = Math.min(_savedPage, _maxPage);
      const _start = _savedPage * _perPage;
      const _page = C2.slice(_start, _start + _perPage);
      _page.forEach((i) => {
        const t = ne(i);
        w2.appendChild(t);
      });
    }
  }
  function r0(i) {
    const t = p2(i);
    t && (C2 = [t, ...C2.filter((o) => o !== t)], C2.length > ee && (C2.length = ee), i0(C2), Me());
  }
  function Se() {
    M2 && (M2.replaceChildren(), f2.forEach((i) => {
      const t = ne(i);
      M2.appendChild(t);
    }));
  }
  function He(i) {
    const t = p2(i);
    if (!t || !c2) return;
    const o = v2(t);
    c2.style.setProperty("--hk-custom-preview-color", o.bgcolor), c2.style.background = `linear-gradient(90deg,
            ${o.color} 0%,
            ${o.color} 33%,
            ${o.bgcolor} 33%,
            ${o.bgcolor} 66%,
            ${o.groupcolor} 66%,
            ${o.groupcolor} 100%)`;
  }
  function Fe(i) {
    const t = p2(i);
    t && (W && (W.value = t), U && (U.value = t.toUpperCase()), He(t));
  }
  function o0(i) {
    const t = p2(i);
    t && (f2 = [t, ...f2.filter((o) => o !== t)], f2.length > E2 && (f2.length = E2), e0(f2), Se(), Fe(t));
  }
  function Be(i) {
    const t = p2(i);
      t && (oe(t, !0), _2());
  }
  function a0(i) {
    const t = P2(i), o = P2(We);
    let a = Ee(t, o);
    if (a >= ie) return i;
    const l = re(i);
    if (!l) return i;
    const c = t > o ? -1 : 1;
    let p = l.l, d = c > 0 ? 0.98 : 0.02, u = i, y = a;
    for (let x = 0; x < 12; x++) {
      const k = p + (d - p) * 0.5, N = Le(l.h, l.s, Math.max(0.02, Math.min(0.98, k))), X = P2(N), F = Ee(X, o);
      F >= ie ? (u = N, y = F, c > 0 ? p = k : d = k) : c > 0 ? d = k : p = k;
    }
    return y >= ie ? u : i;
  }
  function Ne(i, t, o, a = 6) {
    let l = t, c = 0;
    for (; Math.abs(P2(i) - P2(l)) < 0.08 && c < a; ) {
      const p = Y2(l, o);
      if (p === l) break;
      l = p, c += 1;
    }
    return l;
  }
  function v2(i) {
    const o = i.startsWith("#") ? i : `#${i}`;
    let a = o;
    const l = re(a);
    let c;
    if (l) {
      const _tgtL = l.l < 0.45 ? Math.min(0.92, l.l + 0.45) : Math.max(0.08, l.l - 0.45);
      c = Le(l.h, l.s, _tgtL);
    } else { c = Y2(a, -0.3); }
    let p = Y2(a, 0.15);
    p = Ne(a, p, 0.1);
    const _cHsl = re(c);
    const _tc = (_cHsl && _cHsl.l >= 0.5) ? "#000000" : "#FFFFFF";
    return {
      color: c,
      bgcolor: a,
      groupcolor: p,
      textcolor: _tc
    };
  }
  // ── Dual-track color option builder ──
  // When linked, behaves exactly like v2(hex).
  // When unlinked, uses stored _titleHex and _bodyHex independently.
  function _dualOpt(titleHex, bodyHex) {
    const _bhsl = re(bodyHex), _thsl = re(titleHex);
    let _gc = bodyHex;
    if (_bhsl) { _gc = Le(_bhsl.h, _bhsl.s, Math.max(0.02, Math.min(0.98, _bhsl.l + 0.15))); }
    _gc = Ne(bodyHex, _gc, 0.1);
    const _tc = (_thsl && _thsl.l >= 0.5) ? "#000000" : "#FFFFFF";
    return { color: titleHex, bgcolor: bodyHex, groupcolor: _gc, textcolor: _tc };
  }
  function _buildOpt(hex) {
    if (_dualLinked || !_titleHex || !_bodyHex) return v2(hex);
    if (_dualMode === "T") { _titleHex = hex; return _dualOpt(_titleHex, _bodyHex); }
    _bodyHex = hex; return _dualOpt(_titleHex, _bodyHex);
  }
  // ── SV + Hue picker ──
  function _hsvToHex(h, s, v) {
    const c = v * s, x = c * (1 - Math.abs(h / 60 % 2 - 1)), m = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return Ue((r + m) * 255, (g + m) * 255, (b + m) * 255);
  }
  function _hexToHsv(hex) {
    const t = Ae(hex); if (!t) return { h: 0, s: 1, v: 1 };
    const r = t.r / 255, g = t.g / 255, b = t.b / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0;
    if (d !== 0) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h = Math.round(h * 60); if (h < 0) h += 360; }
    return { h, s: mx === 0 ? 0 : d / mx, v: mx };
  }
  function _openSvPicker(anchorEl, onPick, onCommit) {
    _closeSvPicker();
    const pop = document.createElement("div");
    pop.className = "hk-sv-picker";
    const sz = 180, hb = 16, pad = 8;
    const totalW = sz + hb + pad + pad, totalH = sz + pad * 2 + 28;
    // Canvas: SV plane + hue bar
    const cv = document.createElement("canvas");
    cv.width = totalW; cv.height = totalH; cv.className = "hk-sv-canvas";
    const ctx = cv.getContext("2d");
    let curH = 0, curS = 1, curV = 1;
    // Init from current color
    const initHex = (U == null ? void 0 : U.value) || (W == null ? void 0 : W.value) || "#353535";
    const initHsv = _hexToHsv(p2(initHex) || "#353535");
    curH = initHsv.h; curS = initHsv.s; curV = initHsv.v;
    function drawPicker() {
      ctx.clearRect(0, 0, totalW, totalH);
      // SV plane
      const ox = pad, oy = pad;
      // Draw hue background
      ctx.fillStyle = _hsvToHex(curH, 1, 1);
      ctx.fillRect(ox, oy, sz, sz);
      // White gradient (left to right = saturation)
      const sg = ctx.createLinearGradient(ox, 0, ox + sz, 0);
      sg.addColorStop(0, "#ffffff"); sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sg; ctx.fillRect(ox, oy, sz, sz);
      // Black gradient (top to bottom = value)
      const vg = ctx.createLinearGradient(0, oy, 0, oy + sz);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "#000000");
      ctx.fillStyle = vg; ctx.fillRect(ox, oy, sz, sz);
      // Hue bar
      const hx = ox + sz + pad;
      const hg = ctx.createLinearGradient(0, oy, 0, oy + sz);
      for (let i = 0; i <= 6; i++) hg.addColorStop(i / 6, _hsvToHex(i * 60, 1, 1));
      ctx.fillStyle = hg; ctx.fillRect(hx, oy, hb, sz);
      // Hue indicator
      const hy = oy + (curH / 360) * sz;
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.strokeRect(hx - 1, hy - 2, hb + 2, 4);
      ctx.strokeStyle = "#000"; ctx.lineWidth = 1;
      ctx.strokeRect(hx - 1, hy - 2, hb + 2, 4);
      // SV indicator
      const sx = ox + curS * sz, sy = oy + (1 - curV) * sz;
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "#000"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.stroke();
      // Hex display
      const hex = _hsvToHex(curH, curS, curV);
      ctx.fillStyle = "rgba(26,29,36,0.9)";
      ctx.fillRect(pad, oy + sz + pad, totalW - pad * 2, 20);
      ctx.fillStyle = "#8BC3F3"; ctx.font = "bold 12px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(hex.toUpperCase(), totalW / 2, oy + sz + pad + 10);
    }
    let dragging = null;
    function ptr(e) {
      const rect = cv.getBoundingClientRect(), cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      if (dragging === "sv") {
        curS = Math.max(0, Math.min(1, (cx - pad) / sz));
        curV = Math.max(0, Math.min(1, 1 - (cy - pad) / sz));
      } else if (dragging === "hue") {
        curH = Math.max(0, Math.min(360, ((cy - pad) / sz) * 360));
      }
      const hex = _hsvToHex(curH, curS, curV);
      drawPicker();
      onPick(hex);
    }
    cv.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const rect = cv.getBoundingClientRect(), cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      if (cx >= pad && cx <= pad + sz && cy >= pad && cy <= pad + sz) dragging = "sv";
      else if (cx >= pad + sz + pad && cx <= pad + sz + pad + hb && cy >= pad && cy <= pad + sz) dragging = "hue";
      if (dragging) { cv.setPointerCapture(e.pointerId); ptr(e); }
    });
    cv.addEventListener("pointermove", (e) => { if (dragging) ptr(e); });
    cv.addEventListener("pointerup", (e) => {
      if (dragging) { const hex = _hsvToHex(curH, curS, curV); onCommit ? onCommit(hex) : null; dragging = null; }
    });
    cv.addEventListener("pointercancel", () => { dragging = null; });
    pop.appendChild(cv);
    // Position
    const ar = anchorEl.getBoundingClientRect();
    let px = ar.left, py = ar.bottom + 6;
    if (px + totalW > window.innerWidth - 10) px = window.innerWidth - totalW - 10;
    if (py + totalH > window.innerHeight - 10) py = ar.top - totalH - 6;
    pop.style.left = px + "px"; pop.style.top = py + "px";
    document.body.appendChild(pop);
    _svPicker = pop;
    drawPicker();
    // Close on outside click / Escape
    setTimeout(() => {
      document.addEventListener("pointerdown", _svOutside, !0);
      document.addEventListener("keydown", _svEsc, !0);
    }, 0);
  }
  function _svOutside(e) {
    if (_svPicker && !_svPicker.contains(e.target)) _closeSvPicker();
  }
  function _svEsc(e) { if (e.key === "Escape") _closeSvPicker(); }
  function _closeSvPicker() {
    if (_svPicker) { _svPicker.remove(); _svPicker = null; }
    document.removeEventListener("pointerdown", _svOutside, !0);
    document.removeEventListener("keydown", _svEsc, !0);
  }
  function oe(i, useDual) {
    var c, p, d;
    const t = [...A, ...L2];
    if (!t.length) {
      k2(_("selectToApply"), "warning");
      return;
    }
    _cPushUndo([...A], [...L2]);
    const o = useDual ? _buildOpt(i) : v2(i), a = /* @__PURE__ */ new Set();
    t.forEach((u) => {
      u != null && u.graph && a.add(u.graph);
    }), a.forEach((u) => {
      var y;
      return (y = u == null ? void 0 : u.beforeChange) == null ? void 0 : y.call(u);
    }), t.forEach((u) => {
      ae(u, o);
    }), a.forEach((u) => {
      var y;
      return (y = u == null ? void 0 : u.afterChange) == null ? void 0 : y.call(u);
    }), o0(o.bgcolor), Pe();
    const l = ((c = window.LGraphCanvas) == null ? void 0 : c.active_canvas) ?? ((p = window.app) == null ? void 0 : p.canvas);
    (d = l == null ? void 0 : l.setDirty) == null || d.call(l, !0, !0);
  }
  function ae(i, t) {
    var _isGroup = !("is_selected" in i) && ("selected" in i || (i == null ? void 0 : (_c = i.constructor) == null ? void 0 : _c.name) === "LGraphGroup");
    var _c;
    var _gc = t.groupcolor || t.bgcolor || t.color;
    if (typeof i.setColorOption == "function") {
      if (_isGroup) i.setColorOption({ color: _gc, bgcolor: _gc, groupcolor: _gc });
      else i.setColorOption(t);
    } else {
      if (_isGroup) i.color = _gc;
      else { i.color = t.color, i.bgcolor = t.bgcolor, i.groupcolor = t.groupcolor; }
    }
    if (t.textcolor !== undefined && !_isGroup) i.textcolor = t.textcolor;
  }
  function W2(i) {
    if (e2.active) return;
    e2.active = !0, e2.colorOption = i, e2.nodes.clear(), e2.groups.clear(), A.forEach((o) => {
      e2.nodes.set(o, {
        color: o.color,
        bgcolor: o.bgcolor,
        groupcolor: o.groupcolor,
        textcolor: o.textcolor
      });
    }), L2.forEach((o) => {
      e2.groups.set(o, {
        color: o.color
      });
    });
  }
  function se(i) {
    var o, a, l;
    A.forEach((c) => ae(c, i)), L2.forEach((c) => ae(c, i));
    const t = ((o = window.LGraphCanvas) == null ? void 0 : o.active_canvas) ?? ((a = window.app) == null ? void 0 : a.canvas);
    (l = t == null ? void 0 : t.setDirty) == null || l.call(t, !0, !0);
  }
  function _2() {
    var o, a, l;
    if (!e2.active) return;
    let i;
    for (const c of e2.nodes.values())
      if (c.bgcolor) {
        i = c.bgcolor;
        break;
      }
    if (!i) {
      for (const c of e2.groups.values())
        if (c.color) {
          i = c.color;
          break;
        }
    }
    e2.nodes.forEach((c, p) => {
      if (!p) return;
      if (typeof p.setColorOption == "function") {
        if (c.color === void 0 && c.bgcolor === void 0 && c.groupcolor === void 0) p.setColorOption(null);
        else p.setColorOption({ color: c.color, bgcolor: c.bgcolor, groupcolor: c.groupcolor });
      } else {
        if (c.color === void 0) delete p.color; else p.color = c.color;
        if (c.bgcolor === void 0) delete p.bgcolor; else p.bgcolor = c.bgcolor;
        if (c.groupcolor === void 0) delete p.groupcolor; else p.groupcolor = c.groupcolor;
      }
      if (c.textcolor === void 0) delete p.textcolor; else p.textcolor = c.textcolor;
    }), e2.groups.forEach((c, p) => {
      p && (typeof p.setColorOption == "function" ? c.color === void 0 ? p.setColorOption(null) : p.setColorOption({
        color: c.color,
        bgcolor: c.color,
        groupcolor: c.color
      }) : c.color === void 0 ? delete p.color : p.color = c.color);
    }), e2.active = !1, e2.colorOption = null;
    const t = ((o = window.LGraphCanvas) == null ? void 0 : o.active_canvas) ?? ((a = window.app) == null ? void 0 : a.canvas);
    (l = t == null ? void 0 : t.setDirty) == null || l.call(t, !0, !0);
  }
  function s0(i, t) {
    const o = (a) => {
      a == null || a.preventDefault(), _2(), D2 = !0, oe(t);
    };
    i.addEventListener("click", o), i.addEventListener("keydown", (a) => {
      (a.key === "Enter" || a.key === " ") && (a.preventDefault(), o());
    }), i.addEventListener("mouseenter", () => {
      if (D2) return;
      const a = v2(t);
      W2(a), se(a);
    }), i.addEventListener("focus", () => {
      const a = v2(t);
      W2(a), se(a);
    }), i.addEventListener("mouseleave", () => _2()), i.addEventListener("blur", () => _2());
  }
  function ne(i, t = !0) {
    const o = v2(i), a = o.bgcolor.toUpperCase(), l = document.createElement(t ? "button" : "div");
    return t && (l.type = "button", l.setAttribute("aria-label", `Apply color ${a}`), l.title = `Apply color ${a}`), l.className = "hk-color-chip hk-color-chip-dual", l.style.setProperty("--hk-chip-title", o.color), l.style.setProperty("--hk-chip-body", o.bgcolor), l.style.borderColor = o.color, l.dataset.colorHex = o.bgcolor, t && s0(l, i), l;
  }
  function le(i, t) {
    const _all = _allPalettes();
    if (!_all.length) return;
    const o = _all.length, a = (t % o + o) % o;
    o2 = a;
    const l = _all[a].map(c => c);
    const _sorted = _sortColorsByHue(l);
    i.replaceChildren(), _sorted.forEach((p) => {
      const d = ne(p);
      i.appendChild(d);
    }), i.setAttribute("aria-label", `Color harmony palette ${a + 1} of ${o}`);
    const c = H == null ? void 0 : H.querySelector(".hk-palette-select");
    c && (c.value = String(a)), Pe();
  }
  function Pe() {
    var o, a;
    if (!H) return;
    const i = (a = (o = e2.colorOption) == null ? void 0 : o.bgcolor) == null ? void 0 : a.toLowerCase();
    H.querySelectorAll(".hk-color-chip").forEach((l) => {
      var p;
      const c = (p = l.dataset.colorHex) == null ? void 0 : p.toLowerCase();
      l.classList.toggle("selected", !!c && !!i && c === i);
    });
  }
  let F2 = !1, v = null, ce = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let _dualMode = "B", _dualLinked = !0, _titleHex = null, _bodyHex = null, _colorClip = null, _svPicker = null;
  let _clipBtns = { mainCopy: null, mainPaste: null, quickCopy: null, quickPaste: null };
  let _grpPreviewCbs = [];
  function _updateClipUI() {
    const _hex = _colorClip ? (_colorClip.bgcolor || _colorClip.color || null) : null;
    Object.values(_clipBtns).forEach((btn) => {
      if (!btn) return;
      btn.classList.toggle("has-clip", !!_colorClip);
      if (_hex && (btn.classList.contains("hk-paste-btn") || btn.classList.contains("hk-quick-paste"))) {
        let ind = btn.querySelector(".hk-clip-indicator");
        if (!ind) { ind = document.createElement("div"); ind.className = "hk-clip-indicator"; btn.appendChild(ind); }
        ind.style.background = _hex;
      }
    });
    _grpPreviewCbs.forEach((cb) => { try { cb(); } catch (e) {} });
  }
  document.addEventListener("mousemove", (i) => {
    ce.x = i.clientX, ce.y = i.clientY;
  });
  function n0() {
    if (!T) return;
    S2(), F2 = !0;
    const i = T.offsetWidth || 280, t = T.offsetHeight || 500;
    let o = ce.x - i / 2, a = ce.y - t / 2;
    const l = 20;
    o = Math.max(l, Math.min(o, window.innerWidth - i - l)), a = Math.max(l, Math.min(a, window.innerHeight - t - l)), T.style.left = o + "px", T.style.top = a + "px", T.style.transform = "", T.classList.add("visible"), v && v.classList.add("hidden");
    const c = document.querySelector(".hk-quick-color-popup");
    c && c.classList.remove("visible");
    const p = document.querySelector(".hk-align-popup");
    p && p.classList.remove("visible");
    const d = document.querySelector(".hk-float-hint");
    d && d.classList.remove("visible"), setTimeout(() => {
      H == null || H.focus();
    }, 0);
  }
  function l0() {
    if (!T) return;
    F2 = !1, T.classList.remove("visible");
    const i = document.querySelector(".hk-dblclose-hint");
    i && i.classList.remove("visible"), v && v.classList.remove("hidden");
    const q = document.querySelector(".hk-quick-color-popup");
    q && q.classList.remove("visible");
    const a = document.querySelector(".hk-align-popup");
    a && a.classList.remove("visible");
  }
  function pe(i) {
    (typeof i === "boolean" ? i : !F2) ? n0() : l0();
  }
  function c0() {
    var i;
    try {
      const t = (i = window.localStorage) == null ? void 0 : i.getItem("hk-user-icon");
      t && (U2 = t);
    } catch {
    }
  }
  function p0(i) {
    var t;
    try {
      (t = window.localStorage) == null || t.setItem("hk-user-icon", i), U2 = i;
    } catch {
    }
  }
  function h0() {
    const i = document.createElement("input");
    return i.type = "file", i.accept = "image/*", i.style.display = "none", i.addEventListener("change", (t) => {
      const o = t.target;
      if (o.files && o.files[0]) {
        const a = new FileReader();
        a.onload = (l) => {
          var p;
          const c = (p = l.target) == null ? void 0 : p.result;
          c && (p0(c), u0());
        }, a.readAsDataURL(o.files[0]);
      }
    }), i;
  }
  function u0() {
    if (!v) return;
    const i = v.querySelector("img");
    i && (i.src = U2 || he);
  }
  function d0() {
    var M;
    if (v) return;
    v = document.createElement("div"), v.className = "hk-floating-btn", v.style.right = "24px", v.style.bottom = "24px";
    const i = document.createElement("img");
    i.src = U2 || he, i.alt = "", i.draggable = !1, v.appendChild(i), v.addEventListener("click", (m) => {
      if (m.stopPropagation(), a) {
        a = !1;
        return;
      }
      pe();
    }), v.addEventListener("contextmenu", (m) => {
      m.preventDefault(), m.stopPropagation(), !F2 && (Z.classList.contains("visible") ? Y() : L());
    }, !0);
    let t = !1, o = !1, a = !1, l = 0, c = 0, p = 0, d = 0, u = 0;
    const y = 4, x = (m) => {
      if (!o || !v) return;
      const C = m.clientX - l, z = m.clientY - c;
      if (!t) {
        if (Math.abs(C) < y && Math.abs(z) < y)
          return;
        t = !0, a = !0, window.__hkFloatingDrag = !0, v.style.cursor = "grabbing", v.style.transition = "none", F && (window.clearTimeout(F), F = void 0), N.classList.remove("visible"), V(), Z.classList.remove("visible"), ze();
      }
      u || (u = requestAnimationFrame(() => {
        if (u = 0, !v) return;
        let P = p + (m.clientX - l), j = d + (m.clientY - c);
        const R = 48;
        P = Math.max(10, Math.min(P, window.innerWidth - R - 10)), j = Math.max(10, Math.min(j, window.innerHeight - R - 10)), v.style.left = P + "px", v.style.top = j + "px", v.style.right = "auto", v.style.bottom = "auto";
      }));
    }, k = (m) => {
      var C;
      if (v) {
        if (t) {
          m.stopPropagation(), m.preventDefault(), v.style.transition = "";
          try {
            const z = v.getBoundingClientRect();
            (C = window.localStorage) == null || C.setItem(
              "hk-float-btn-pos",
              JSON.stringify({ left: z.left, top: z.top })
            );
          } catch {
          }
          F && (window.clearTimeout(F), F = void 0), v.matches(":hover") && (F = window.setTimeout(S, 120));
        }
        o = !1, t = !1, window.__hkFloatingDrag = !1, v.style.cursor = "pointer";
      }
    };
    v.addEventListener("mousedown", (m) => {
      if (m.button !== 0) return;
      o = !0, t = !1, F && (window.clearTimeout(F), F = void 0), i2 && (window.clearTimeout(i2), i2 = void 0), l = m.clientX, c = m.clientY;
      const C = v.getBoundingClientRect();
      p = C.left, d = C.top, m.preventDefault();
    }), document.addEventListener("mousemove", x), document.addEventListener("mouseup", k);
    try {
      const m = (M = window.localStorage) == null ? void 0 : M.getItem("hk-float-btn-pos");
      if (m) {
        const C = JSON.parse(m);
        if (C.left != null && C.top != null) {
          const _R = 48;
          let _cl = Math.max(10, Math.min(C.left, window.innerWidth - _R - 10));
          let _ct = Math.max(10, Math.min(C.top, window.innerHeight - _R - 10));
          v.style.left = _cl + "px", v.style.top = _ct + "px", v.style.right = "auto", v.style.bottom = "auto";
        }
      }
    } catch {
    }
    window.addEventListener("resize", () => {
      if (!v) return;
      if (v.style.left === "" || v.style.top === "") return;
      const _R = 48;
      const _vw = Math.max(window.innerWidth, _R + 20);
      const _vh = Math.max(window.innerHeight, _R + 20);
      let _origLeft = parseFloat(v.style.left);
      let _origTop = parseFloat(v.style.top);
      try {
        const _saved = JSON.parse(window.localStorage.getItem("hk-float-btn-pos") || "{}");
        if (_saved.left != null) _origLeft = _saved.left;
        if (_saved.top != null) _origTop = _saved.top;
      } catch {
      }
      let _cl = Math.max(10, Math.min(_origLeft, _vw - _R - 10));
      let _ct = Math.max(10, Math.min(_origTop, _vh - _R - 10));
      v.style.left = _cl + "px", v.style.top = _ct + "px";
    });
    document.body.appendChild(v);
    const N = document.createElement("div");
    N.className = "hk-quick-color-popup", document.body.appendChild(N);
    let X, F, f = "right";
    const w = () => {
      N.replaceChildren();
      const _grid = document.createElement("div");
      _grid.className = "hk-quick-grid";
      const _colors = (f2.length ? f2 : Q2).slice(0, 9);
      _colors.forEach((C, idx) => {
        if (idx === 4) {
          const z = document.createElement("button");
          z.type = "button", z.className = "hk-quick-random", z.innerHTML = "&#127922;", z.title = _("randomColor"), z.setAttribute("aria-label", _("randomColor")), z.addEventListener("click", (P) => {
            P.stopPropagation(), _2();
            const E = Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0"), hex = `#${E}`;
            oe(hex), w();
          }), _grid.appendChild(z);
        } else {
          const z = document.createElement("button");
          const _o = v2(C);
          z.type = "button", z.className = "hk-quick-chip", z.style.background = `linear-gradient(to bottom, ${_o.color} 0%, ${_o.color} 38%, ${_o.bgcolor} 38%, ${_o.bgcolor} 100%)`, z.style.borderColor = _o.color, z.title = C, z.setAttribute("aria-label", C), z.addEventListener("mouseenter", () => {
            if (!A.length && !L2.length) return;
            const _o = v2(C);
            W2(_o), se(_o);
          }), z.addEventListener("mouseleave", () => _2()), z.addEventListener("click", (P) => {
            P.stopPropagation(), _2(), oe(C);
          }), _grid.appendChild(z);
        }
      });
      N.appendChild(_grid);
      const _bar = document.createElement("div");
      _bar.className = "hk-quick-actionbar";
      const _pick = document.createElement("button");
      _pick.type = "button", _pick.className = "hk-quick-pick", _pick.innerHTML = "\u{1F4A7}", _pick.title = _("pickColor"), _pick.setAttribute("aria-label", _("pickColor")), _pick.addEventListener("click", (P) => {
        P.stopPropagation(), _2();
        if (!A.length && !L2.length) { k2(_("selectToApply"), "warning"); return; }
        let raw = null;
        for (const n of A) { if (n && n.bgcolor) { raw = n.bgcolor; break; } if (n && n.color) { raw = n.color; break; } }
        if (!raw) for (const g of L2) { if (g && g.color) { raw = g.color; break; } }
        if (!raw) { k2(_("noNodeColor"), "info"); return; }
        const hex = p2(raw);
        if (!hex) { k2(_("noNodeColor"), "info"); return; }
        o0(hex), k2(_("pickColor") + " \u2713", "success"), w();
      }), _bar.appendChild(_pick);
      const _qCopy = document.createElement("button");
      _qCopy.type = "button", _qCopy.className = "hk-quick-copy", _qCopy.innerHTML = "\u{1F4CB}", _qCopy.title = _("copyColor"), _qCopy.setAttribute("aria-label", _("copyColor")), _qCopy.addEventListener("click", (P) => {
        P.stopPropagation(), _2();
        if (!A.length && !L2.length) { k2(_("selectToApply"), "warning"); return; }
        let raw = null;
        for (const n of A) { if (n) { raw = { color: n.color, bgcolor: n.bgcolor, groupcolor: n.groupcolor, textcolor: n.textcolor }; break; } }
        if (!raw) for (const g of L2) { if (g && g.color) { raw = { color: g.color, bgcolor: g.color, groupcolor: g.color, textcolor: void 0 }; break; } }
        if (raw) { _colorClip = raw, k2(_("copyColor") + " ✓", "success"); _clipBtns.quickCopy = _qCopy; _clipBtns.quickPaste = _qPaste; _updateClipUI(); _qCopy.classList.add("clip-flash"); setTimeout(() => _qCopy.classList.remove("clip-flash"), 600); } else k2(_("noNodeColor"), "info");
      }), _bar.appendChild(_qCopy);
      const _qPaste = document.createElement("button");
      _qPaste.type = "button", _qPaste.className = "hk-quick-paste", _qPaste.innerHTML = "\u{1F4E5}", _qPaste.title = _("pasteColor"), _qPaste.setAttribute("aria-label", _("pasteColor")), _qPaste.addEventListener("click", (P) => {
        P.stopPropagation(), _2();
        if (!_colorClip) { k2(_("noColorClip"), "info"); return; }
        if (!A.length && !L2.length) { k2(_("selectToApply"), "warning"); return; }
        _cPushUndo([...A], [...L2]);
        const t = [...A, ...L2], a = /* @__PURE__ */ new Set();
        t.forEach((u) => { u != null && u.graph && a.add(u.graph); }), a.forEach((u) => { var y; return (y = u == null ? void 0 : u.beforeChange) == null ? void 0 : y.call(u); }), t.forEach((u) => { ae(u, _colorClip); }), a.forEach((u) => { var y; return (y = u == null ? void 0 : u.afterChange) == null ? void 0 : y.call(u); }), Pe();
        { const _l = (window.LGraphCanvas == null ? void 0 : window.LGraphCanvas.active_canvas) ?? (window.app == null ? void 0 : window.app.canvas); _l == null ? void 0 : _l.setDirty == null ? void 0 : _l.setDirty.call(_l, !0, !0); }
        k2(_("pasteColor") + " ✓", "success"), w();
      }), _bar.appendChild(_qPaste), N.appendChild(_bar);
      _clipBtns.quickCopy = _qCopy; _clipBtns.quickPaste = _qPaste; _updateClipUI();
    }, s = () => {
      if (!v) return;
      const m = v.getBoundingClientRect(), C = 3 * 28 + 2 * 5 + 16, z = 3 * 28 + 2 * 5 + 16 + 26 + 5 + 8, P = 12, j = m.right + P + C < window.innerWidth;
      let R;
      j ? (R = m.right + P, N.classList.remove("left-side"), N.classList.add("right-side"), f = "right") : (R = m.left - P - C, N.classList.remove("right-side"), N.classList.add("left-side"), f = "left");
      let Q = m.top + m.height / 2 - z / 2;
      Q = Math.max(10, Math.min(Q, window.innerHeight - z - 10)), N.style.left = R + "px", N.style.top = Q + "px";
    }, S = () => {
      F2 || t || o || (w(), s(), N.classList.add("visible"));
    }, O = () => {
      N.classList.remove("visible");
    };
    v.addEventListener("mouseenter", () => {
      X && (window.clearTimeout(X), X = void 0), F = window.setTimeout(S, 200);
    }), v.addEventListener("mouseleave", () => {
      F && (window.clearTimeout(F), F = void 0), X = window.setTimeout(() => {
        O();
      }, 250);
    }), N.addEventListener("mouseenter", () => {
      X && (window.clearTimeout(X), X = void 0);
    }), N.addEventListener("mouseleave", () => {
      X = window.setTimeout(() => {
        O();
      }, 200);
    });
    const J = document.createElement("div");
    J.className = "hk-float-hint", document.body.appendChild(J);
    let i2, G, $ = !1;
    const g = () => {
      if ($) return;
      $ = !0, [
        { key: _("floatHintLeft"), desc: _("floatHintOpen") },
        { key: _("floatHintRight"), desc: _("floatHintAlign") }
      ].forEach((C) => {
        const z = document.createElement("div");
        z.className = "hk-float-hint-row";
        const P = document.createElement("span");
        P.className = "hk-float-hint-key", P.textContent = C.key;
        const j = document.createElement("span");
        j.className = "hk-float-hint-desc", j.textContent = C.desc, z.appendChild(P), z.appendChild(j), J.appendChild(z);
      });
    }, B = () => {
      if (!v) return;
      const m = v.getBoundingClientRect(), C = J.offsetWidth || 140, z = J.offsetHeight || 50, P = 10, j = f === "left", R = m.right + P + C < window.innerWidth, Q = m.left - P - C > 0;
      let l2;
      j && R ? l2 = m.right + P : !j && Q ? l2 = m.left - P - C : R ? l2 = m.right + P : l2 = m.left - P - C;
      let u2 = m.top + m.height / 2 - z / 2;
      u2 = Math.max(10, Math.min(u2, window.innerHeight - z - 10)), J.style.left = l2 + "px", J.style.top = u2 + "px";
    }, K = () => {
      F2 || t || (g(), B(), J.classList.add("visible"));
    }, V = () => {
      J.classList.remove("visible");
    };
    K2 = () => {
      $ && (J.replaceChildren(), $ = !1, g(), B());
    }, v.addEventListener("mouseenter", () => {
      G && (window.clearTimeout(G), G = void 0), i2 = window.setTimeout(K, 350);
    }), v.addEventListener("mouseleave", () => {
      i2 && (window.clearTimeout(i2), i2 = void 0), G = window.setTimeout(() => {
        V();
      }, 150);
    });
    const Z = document.createElement("div");
    Z.className = "hk-align-popup", document.body.appendChild(Z);
    let a2 = !1;
    const r2 = () => {
      if (a2) return;
      a2 = !0, [
        { title: _("basicAlignment"), buttons: xe, group: "basic" },
        { title: _("sizeAdjustment"), buttons: Ce, group: "size" },
        { title: _("flowAlignment"), buttons: we, group: "flow" }
      ].forEach((C) => {
        const z = document.createElement("div");
        z.className = "hk-align-popup-title", z.textContent = C.title, Z.appendChild(z), Z.appendChild(Z2(C.buttons, C.group));
      });
      const _grpDiv = document.createElement("div");
      _grpDiv.className = "hk-align-popup-divider", Z.appendChild(_grpDiv);
      const _grpTitle = document.createElement("div");
      _grpTitle.className = "hk-align-popup-title", _grpTitle.textContent = _("groupSection"), Z.appendChild(_grpTitle);
      const _grpBtn = document.createElement("button");
      _grpBtn.type = "button", _grpBtn.className = "hk-create-group-btn", _grpBtn.dataset.alignmentType = "create-group";
      _grpBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg><span class="hk-grp-label">' + _("createGroup") + '</span><span class="hk-grp-color-dot"></span>';
      _grpBtn.setAttribute("aria-label", _("createGroup"));
      const _grpDot = _grpBtn.querySelector(".hk-grp-color-dot");
      const _grpUpdatePreview = () => {
        const _hex = _colorClip ? (_colorClip.groupcolor || _colorClip.bgcolor || _colorClip.color || null) : (f2.length > 0 && f2[0] ? f2[0] : null);
        if (_hex && _grpDot) { _grpDot.style.background = _hex; _grpDot.style.display = ""; }
        else if (_grpDot) { _grpDot.style.display = "none"; }
      };
      _grpUpdatePreview();
      _grpPreviewCbs.push(_grpUpdatePreview);
      _grpBtn.addEventListener("mouseenter", () => { Ge(_grpBtn, _("createGroup")); _grpUpdatePreview(); });
      _grpBtn.addEventListener("mouseleave", () => { ze(); });
      _grpBtn.addEventListener("click", () => {
        ze(), Y();
        const _grp = window.HkGroups && window.HkGroups.createGroupFromSelection && window.HkGroups.createGroupFromSelection();
        if (_grp) {
          let _colorOpt = null;
          if (_colorClip) {
            _colorOpt = _colorClip;
          } else if (f2.length > 0 && f2[0]) {
            _colorOpt = _buildOpt(f2[0]);
          }
          if (_colorOpt && A.length > 0) {
            const _graphs = /* @__PURE__ */ new Set();
            A.forEach((u) => { u != null && u.graph && _graphs.add(u.graph); });
            _graphs.forEach((u) => { var y; return (y = u == null ? void 0 : u.beforeChange) == null ? void 0 : y.call(u); });
            A.forEach((u) => { ae(u, _colorOpt); });
            _graphs.forEach((u) => { var y; return (y = u == null ? void 0 : u.afterChange) == null ? void 0 : y.call(u); });
            _grp.color = _colorOpt.groupcolor || _colorOpt.bgcolor || _colorOpt.color;
            const _l = (window.LGraphCanvas == null ? void 0 : window.LGraphCanvas.active_canvas) ?? (window.app == null ? void 0 : window.app.canvas);
            _l == null || _l.setDirty == null || _l.setDirty.call(_l, !0, !0);
          }
          k2(_("groupCreated") + " \u2713", "success");
        } else k2(_("selectToGroup"), "warning");
      }), Z.appendChild(_grpBtn);
      const _fsRow = document.createElement("div");
      _fsRow.className = "hk-grp-font-row";
      const _fsLabel = document.createElement("span");
      _fsLabel.className = "hk-grp-font-label", _fsLabel.textContent = _("groupFontSize"), _fsLabel.setAttribute("data-i18n", "groupFontSize");
      const _fsSlider = document.createElement("input");
      _fsSlider.type = "range", _fsSlider.className = "hk-grp-font-slider", _fsSlider.min = "10", _fsSlider.max = "300", _fsSlider.step = "1";
      _fsSlider.value = (window.HkGroups && window.HkGroups.getGroupFontSize && window.HkGroups.getGroupFontSize()) || 20;
      const _fsVal = document.createElement("input");
      _fsVal.type = "number", _fsVal.className = "hk-grp-font-val", _fsVal.value = _fsSlider.value, _fsVal.min = "10", _fsVal.max = "300";
      _fsSlider.addEventListener("input", () => {
        _fsVal.value = _fsSlider.value;
        if (window.HkGroups && window.HkGroups.setGroupFontSize) {
          window.HkGroups.setGroupFontSize(parseInt(_fsSlider.value, 10));
        }
      });
      _fsVal.addEventListener("input", () => {
        let _n = parseInt(_fsVal.value, 10);
        if (isNaN(_n)) return;
        _n = Math.max(10, Math.min(300, _n));
        _fsSlider.value = _n;
        if (window.HkGroups && window.HkGroups.setGroupFontSize) {
          window.HkGroups.setGroupFontSize(_n);
        }
      });
      _fsVal.addEventListener("blur", () => {
        let _n = parseInt(_fsVal.value, 10);
        if (isNaN(_n)) _n = 20;
        _n = Math.max(10, Math.min(300, _n));
        _fsVal.value = _n;
      });
      _fsVal.addEventListener("mousedown", (e) => { e.stopPropagation(); });
      _fsVal.addEventListener("pointerdown", (e) => { e.stopPropagation(); });
      _fsSlider.addEventListener("mouseenter", () => { Ge(_fsSlider, _("groupFontSize")); });
      _fsSlider.addEventListener("mouseleave", () => { ze(); });
      _fsSlider.addEventListener("mousedown", (e) => { e.stopPropagation(); });
      _fsSlider.addEventListener("pointerdown", (e) => { e.stopPropagation(); });
      _fsRow.appendChild(_fsLabel), _fsRow.appendChild(_fsSlider), _fsRow.appendChild(_fsVal), Z.appendChild(_fsRow);
    }, h2 = () => {
      if (!v) return;
      const m = v.getBoundingClientRect(), C = 220, z = 12, P = m.right + z + C < window.innerWidth;
      let j;
      P ? (j = m.right + z, Z.classList.remove("left-side")) : (j = m.left - z - C, Z.classList.add("left-side"));
      const R = Z.offsetHeight || 280;
      let Q = m.top + m.height / 2 - R / 2;
      Q = Math.max(10, Math.min(Q, window.innerHeight - R - 10)), Z.style.left = j + "px", Z.style.top = Q + "px";
    }, r = () => {
      var R;
      const m = (R = window.app) == null ? void 0 : R.graph, z = (m ? Object.values(m._nodes || {}) : []).filter((Q) => Q && Q.is_selected), P = z.length > 1;
      Z.querySelectorAll(".hk-button").forEach((Q) => {
        const l2 = Q.dataset.alignmentType === "size-min";
        Q.disabled = l2 ? z.length < 1 : !P;
      });
      const _gBtn = Z.querySelector(".hk-create-group-btn");
      if (_gBtn) _gBtn.disabled = z.length < 1;
      const _fs = Z.querySelector(".hk-grp-font-slider");
      if (_fs && window.HkGroups && window.HkGroups.getGroupFontSize) {
        const _v2 = window.HkGroups.getGroupFontSize();
        _fs.value = _v2;
        const _fv = Z.querySelector(".hk-grp-font-val");
        if (_fv) _fv.value = _v2;
      }
    }, L = () => {
      r2(), r(), h2(), N.classList.remove("visible"), F && (window.clearTimeout(F), F = void 0), Z.offsetWidth, requestAnimationFrame(() => {
        Z.classList.add("visible");
      });
    }, Y = () => {
      Z.classList.remove("visible"), ze();
    };
    document.addEventListener("mousedown", (m) => {
      if (!Z.classList.contains("visible")) return;
      const C = m.target;
      C === Z || Z.contains(C) || v && (C === v || v.contains(C)) || Y();
    }, !0), document.addEventListener("keydown", (m) => {
      if (m.key === "Escape" && Z.classList.contains("visible")) {
        const _fsInp = Z.querySelector(".hk-grp-font-val");
        if (_fsInp && _fsInp === document.activeElement) { _fsInp.blur(); return; }
        Y();
      }
    }), Z.addEventListener("mouseleave", () => {
      if (Z.classList.contains("visible")) {
        const _fsInp = Z.querySelector(".hk-grp-font-val");
        if (_fsInp && _fsInp === document.activeElement) return;
        Y();
      }
    });
  }
  function f0() {
    if (H) return;
    c0(), x2 = De(), T = document.createElement("div"), T.className = "hk-wrapper";
    const i = h0();
    i.id = "hk-icon-upload", document.body.appendChild(i), d0();
    let t = !1, o = 0, a = 0, l = 0, c = 0, _pRAF = 0;
    const p = (n, h) => {
      var E;
      try {
        (E = window.localStorage) == null || E.setItem("hk-position", JSON.stringify({ left: n, top: h }));
      } catch {
      }
    }, d = (n) => {
      if (!T) return;
      const h = n.target;
      if (h.closest("button") || h.closest("input") || h.closest("select"))
        return;
      t = !0, o = n.clientX, a = n.clientY;
      const E = T.getBoundingClientRect();
      l = E.left, c = E.top, T.style.cursor = "grabbing", n.preventDefault();
    }, u = (n) => {
      if (!t || !T) return;
      if (_pRAF) return;
      const h = n.clientX - o, E = n.clientY - a;
      let q = l + h, b = c + E;
      const D = T.getBoundingClientRect();
      q = Math.max(10, Math.min(q, window.innerWidth - D.width - 10)), b = Math.max(10, Math.min(b, window.innerHeight - D.height - 10));
      _pRAF = requestAnimationFrame(() => {
        _pRAF = 0;
        if (!t || !T) return;
        T.style.left = q + "px", T.style.top = b + "px";
      });
    }, y = () => {
      if (!t || !T) return;
      t = !1, T.style.cursor = "default";
      const n = T.getBoundingClientRect();
      p(n.left, n.top);
    };
    H = document.createElement("div"), H.className = "hk-panel", H.setAttribute("role", "region"), H.setAttribute("aria-label", "Node Alignment alignment tools"), H.tabIndex = -1, H.addEventListener("mousemove", () => {
      if (D2) { D2 = !1; }
    }), H.addEventListener("dblclick", (n) => {
      const h = n.target;
      h.closest("button") || h.closest("input") || h.closest("select") || h.closest("label") || h.classList.contains("hk-color-chip") || h.closest(".hk-color-chip") || pe(!1);
    });
    const x = document.createElement("div");
    x.className = "hk-dblclose-hint", x.setAttribute("data-i18n", "dblclickClose"), x.textContent = _("dblclickClose"), document.body.appendChild(x);
    let hintShowT, hintHideT;
    const N = (n) => { const _el = n.closest ? n : (n.target || n); if (!_el || !_el.closest) return !1; return !!_el.closest(".hk-header"); }, X = (n) => {
      const h = n.target;
      !h || !N(h) || (hintHideT && (window.clearTimeout(hintHideT), hintHideT = void 0), hintShowT && window.clearTimeout(hintShowT), hintShowT = window.setTimeout(() => {
        hintShowT = void 0, x.style.transition = "none", x.classList.remove("visible"), x.offsetWidth, x.style.transition = "", x.textContent = _("dblclickClose");
        const E = x.offsetWidth || 120, q = x.offsetHeight || 24;
        let b = n.clientX + 12, D = n.clientY + 14;
        b = Math.max(6, Math.min(b, window.innerWidth - E - 6)), D = Math.max(6, Math.min(D, window.innerHeight - q - 6)), x.style.left = b + "px", x.style.top = D + "px", requestAnimationFrame(() => {
          x.classList.add("visible");
        });
      }, 500));
    }, F = () => {
      hintShowT && (window.clearTimeout(hintShowT), hintShowT = void 0), hintHideT && window.clearTimeout(hintHideT), hintHideT = window.setTimeout(() => {
        hintHideT = void 0, x.classList.remove("visible");
      }, 500);
    };
    H.addEventListener("mousemove", X), H.addEventListener("mouseleave", F);
    const f = document.createElement("div");
    f.className = "hk-content";
    const w = document.createElement("div");
    w.className = "hk-header", w.style.cursor = "move", w.addEventListener("mousedown", d), document.addEventListener("mousemove", u), document.addEventListener("mouseup", y);
    const s = document.createElement("div");
    s.className = "hk-header-title", s.style.pointerEvents = "none";
    const S = document.createElement("img");
    S.src = he, S.alt = "", S.draggable = !1, s.appendChild(S);
    const O = document.createElement("span");
    O.textContent = _("title"), O.setAttribute("data-i18n", "title"), s.appendChild(O), d2 = document.createElement("button"), d2.type = "button", d2.className = "hk-lang-toggle", d2.setAttribute("aria-label", "Switch language"), d2.textContent = _("langLabel"), d2.addEventListener("click", () => {
      x2 = x2 === "en" ? "zh" : "en", Te(x2), Ie();
    }), w.appendChild(s);
    const J = document.createElement("div");
    J.className = "hk-header-actions";
    const _vramBtn = document.createElement("button");
    _vramBtn.type = "button", _vramBtn.className = "hk-vram-btn", _vramBtn.innerHTML = '<span class="hk-vram-emoji">\u{1F9F9}</span>', _vramBtn.setAttribute("aria-label", _("clearVram")), _vramBtn.title = _("clearVram"), _vramBtn.setAttribute("data-i18n-label", "clearVram"), _vramBtn.addEventListener("click", () => {
      _vramBtn.classList.add("hk-vram-sweeping"), _freeVram(), setTimeout(() => _vramBtn.classList.remove("hk-vram-sweeping"), 900);
    }), J.appendChild(_vramBtn), J.appendChild(d2), w.appendChild(J);
    const i2 = document.createElement("div");
    i2.className = "hk-divider";
    const G = ke();
    G.classList.add("hk-section-primary"), G.appendChild(H2(_("basicAlignment"), "basicAlignment")), G.appendChild(Z2(xe, "basic")), G.appendChild(H2(_("sizeAdjustment"), "sizeAdjustment")), G.appendChild(Z2(Ce, "size")), G.appendChild(H2(_("flowAlignment"), "flowAlignment")), G.appendChild(Z2(we, "flow"));
    const _gapRow = document.createElement("div");
    _gapRow.className = "hk-spacing-row", _gapRow.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin-top:8px;padding:0 4px";
    const _gapLabel = document.createElement("span");
    _gapLabel.className = "hk-spacing-label", _gapLabel.textContent = _("alignGap"), _gapLabel.setAttribute("data-i18n", "alignGap");
    const _gapInput = document.createElement("input");
    _gapInput.type = "number", _gapInput.min = "0", _gapInput.max = "200", _gapInput.value = _alignGap, _gapInput.className = "hk-spacing-input", _gapInput.style.cssText = "width:50px;padding:2px 4px;border:1px solid #444;border-radius:4px;background:#222;color:#eee;font-size:11px", _gapInput.addEventListener("change", () => {
      const gapVal = parseInt(_gapInput.value);
      if (!isNaN(gapVal) && gapVal >= 0 && gapVal <= 200) {
        _alignGap = gapVal;
        try { localStorage.setItem("hk-align-gap", String(gapVal)); } catch {}
      } else {
        _gapInput.value = _alignGap;
      }
    }), _gapRow.appendChild(_gapLabel), _gapRow.appendChild(_gapInput);
    _hkUndoBtn = document.createElement("button");
    _hkUndoBtn.type = "button", _hkUndoBtn.className = "hk-undo-redo-btn", _hkUndoBtn.innerHTML = "\u21B6", _hkUndoBtn.title = _("undo"), _hkUndoBtn.setAttribute("aria-label", _("undo")), _hkUndoBtn.setAttribute("data-i18n-label", "undo"), _hkUndoBtn.disabled = !0, _hkUndoBtn.addEventListener("click", () => _hkUndo()), _gapRow.appendChild(_hkUndoBtn);
    _hkRedoBtn = document.createElement("button");
    _hkRedoBtn.type = "button", _hkRedoBtn.className = "hk-undo-redo-btn", _hkRedoBtn.innerHTML = "\u21B7", _hkRedoBtn.title = _("redo"), _hkRedoBtn.setAttribute("aria-label", _("redo")), _hkRedoBtn.setAttribute("data-i18n-label", "redo"), _hkRedoBtn.disabled = !0, _hkRedoBtn.addEventListener("click", () => _hkRedo()), _gapRow.appendChild(_hkRedoBtn);
    const _snapLabel = document.createElement("span");
    _snapLabel.className = "hk-spacing-label", _snapLabel.textContent = _("snapDistance"), _snapLabel.setAttribute("data-i18n", "snapDistance"), _snapLabel.style.cssText = "margin-left:auto;min-width:fit-content";
    const _snapInput = document.createElement("input");
    _snapInput.type = "number", _snapInput.min = "4", _snapInput.max = "16", _snapInput.step = "1", _snapInput.className = "hk-spacing-input", _snapInput.style.cssText = "width:40px;padding:2px 4px;border:1px solid #444;border-radius:4px;background:#222;color:#eee;font-size:11px";
    if (window.HkSnap) { _snapInput.value = window.HkSnap.getSnapDist(); }
    else { _snapInput.value = 8; }
    _snapInput.title = _("snapDistance"), _snapInput.setAttribute("aria-label", _("snapDistance"));
    _snapInput.addEventListener("change", () => {
      const v = parseInt(_snapInput.value);
      if (!isNaN(v) && v >= 4 && v <= 16) {
        if (window.HkSnap) window.HkSnap.setSnapDist(v);
      } else {
        _snapInput.value = window.HkSnap ? window.HkSnap.getSnapDist() : 8;
      }
    }), _gapRow.appendChild(_snapLabel), _gapRow.appendChild(_snapInput), G.appendChild(_gapRow);
    _loadCustomPalettes();
    const $ = ke(), g = H2(_("presetPalettes"), "presetPalettes");
    g.classList.add("hk-color-section-title"), $.appendChild(g);
    const B = document.createElement("div");
    B.className = "hk-palette-bar";
    const K = document.createElement("select");
    K.className = "hk-palette-select", K.setAttribute("aria-label", _("presetPalettes")), _allPalettes().forEach((n, h) => {
      const E = document.createElement("option");
      E.value = String(h), E.textContent = `${h + 1}. ${N2(h)}`, K.appendChild(E);
    }), K.value = String(o2), K.addEventListener("change", () => {
      const n = parseInt(K.value);
      isNaN(n) || m(n);
    }), B.appendChild(K);
    const V = document.createElement("div");
    V.className = "hk-color-carousel";
    const n2 = document.createElement("button");
    n2.type = "button", n2.className = "hk-palette-arrow hk-palette-arrow-prev", n2.innerHTML = "&#9664;", V.appendChild(n2);
    const Z = document.createElement("span");
    Z.className = "palette-index-display", Z.textContent = `${o2 + 1}/${_paletteCount()}`, V.appendChild(Z);
    const a2 = document.createElement("button");
    a2.type = "button", a2.className = "hk-palette-arrow hk-palette-arrow-next", a2.innerHTML = "&#9654;", V.appendChild(a2);
    const s2 = document.createElement("button");
    s2.type = "button", s2.className = "hk-palette-random", s2.innerHTML = "&#127922;", s2.setAttribute("aria-label", _("randomColor")), s2.title = _("randomColor"), s2.setAttribute("data-i18n-label", "randomColor"), s2.addEventListener("click", () => {
      const E = Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0"), hex = `#${E}`;
      oe(hex), Fe(hex);
    }), V.appendChild(s2);
    const _savePalBtn = document.createElement("button");
    _savePalBtn.type = "button", _savePalBtn.className = "hk-palette-save-btn", _savePalBtn.innerHTML = "\u{1F4BE}", _savePalBtn.title = _("savePalette"), _savePalBtn.setAttribute("aria-label", _("savePalette")), _savePalBtn.setAttribute("data-i18n-label", "savePalette"), _savePalBtn.addEventListener("click", () => {
      if (!C2.length) { k2(_("noSavedColors"), "warning"); return; }
      const _name = window.prompt(_("paletteNamePrompt"), `My Palette ${_customPalettes.length + 1}`);
      if (!_name || !_name.trim()) return;
      _customPalettes.push({ name: _name.trim(), colors: [...C2] });
      _saveCustomPalettes();
      _rebuildPaletteNav(K, h2, r, L, Y);
      m(_paletteCount() - 1);
      k2(_("paletteSaved") + " ✓", "success");
    }), V.appendChild(_savePalBtn);
    const _delPalBtn = document.createElement("button");
    _delPalBtn.type = "button", _delPalBtn.className = "hk-palette-delete-btn", _delPalBtn.innerHTML = "\u{1F5D1}\uFE0F", _delPalBtn.title = _("deletePalette"), _delPalBtn.setAttribute("aria-label", _("deletePalette")), _delPalBtn.setAttribute("data-i18n-label", "deletePalette"), _delPalBtn.style.display = "none", _delPalBtn.addEventListener("click", () => {
      if (!_isCustomPalette(o2)) return;
      const _idx = o2 - g2.length;
      if (!window.confirm(_("confirmDeletePalette"))) return;
      _customPalettes.splice(_idx, 1), _saveCustomPalettes();
      o2 = 0, _rebuildPaletteNav(K, h2, r, L, Y), le(r2, 0), L(), Y();
      k2(_("paletteDeleted"), "info");
    }), V.appendChild(_delPalBtn), B.appendChild(V), $.appendChild(B);
    const r2 = document.createElement("div");
    r2.className = "hk-palette-grid", r2.setAttribute("role", "group");
    const h2 = document.createElement("div");
    h2.className = "hk-palette-dots", h2.setAttribute("role", "tablist");
    const r = [], L = () => {
      const n = _paletteCount(), h = (o2 - 1 + n) % n, E = (o2 + 1) % n;
      n2.setAttribute("aria-label", `Show color set ${h + 1} of ${n}`), a2.setAttribute("aria-label", `Show color set ${E + 1} of ${n}`), Z.textContent = `${o2 + 1}/${n}`, K.value = String(o2);
      _delPalBtn.style.display = _isCustomPalette(o2) ? "" : "none";
    }, Y = () => {
      r.forEach((n, h) => {
        const E = h === o2;
        n.classList.toggle("active", E), n.setAttribute("aria-selected", E ? "true" : "false");
      });
    }, M = (n) => {
      const h = _paletteCount();
      h && (o2 = (o2 + n + h) % h, le(r2, o2), L(), Y());
    }, m = (n) => {
      const h = _paletteCount();
      h && (o2 = (n % h + h) % h, le(r2, o2), L(), Y());
    };
    function _rebuildPaletteNav(_sel, _dots, _arr, _L, _Y) {
      if (_sel) {
        _sel.innerHTML = "";
        _allPalettes().forEach((n, h) => {
          const E = document.createElement("option");
          E.value = String(h), E.textContent = `${h + 1}. ${N2(h)}`, _sel.appendChild(E);
        });
        _sel.value = String(o2);
      }
      if (_dots) {
        _dots.innerHTML = "", _arr.length = 0;
        _allPalettes().forEach((n, h) => {
          const E = document.createElement("button");
          E.type = "button", E.className = "hk-palette-dot", E.setAttribute("role", "tab");
          const q = N2(h);
          E.setAttribute("aria-label", q || `Palette ${h + 1}`), E.title = q || `Palette ${h + 1}`, E.addEventListener("click", () => m(h)), _dots.appendChild(E), _arr.push(E);
        });
      }
      _L && _L(), _Y && _Y();
    }
    _allPalettes().forEach((n, h) => {
      const E = document.createElement("button");
      E.type = "button", E.className = "hk-palette-dot", E.setAttribute("role", "tab");
      const q = N2(h);
      E.setAttribute("aria-label", q || `Palette ${h + 1}`), E.title = q || `Palette ${h + 1}`, E.addEventListener("click", () => m(h)), h2.appendChild(E), r.push(E);
    }), n2.addEventListener("click", () => M(-1)), a2.addEventListener("click", () => M(1));
    _cUndoBtn = document.createElement("button");
    _cUndoBtn.type = "button", _cUndoBtn.className = "hk-undo-redo-btn", _cUndoBtn.innerHTML = "\u21B6", _cUndoBtn.title = _("colorUndo"), _cUndoBtn.setAttribute("aria-label", _("colorUndo")), _cUndoBtn.setAttribute("data-i18n-label", "colorUndo"), _cUndoBtn.disabled = !0, _cUndoBtn.addEventListener("click", () => _cUndo());
    _cRedoBtn = document.createElement("button");
    _cRedoBtn.type = "button", _cRedoBtn.className = "hk-undo-redo-btn", _cRedoBtn.innerHTML = "\u21B7", _cRedoBtn.title = _("colorRedo"), _cRedoBtn.setAttribute("aria-label", _("colorRedo")), _cRedoBtn.setAttribute("data-i18n-label", "colorRedo"), _cRedoBtn.disabled = !0, _cRedoBtn.addEventListener("click", () => _cRedo());
    const _dotsRow = document.createElement("div");
    _dotsRow.className = "hk-palette-dots-row";
    _dotsRow.appendChild(h2);
    _dotsRow.appendChild(_cUndoBtn);
    _dotsRow.appendChild(_cRedoBtn);
    $.appendChild(r2), $.appendChild(_dotsRow), le(r2, o2), L(), Y();
    const C = document.createElement("div");
    C.className = "hk-custom-inline";
    const z = document.createElement("div");
    z.className = "hk-custom-row-top";
    const P = document.createElement("span");
    P.className = "hk-custom-label", P.textContent = _("custom"), P.setAttribute("data-i18n", "custom"), z.appendChild(P), U = document.createElement("input"), U.type = "text", U.placeholder = "#RRGGBB", U.maxLength = 7, U.className = "hk-custom-hex", z.appendChild(U);
    const _tBtn = document.createElement("button");
    _tBtn.type = "button", _tBtn.className = "hk-dual-btn hk-dual-t", _tBtn.textContent = "T", _tBtn.title = _("titleColor"), _tBtn.setAttribute("aria-label", _("titleColor")), _tBtn.setAttribute("data-i18n-label", "titleColor"), _tBtn.addEventListener("click", () => { if (_dualLinked) return; _dualMode = "T", _tBtn.classList.add("active"), _bBtn.classList.remove("active"); }), z.appendChild(_tBtn);
    const _bBtn = document.createElement("button");
    _bBtn.type = "button", _bBtn.className = "hk-dual-btn hk-dual-b", _bBtn.textContent = "B", _bBtn.title = _("bodyColor"), _bBtn.setAttribute("aria-label", _("bodyColor")), _bBtn.setAttribute("data-i18n-label", "bodyColor"), _bBtn.addEventListener("click", () => { if (_dualLinked) return; _dualMode = "B", _bBtn.classList.add("active"), _tBtn.classList.remove("active"); }), z.appendChild(_bBtn);
    const _linkBtn = document.createElement("button");
    _linkBtn.type = "button", _linkBtn.className = "hk-dual-btn hk-dual-link active", _linkBtn.innerHTML = "\u{1F517}", _linkBtn.title = _("dualLink"), _linkBtn.setAttribute("aria-label", _("dualLink")), _linkBtn.setAttribute("data-i18n-label", "dualLink"), _linkBtn.addEventListener("click", () => {
      _dualLinked = !_dualLinked, _linkBtn.classList.toggle("active", _dualLinked);
      if (!_dualLinked) {
        const cur = p2(U == null ? void 0 : U.value) || "#353535", o = v2(cur);
        _titleHex = o.color, _bodyHex = o.bgcolor;
      }
      _tBtn.classList.toggle("active", _dualMode === "T" && !_dualLinked), _bBtn.classList.toggle("active", _dualMode === "B" && !_dualLinked);
    }), z.appendChild(_linkBtn), C.appendChild(z);
    const j = document.createElement("div");
    j.className = "hk-custom-row-bottom", c2 = document.createElement("button"), c2.type = "button", c2.className = "hk-custom-preview", c2.setAttribute("data-label", _("colorPreview")), c2.setAttribute("data-i18n-label", "colorPreview"), c2.setAttribute("aria-label", _("custom")), c2.title = _("custom"), c2.addEventListener("click", () => {
      _openSvPicker(c2, (hex) => { Fe(hex); if (!A.length && !L2.length) return; const q = _buildOpt(hex); W2(q), se(q); }, (hex) => { _2(); oe(hex, !0); });
    }), j.appendChild(c2);
    W = null;
    const _toolBar = document.createElement("div");
    _toolBar.className = "hk-custom-toolbar";
    const _pickBtn = document.createElement("button");
    _pickBtn.type = "button", _pickBtn.className = "hk-pick-btn", _pickBtn.innerHTML = "\u{1F4A7}", _pickBtn.title = _("pickColor"), _pickBtn.setAttribute("aria-label", _("pickColor")), _pickBtn.setAttribute("data-i18n-label", "pickColor"), _pickBtn.addEventListener("click", () => {
      if (!A.length && !L2.length) { k2(_("selectToApply"), "warning"); return; }
      let raw = null;
      for (const n of A) { if (n && n.bgcolor) { raw = n.bgcolor; break; } if (n && n.color) { raw = n.color; break; } }
      if (!raw) for (const g of L2) { if (g && g.color) { raw = g.color; break; } }
      if (!raw) { k2(_("noNodeColor"), "info"); return; }
      const hex = p2(raw);
      if (!hex) { k2(_("noNodeColor"), "info"); return; }
      Fe(hex), o0(hex), k2(_("pickColor") + " ✓", "success");
    }), _toolBar.appendChild(_pickBtn);
    const _eyeBtn = document.createElement("button");
    _eyeBtn.type = "button", _eyeBtn.className = "hk-pick-btn hk-eyedropper-btn", _eyeBtn.innerHTML = "\u{1F9EA}", _eyeBtn.title = _("eyedropper"), _eyeBtn.setAttribute("aria-label", _("eyedropper")), _eyeBtn.setAttribute("data-i18n-label", "eyedropper");
    if (window.EyeDropper) {
      _eyeBtn.addEventListener("click", async () => {
        try {
          const ed = new window.EyeDropper();
          const result = await ed.open();
          const hex = p2(result.sRGBHex);
          if (!hex) return;
          Fe(hex), o0(hex), k2(_("eyedropper") + " \u2713", "success");
          if (A.length || L2.length) { oe(hex); }
        } catch (e) {}
      });
    } else { _eyeBtn.style.display = "none"; }
    _toolBar.appendChild(_eyeBtn);
    const _copyBtn = document.createElement("button");
    _copyBtn.type = "button", _copyBtn.className = "hk-copy-btn", _copyBtn.innerHTML = "\u{1F4CB}", _copyBtn.title = _("copyColor"), _copyBtn.setAttribute("aria-label", _("copyColor")), _copyBtn.setAttribute("data-i18n-label", "copyColor"), _copyBtn.addEventListener("click", () => {
      if (!A.length && !L2.length) { k2(_("selectToApply"), "warning"); return; }
      let raw = null;
      for (const n of A) { if (n) { raw = { color: n.color, bgcolor: n.bgcolor, groupcolor: n.groupcolor, textcolor: n.textcolor }; break; } }
      if (!raw) for (const g of L2) { if (g && g.color) { raw = { color: g.color, bgcolor: g.color, groupcolor: g.color, textcolor: void 0 }; break; } }
      if (raw) { _colorClip = raw, k2(_("copyColor") + " ✓", "success"); _clipBtns.mainCopy = _copyBtn; _clipBtns.mainPaste = _pasteBtn; _updateClipUI(); _copyBtn.classList.add("clip-flash"); setTimeout(() => _copyBtn.classList.remove("clip-flash"), 600); } else k2(_("noNodeColor"), "info");
    }), _toolBar.appendChild(_copyBtn);
    const _pasteBtn = document.createElement("button");
    _pasteBtn.type = "button", _pasteBtn.className = "hk-paste-btn", _pasteBtn.innerHTML = "\u{1F4E5}", _pasteBtn.title = _("pasteColor"), _pasteBtn.setAttribute("aria-label", _("pasteColor")), _pasteBtn.setAttribute("data-i18n-label", "pasteColor"), _pasteBtn.addEventListener("click", () => {
      if (!_colorClip) { k2(_("noColorClip"), "info"); return; }
      if (!A.length && !L2.length) { k2(_("selectToApply"), "warning"); return; }
      _cPushUndo([...A], [...L2]);
      const t = [...A, ...L2], a = /* @__PURE__ */ new Set();
      t.forEach((u) => { u != null && u.graph && a.add(u.graph); }), a.forEach((u) => { var y; return (y = u == null ? void 0 : u.beforeChange) == null ? void 0 : y.call(u); }), t.forEach((u) => { ae(u, _colorClip); }), a.forEach((u) => { var y; return (y = u == null ? void 0 : u.afterChange) == null ? void 0 : y.call(u); }), Pe();
      { const _l = (window.LGraphCanvas == null ? void 0 : window.LGraphCanvas.active_canvas) ?? (window.app == null ? void 0 : window.app.canvas); _l == null ? void 0 : _l.setDirty == null ? void 0 : _l.setDirty.call(_l, !0, !0); }
      k2(_("pasteColor") + " ✓", "success");
    }), _toolBar.appendChild(_pasteBtn);
    _clipBtns.mainCopy = _copyBtn; _clipBtns.mainPaste = _pasteBtn; _updateClipUI();
    const _grpBtn2 = document.createElement("button");
    _grpBtn2.type = "button", _grpBtn2.className = "hk-pick-btn hk-quick-group-btn", _grpBtn2.innerHTML = "\u{1F5D2}\uFE0F", _grpBtn2.title = _("createGroup"), _grpBtn2.setAttribute("aria-label", _("createGroup")), _grpBtn2.setAttribute("data-i18n-label", "createGroup");
    const _grpDot2 = document.createElement("span");
    _grpDot2.className = "hk-grp-color-dot", _grpDot2.style.display = "none", _grpBtn2.appendChild(_grpDot2);
    const _grpUpdatePreview2 = () => {
      const _hex = _colorClip ? (_colorClip.groupcolor || _colorClip.bgcolor || _colorClip.color || null) : (f2.length > 0 && f2[0] ? f2[0] : null);
      if (_hex) { _grpDot2.style.background = _hex; _grpDot2.style.display = ""; }
      else { _grpDot2.style.display = "none"; }
    };
    _grpUpdatePreview2();
    _grpPreviewCbs.push(_grpUpdatePreview2);
    _grpBtn2.addEventListener("click", () => {
      const _grp = window.HkGroups && window.HkGroups.createGroupFromSelection && window.HkGroups.createGroupFromSelection();
      if (_grp) {
        let _colorOpt = null;
        if (_colorClip) { _colorOpt = _colorClip; }
        else if (f2.length > 0 && f2[0]) { _colorOpt = v2(f2[0]); }
        if (_colorOpt && A.length > 0) {
          const _graphs = /* @__PURE__ */ new Set();
          A.forEach((u) => { u != null && u.graph && _graphs.add(u.graph); });
          _graphs.forEach((u) => { var y; return (y = u == null ? void 0 : u.beforeChange) == null ? void 0 : y.call(u); });
          A.forEach((u) => { ae(u, _colorOpt); });
          _graphs.forEach((u) => { var y; return (y = u == null ? void 0 : u.afterChange) == null ? void 0 : y.call(u); });
          _grp.color = _colorOpt.groupcolor || _colorOpt.bgcolor || _colorOpt.color;
          const _l = (window.LGraphCanvas == null ? void 0 : window.LGraphCanvas.active_canvas) ?? (window.app == null ? void 0 : window.app.canvas);
          _l == null || _l.setDirty == null || _l.setDirty.call(_l, !0, !0);
        }
        k2(_("groupCreated") + " \u2713", "success");
      } else k2(_("selectToGroup"), "warning");
    }), _toolBar.appendChild(_grpBtn2);
    const R = document.createElement("button");
    R.type = "button", R.className = "hk-custom-save hk-custom-save-icon", R.innerHTML = "\u{1F4BE}", R.title = _("saveAsTemplate"), R.setAttribute("aria-label", _("saveAsTemplate")), R.setAttribute("data-i18n-label", "saveAsTemplate"), _toolBar.appendChild(R), C.appendChild(j), C.appendChild(_toolBar), $.appendChild(C);
    const Q = H2(_("savedColors"), "savedColors");
    Q.classList.add("hk-color-section-title"), $.appendChild(Q);
    const _savedRow = document.createElement("div");
    _savedRow.className = "hk-saved-row";
    const _savedLeft = document.createElement("button");
    _savedLeft.type = "button", _savedLeft.className = "hk-saved-nav hk-saved-nav-prev", _savedLeft.innerHTML = "&#9664;", _savedLeft.setAttribute("aria-label", "Prev saved colors"), _savedLeft.addEventListener("click", () => {
      if (_savedPage > 0) { _savedPage--; Me(); _updateSavedNav(); }
    }), _savedRow.appendChild(_savedLeft);
    w2 = document.createElement("div"), w2.className = "hk-color-recent hk-saved-strip", Me(), _savedRow.appendChild(w2);
    const _savedRight = document.createElement("button");
    _savedRight.type = "button", _savedRight.className = "hk-saved-nav hk-saved-nav-next", _savedRight.innerHTML = "&#9654;", _savedRight.setAttribute("aria-label", "Next saved colors"), _savedRight.addEventListener("click", () => {
      const _max = Math.max(0, Math.ceil(C2.length / 9) - 1);
      if (_savedPage < _max) { _savedPage++; Me(); _updateSavedNav(); }
    }), _savedRow.appendChild(_savedRight), $.appendChild(_savedRow);
    const _updateSavedNav = () => {
      const _max = Math.max(0, Math.ceil(C2.length / 9) - 1);
      _savedLeft.disabled = _savedPage === 0;
      _savedRight.disabled = _savedPage >= _max;
    };
    _updateSavedNav();
    const l2 = H2(_("recentColors"), "recentColors");
    l2.classList.add("hk-color-section-title"), $.appendChild(l2), M2 = document.createElement("div"), M2.className = "hk-color-recent", Se(), $.appendChild(M2);
    const u2 = f2[0] || Q2[0];
    Fe(u2);
    const j2 = (n, h) => {
      const E = p2(n);
      if (!E || (h === "color" && U && (U.value = E.toUpperCase()), h === "text" && W && (W.value = E), He(E), !A.length && !L2.length)) return;
      const q = _buildOpt(E);
      W2(q), se(q);
    };
    W == null || W.addEventListener("input", () => j2(W.value, "color")), W == null || W.addEventListener("change", () => Be(W.value)), W == null || W.addEventListener("click", () => W2(v2(W.value))), W == null || W.addEventListener("blur", () => _2()), U == null || U.addEventListener("input", () => j2(U.value, "text")), U == null || U.addEventListener("keydown", (n) => {
      n.key === "Enter" && (n.preventDefault(), Be(U.value));
    }), U == null || U.addEventListener("blur", () => _2());
    const m2 = () => {
      const n = (U == null ? void 0 : U.value) || (W == null ? void 0 : W.value) || u2, h = p2(n);
      h && (r0(h), R.classList.add("hk-save-flash"), window.setTimeout(() => R.classList.remove("hk-save-flash"), 350), _updateSavedNav());
    };
    R.addEventListener("click", m2), C.addEventListener("keydown", (n) => {
      (n.metaKey || n.ctrlKey) && n.key.toLowerCase() === "enter" && (n.preventDefault(), m2());
    }), f.appendChild(w), f.appendChild(i2), f.appendChild(G);
    const V2 = document.createElement("div");
    V2.className = "hk-divider", V2.style.marginTop = "10px", f.appendChild(V2), f.appendChild($), H.appendChild(f);
    const z2 = document.createElement("div");
    z2.className = "hk-opacity-bar";
    const B2 = document.createElement("span");
    B2.className = "hk-opacity-bar-label", B2.textContent = _("opacity"), B2.setAttribute("data-i18n", "opacity"), z2.appendChild(B2);
    const t2 = document.createElement("input");
    t2.type = "range", t2.className = "hk-opacity-slider", t2.min = "20", t2.max = "100", t2.step = "1", t2.value = String(Math.round(Oe() * 100)), t2.setAttribute("aria-label", _("opacity")), z2.appendChild(t2);
    const A2 = document.createElement("span");
    A2.className = "hk-opacity-value", A2.textContent = `${t2.value}%`, z2.appendChild(A2);
    const e = (n) => {
      const h = Math.max(0.2, Math.min(1, n / 100));
      H == null || H.style.setProperty("--hk-panel-opacity", String(h)), A2.textContent = `${Math.round(h * 100)}%`;
    };
    e(Number(t2.value)), t2.addEventListener("input", () => {
      const n = Number(t2.value);
      e(n), Re(n / 100);
    }), H.appendChild(z2), T.appendChild(H), document.body.appendChild(T), me(), S2();
  }
  function _e(i) {
    var a;
    if (A.length < 1 || A.length < 2 && i !== "size-min") return;
    X2();
    const t = (a = window.app) == null ? void 0 : a.canvas;
    if (!t) return;
    g0(i, A).forEach((l, c) => {
      if (l && A[c]) {
        const p = document.createElement("div");
        p.style.cssText = `
                    position: fixed;
                    background: rgba(74, 144, 226, 0.3);
                    border: 2px dashed rgba(74, 144, 226, 0.7);
                    border-radius: 4px;
                    z-index: 999;
                    pointer-events: none;
                    transition: all 0.2s ease;
                `;
        const d = (l.x + t.ds.offset[0]) * t.ds.scale, u = (l.y + t.ds.offset[1]) * t.ds.scale, x = t.canvas.getBoundingClientRect();
        const f = x.left + d, w = x.top + u, s = l.width * t.ds.scale, S = l.height * t.ds.scale;
        p.style.left = f + "px", p.style.top = w + "px", p.style.width = s + "px", p.style.height = S + "px", document.body.appendChild(p), J2.push(p);
      }
    });
  }
  function X2() {
    J2.forEach((i) => {
      i.parentNode && i.parentNode.removeChild(i);
    }), J2 = [];
  }
  let _alignGap = 30;
  try { const _g = parseInt(localStorage.getItem("hk-align-gap")); !isNaN(_g) && _g >= 0 && (_alignGap = _g); } catch {}
  let _hkUndoBtn = null, _hkRedoBtn = null;
  let _hkUndoStack = [], _hkRedoStack = [];
  const _HK_MAX_UNDO = 50;
  function _hkSnapshot(nodes) {
    return nodes.filter(n => n && n.pos).map(n => ({
      node: n,
      pos: [n.pos[0], n.pos[1]],
      size: n.size ? [n.size[0], n.size[1]] : null
    }));
  }
  function _hkRestore(snapshot) {
    snapshot.forEach(s => {
      if (s.node && s.node.pos) {
        s.node.pos[0] = s.pos[0], s.node.pos[1] = s.pos[1];
        if (typeof s.node.x == "number") s.node.x = s.pos[0];
        if (typeof s.node.y == "number") s.node.y = s.pos[1];
        if (s.size) {
          if (!s.node.size) s.node.size = [s.size[0], s.size[1]];
          else { s.node.size[0] = s.size[0]; s.node.size[1] = s.size[1]; }
        }
      }
    });
  }
  function _hkPushUndo(snapshot) {
    _hkUndoStack.push(snapshot);
    if (_hkUndoStack.length > _HK_MAX_UNDO) _hkUndoStack.shift();
    _hkRedoStack = [];
    _hkUpdateUndoRedoBtns();
  }
  function _hkUndo() {
    if (!_hkUndoStack.length) { k2(_("noUndo"), "info"); return; }
    const prev = _hkUndoStack.pop();
    const curr = _hkSnapshot(prev.map(s => s.node));
    _hkRedoStack.push(curr);
    _hkRestore(prev);
    _hkRefreshCanvas();
    _hkUpdateUndoRedoBtns();
  }
  function _hkRedo() {
    if (!_hkRedoStack.length) { k2(_("noRedo"), "info"); return; }
    const next = _hkRedoStack.pop();
    const curr = _hkSnapshot(next.map(s => s.node));
    _hkUndoStack.push(curr);
    _hkRestore(next);
    _hkRefreshCanvas();
    _hkUpdateUndoRedoBtns();
  }
  function _hkRefreshCanvas() {
    try {
      const c = (window.app?.canvas) ?? null;
      if (c?.setDirtyCanvas) c.setDirtyCanvas(!0, !0);
      else if (window.app?.graph?.setDirtyCanvas) window.app.graph.setDirtyCanvas(!0, !0);
      else if (c) c.draw(!0, !0);
    } catch {}
  }
  function _hkUpdateUndoRedoBtns() {
    if (_hkUndoBtn) _hkUndoBtn.disabled = _hkUndoStack.length === 0;
    if (_hkRedoBtn) _hkRedoBtn.disabled = _hkRedoStack.length === 0;
  }
  let _cUndoStack = [], _cRedoStack = [];
  let _cUndoBtn = null, _cRedoBtn = null;
  function _cPushUndo(nodes, groups) {
    const snap = { nodes: nodes.map(n => ({ n, color: n.color, bgcolor: n.bgcolor, groupcolor: n.groupcolor, textcolor: n.textcolor })), groups: groups.map(g => ({ g, color: g.color })) };
    _cUndoStack.push(snap);
    if (_cUndoStack.length > 50) _cUndoStack.shift();
    _cRedoStack = [];
    _cUpdateUndoRedo();
  }
  function _cRestore(snap) {
    const graph = window.app?.graph;
    snap.nodes.forEach(s => {
      if (s.n && graph && graph._nodes && graph._nodes.includes(s.n)) {
        s.n.color = s.color; s.n.bgcolor = s.bgcolor; s.n.groupcolor = s.groupcolor; s.n.textcolor = s.textcolor;
      }
    });
    snap.groups.forEach(s => {
      if (s.g && graph && graph._groups && graph._groups.includes(s.g)) {
        s.g.color = s.color;
      }
    });
  }
  function _cUndo() {
    if (!_cUndoStack.length) { k2(_("noColorUndo"), "info"); return; }
    const prev = _cUndoStack.pop();
    const nodes = [...A], groups = [...L2];
    const curr = { nodes: nodes.map(n => ({ n, color: n.color, bgcolor: n.bgcolor, groupcolor: n.groupcolor, textcolor: n.textcolor })), groups: groups.map(g => ({ g, color: g.color })) };
    _cRedoStack.push(curr);
    _cRestore(prev);
    _hkRefreshCanvas();
    _cUpdateUndoRedo();
  }
  function _cRedo() {
    if (!_cRedoStack.length) { k2(_("noColorRedo"), "info"); return; }
    const next = _cRedoStack.pop();
    const nodes = [...A], groups = [...L2];
    const curr = { nodes: nodes.map(n => ({ n, color: n.color, bgcolor: n.bgcolor, groupcolor: n.groupcolor, textcolor: n.textcolor })), groups: groups.map(g => ({ g, color: g.color })) };
    _cUndoStack.push(curr);
    _cRestore(next);
    _hkRefreshCanvas();
    _cUpdateUndoRedo();
  }
  function _cUpdateUndoRedo() {
    if (_cUndoBtn) _cUndoBtn.disabled = _cUndoStack.length === 0;
    if (_cRedoBtn) _cRedoBtn.disabled = _cRedoStack.length === 0;
  }
  function g0(i, t) {
    if (t.length < 2) return [];
    const o = [], a = Math.min(...t.map((d) => d.pos[0])), l = Math.max(...t.map((d) => d.pos[0] + _ns(d).width)), c = Math.min(...t.map((d) => d.pos[1])), p = Math.max(...t.map((d) => d.pos[1] + _ns(d).height));
    switch (i) {
      case "left":
        const d = [...t].sort((e, n) => e.pos[1] - n.pos[1]);
        let u = d[0].pos[1];
        const y = /* @__PURE__ */ new Map();
        d.forEach((e) => {
          let n = 100, h = 150, _sz = _ns(e); n = _sz.height, h = _sz.width, y.set(e.id, {
            x: a,
            y: u,
            width: h,
            height: n
          }), u += n + _alignGap;
        }), t.forEach((e) => {
          o.push(y.get(e.id));
        });
        break;
      case "right":
        const x = [...t].sort((e, n) => e.pos[1] - n.pos[1]);
        let k = x[0].pos[1];
        const N = /* @__PURE__ */ new Map();
        x.forEach((e) => {
          let n = 100, h = 150, _sz = _ns(e); n = _sz.height, h = _sz.width, N.set(e.id, {
            x: l - h,
            y: k,
            width: h,
            height: n
          }), k += n + _alignGap;
        }), t.forEach((e) => {
          o.push(N.get(e.id));
        });
        break;
      case "top":
        const X = [...t].sort((e, n) => e.pos[0] - n.pos[0]);
        let F = X[0].pos[0];
        const f = /* @__PURE__ */ new Map();
        X.forEach((e) => {
          let n = 100, h = 150, _sz = _ns(e); n = _sz.height, h = _sz.width, f.set(e.id, {
            x: F,
            y: c,
            width: h,
            height: n
          }), F += h + _alignGap;
        }), t.forEach((e) => {
          o.push(f.get(e.id));
        });
        break;
      case "bottom":
        const w = [...t].sort((e, n) => e.pos[0] - n.pos[0]);
        let s = a;
        const S = /* @__PURE__ */ new Map();
        w.forEach((e) => {
          let n = 100, h = 150, _sz = _ns(e); n = _sz.height, h = _sz.width, S.set(e.id, {
            x: s,
            y: p - n,
            width: h,
            height: n
          }), s += h + _alignGap;
        }), t.forEach((e) => {
          o.push(S.get(e.id));
        });
        break;
      case "height-center":
        const O = Math.min(...t.map((e) => e.pos[0])), J = Math.max(...t.map((e) => e.pos[0] + _ns(e).width)), i2 = (O + J) / 2, G = [...t].sort((e, n) => e.pos[1] - n.pos[1]);
        let $ = G[0].pos[1];
        const g = /* @__PURE__ */ new Map();
        G.forEach((e) => {
          let n = 150, h = 100, _sz = _ns(e); n = _sz.width, h = _sz.height, g.set(e.id, {
            x: i2 - n / 2,
            y: $,
            width: n,
            height: h
          }), $ += h + _alignGap;
        }), t.forEach((e) => {
          o.push(g.get(e.id));
        });
        break;
      case "width-center":
        const B = Math.min(...t.map((e) => e.pos[1])), K = Math.max(...t.map((e) => e.pos[1] + _ns(e).height)), V = (B + K) / 2, n2 = [...t].sort((e, n) => e.pos[0] - n.pos[0]);
        let Z = n2[0].pos[0];
        const a2 = /* @__PURE__ */ new Map();
        n2.forEach((e) => {
          let n = 150, h = 100, _sz = _ns(e); n = _sz.width, h = _sz.height, a2.set(e.id, {
            x: Z,
            y: V - h / 2,
            width: n,
            height: h
          }), Z += n + _alignGap;
        }), t.forEach((e) => {
          o.push(a2.get(e.id));
        });
        break;
      case "horizontal-flow":
        const r2 = t.filter((e) => {
          if (!e) return !1;
          const n = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", h = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!n && !!h;
        });
        if (r2.length < 2) break;
        const h2 = Math.min(...r2.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), r = Math.min(...r2.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), L = r2.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), Y = q2(L), M = G2(L, Y), m = _alignGap, C = _alignGap, z = 0, P = {};
        L.forEach((e) => {
          var n;
          if (e && e.id) {
            const h = ((n = M[e.id]) == null ? void 0 : n.level) ?? 0;
            P[h] || (P[h] = []), P[h].push(e);
          }
        });
        const j = /* @__PURE__ */ new Map();
        Object.entries(P).forEach(([e, n]) => {
          const h = parseInt(e);
          if (n && n.length > 0) {
            n.sort((b, D) => {
              const s2 = b && b.id && M[b.id] ? M[b.id].order : 0, I = D && D.id && M[D.id] ? M[D.id].order : 0;
              return s2 - I;
            });
            let E = h2;
            if (h > 0)
              for (let b = 0; b < h; b++) {
                const D = P[b] || [], s2 = Math.max(...D.map(
                  (I) => I && I._calculatedSize && I._calculatedSize[0] ? I._calculatedSize[0] : 150
                ));
                E += s2 + m + z;
              }
            let q = r;
            n.forEach((b) => {
              b && b._calculatedSize && (j.set(b.id, {
                x: E,
                y: q,
                width: b._calculatedSize[0],
                height: b._calculatedSize[1]
              }), q += b._calculatedSize[1] + C);
            });
          }
        }), t.forEach((e) => {
          const n = j.get(e.id);
          n && o.push(n);
        });
        break;
      case "vertical-flow":
        const R = t.filter((e) => {
          if (!e) return !1;
          const n = e.pos || e.position || typeof e.x == "number" && typeof e.y == "number", h = e.size || e.width || e.height || typeof e.width == "number" && typeof e.height == "number";
          return !!n && !!h;
        });
        if (R.length < 2) break;
        const Q = Math.min(...R.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[0] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[0] : typeof e.x == "number" ? e.x : 0)), l2 = Math.min(...R.map((e) => e.pos && (Array.isArray(e.pos) || e.pos.length !== void 0) ? e.pos[1] : e.position && (Array.isArray(e.position) || e.position.length !== void 0) ? e.position[1] : typeof e.y == "number" ? e.y : 0)), u2 = R.map((e) => ({
          ...e,
          pos: e.pos ? [...e.pos] : [e.x || 0, e.y || 0],
          _calculatedSize: e.size && Array.isArray(e.size) ? [e.size[0], e.size[1]] : [e.width || 150, e.height || 100]
        })), j2 = q2(u2), m2 = G2(u2, j2), V2 = _alignGap, z2 = _alignGap, B2 = 0, t2 = {};
        u2.forEach((e) => {
          var n;
          if (e && e.id) {
            const h = ((n = m2[e.id]) == null ? void 0 : n.level) ?? 0;
            t2[h] || (t2[h] = []), t2[h].push(e);
          }
        });
        const A2 = /* @__PURE__ */ new Map();
        Object.entries(t2).forEach(([e, n]) => {
          const h = parseInt(e);
          if (n && n.length > 0) {
            n.sort((b, D) => {
              const s2 = b && b.id && m2[b.id] ? m2[b.id].order : 0, I = D && D.id && m2[D.id] ? m2[D.id].order : 0;
              return s2 - I;
            });
            let E = l2;
            if (h > 0)
              for (let b = 0; b < h; b++) {
                const D = t2[b] || [], s2 = Math.max(...D.map(
                  (I) => I && I._calculatedSize && I._calculatedSize[1] ? I._calculatedSize[1] : 100
                ));
                E += s2 + V2 + B2;
              }
            let q = Q;
            n.forEach((b) => {
              b && b._calculatedSize && (A2.set(b.id, {
                x: q,
                y: E,
                width: b._calculatedSize[0],
                height: b._calculatedSize[1]
              }), q += b._calculatedSize[0] + z2);
            });
          }
        }), t.forEach((e) => {
          const n = A2.get(e.id);
          n && o.push(n);
        });
        break;
      case "width-max":
      case "width-min":
      case "height-max":
      case "height-min":
      case "size-max":
      case "size-min":
        t.forEach((e) => {
          let n = 150, h = 100, _sz = _ns(e); n = _sz.width, h = _sz.height;
          let E = n, q = h;
          if (i === "width-max" || i === "size-max")
            E = Math.max(...t.map((b) => _ns(b).width));
          else if (i === "width-min")
            E = Math.min(...t.map((b) => _ns(b).width));
          else if (i === "size-min") {
            const b = T2.get(e) || e.computeSize;
            if (b)
              try {
                const D = b.call(e);
                D && D.length >= 2 && D[0] !== void 0 && D[1] !== void 0 ? (E = D[0], q = D[1] + _alignGap) : typeof D == "number" ? (E = n, q = D + _alignGap) : (E = n, q = h);
              } catch {
                E = n, q = h;
              }
          }
          if (i === "height-max" || i === "size-max")
            q = Math.max(...t.map((b) => _ns(b).height));
          else if (i === "height-min") {
            const b = Math.min(...t.map((I) => _ns(I).height)), D = T2.get(e) || e.computeSize;
            let s2 = null;
            if (D)
              try {
                const I = D.call(e);
                I && I.length >= 2 && I[1] !== void 0 ? s2 = I[1] + _alignGap : typeof I == "number" && (s2 = I + _alignGap);
              } catch {
              }
            q = s2 && s2 > b ? s2 : b;
          }
          o.push({
            x: e.pos[0],
            y: e.pos[1],
            width: E,
            height: q
          });
        });
        break;
    }
    return o;
  }
  function $2() {
    var c;
    if (!((c = window.app) != null && c.graph)) return;
    const i = window.app.graph;
    A = Object.values(i._nodes || {}).filter((p) => p && p.is_selected), L2 = (Array.isArray(i._groups) ? i._groups : []).filter((p) => p && p.selected);
    A.forEach((p) => {
      if (!te.has(p)) {
        let sw = 150, sh = 100;
        if (p.size && Array.isArray(p.size)) { p.size[0] && (sw = p.size[0]); p.size[1] && (sh = p.size[1]); }
        else { typeof p.width == "number" && (sw = p.width); typeof p.height == "number" && (sh = p.height); p.properties && (typeof p.properties.width == "number" && (sw = p.properties.width), typeof p.properties.height == "number" && (sh = p.properties.height)); }
        te.set(p, { width: sw, height: sh });
      }
      if (!T2.has(p) && typeof p.computeSize == "function") { T2.set(p, p.computeSize.bind(p)); }
    });
    const a = A.length > 1;
    a || X2(), T && T.classList.toggle("hk-has-selection", a);
    const l = H == null ? void 0 : H.querySelectorAll(".hk-button");
    l == null || l.forEach((p) => {
      const d = p.dataset.alignmentType === "size-min";
      p.disabled = d ? A.length < 1 : !a;
    });
    const ap = document.querySelector(".hk-align-popup");
    ap && ap.classList.contains("visible") && ap.querySelectorAll(".hk-button").forEach((p) => {
      const d = p.dataset.alignmentType === "size-min";
      p.disabled = d ? A.length < 1 : !a;
    });
  }
  function q2(i) {
    const t = {}, o = i.filter((a) => a && a.id !== void 0 && a.id !== null);
    return o.forEach((a) => {
      const l = a.id || `node_${o.indexOf(a)}`;
      a.id = l, t[l] = { inputs: [], outputs: [] }, a.inputs && Array.isArray(a.inputs) && a.inputs.forEach((c, p) => {
        c && c.link !== null && c.link !== void 0 && t[l].inputs.push({
          index: p,
          link: c.link,
          sourceNode: b0(c.link, o)
        });
      }), a.outputs && Array.isArray(a.outputs) && a.outputs.forEach((c, p) => {
        c && c.links && Array.isArray(c.links) && c.links.length > 0 && c.links.forEach((d) => {
          const u = m0(d, o);
          u && t[l].outputs.push({
            index: p,
            link: d,
            targetNode: u
          });
        });
      });
    }), t;
  }
  function b0(i, t) {
    for (const o of t)
      if (o && o.outputs && Array.isArray(o.outputs)) {
        for (const a of o.outputs)
          if (a && a.links && Array.isArray(a.links) && a.links.includes(i))
            return o;
      }
    return null;
  }
  function m0(i, t) {
    for (const o of t)
      if (o && o.inputs && Array.isArray(o.inputs)) {
        for (const a of o.inputs)
          if (a && a.link === i)
            return o;
      }
    return null;
  }
  function G2(i, t) {
    const o = {}, a = /* @__PURE__ */ new Set(), l = i.filter((u) => u && u.id), c = l.filter((u) => {
      const y = u.id;
      return !t[y] || !t[y].inputs.length || t[y].inputs.every((x) => !x.sourceNode);
    });
    c.length === 0 && l.length > 0 && c.push(l[0]);
    const p = c.map((u) => ({ node: u, level: 0 }));
    for (; p.length > 0; ) {
      const { node: u, level: y } = p.shift();
      !u || !u.id || a.has(u.id) || (a.add(u.id), o[u.id] = { level: y, order: 0 }, t[u.id] && t[u.id].outputs && t[u.id].outputs.forEach((x) => {
        x && x.targetNode && x.targetNode.id && !a.has(x.targetNode.id) && p.push({ node: x.targetNode, level: y + 1 });
      }));
    }
    l.forEach((u) => {
      u && u.id && !o[u.id] && (o[u.id] = { level: 0, order: 0 });
    });
    const d = {};
    return Object.entries(o).forEach(([u, y]) => {
      d[y.level] || (d[y.level] = []);
      const x = l.find((k) => k && k.id === u);
      x && d[y.level].push(x);
    }), Object.entries(d).forEach(([u, y]) => {
      y && y.length > 0 && (y.sort((x, k) => {
        const N = x && x.pos && x.pos[1] ? x.pos[1] : 0, X = k && k.pos && k.pos[1] ? k.pos[1] : 0;
        return N - X;
      }), y.forEach((x, k) => {
        x && x.id && o[x.id] && (o[x.id].order = k);
      }));
    }), o;
  }
  function y2(i) {
    var t, o, a, l, c;
    if (A.length < 1 || A.length < 2 && i !== "size-min") {
      k2(_("needTwoNodes"), "warning");
      return;
    }
    const _posAligns = ["left", "right", "top", "bottom", "height-center", "width-center"];
    if (_posAligns.includes(i)) {
      try {
        const positions = g0(i, A);
        if (positions && positions.length > 0) {
          const _snap = _hkSnapshot(A);
          positions.forEach((pos, idx) => {
            const node = A[idx];
            if (pos && node) {
              node.pos[0] = pos.x, node.pos[1] = pos.y, typeof node.x == "number" && (node.x = pos.x), typeof node.y == "number" && (node.y = pos.y);
            }
          });
          _hkPushUndo(_snap);
          try {
            (o = (t = window.app) == null ? void 0 : t.canvas) != null && o.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (l = (a = window.app) == null ? void 0 : a.graph) != null && l.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (c = window.app) != null && c.canvas && window.app.canvas.draw(!0, !0);
          } catch {
          }
        }
      } catch {
        k2(_("errorAlign"), "error");
      }
      return;
    }
    if (i === "horizontal-flow") { x0(); return; }
    if (i === "vertical-flow") { C0(); return; }
    try {
      const x = Math.max(...A.map((f) => {
        const w = te.get(f);
        if (w && w.width !== void 0) return w.width;
        return _ns(f).width;
      })), k = Math.min(...A.map((f) => {
        const w = te.get(f);
        if (w && w.width !== void 0) return w.width;
        return _ns(f).width;
      })), N = Math.max(...A.map((f) => {
        const w = te.get(f);
        return w && w.height !== void 0 ? w.height : _ns(f).height;
      })), X = Math.min(...A.map((f) => _ns(f).height));
      const _snap = _hkSnapshot(A);
      switch (i) {
        case "width-max":
          A.forEach((r) => { r.size && (r.size[0] = x); });
          break;
        case "width-min":
          A.forEach((r) => { r.size && (r.size[0] = k); });
          break;
        case "height-max":
          A.forEach((r) => { r.size && (r.size[1] = N); });
          break;
        case "height-min":
          A.forEach((r) => {
            if (r.size) {
              const L = T2.get(r) || r.computeSize;
              if (L) {
                const Y = L.call(r);
                r.size[1] = Math.max(X, Y[1]);
              }
            }
          });
          break;
        case "size-max":
          A.forEach((r) => { r.size && (r.size[0] = x, r.size[1] = N); });
          break;
        case "size-min":
          A.forEach((r) => {
            if (r.size) {
              const L = T2.get(r) || r.computeSize;
              if (L) {
                const Y = L.call(r);
                r.size[0] = Y[0], r.size[1] = Y[1];
              }
            }
          });
          break;
      }
      _hkPushUndo(_snap);
      try {
        (o = (t = window.app) == null ? void 0 : t.canvas) != null && o.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (l = (a = window.app) == null ? void 0 : a.graph) != null && l.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (c = window.app) != null && c.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      k2(_("errorAlign"), "error");
    }
  }
  function _flowAlignment(dir) {
    var i, t, o, a, l;
    const isH = dir === "horizontal";
    try {
      const c = A.filter((s) => {
        if (!s) return !1;
        const S = s.pos || s.position || typeof s.x == "number" && typeof s.y == "number", O = s.size || s.width || s.height || typeof s.width == "number" && typeof s.height == "number";
        return !!S && !!O;
      });
      if (c.length < 2) {
        k2(_("notEnoughNodes").replace("{valid}", c.length).replace("{total}", A.length), "warning");
        return;
      }
      const p = Math.min(...c.map((s) => s.pos && (Array.isArray(s.pos) || s.pos.length !== void 0) ? s.pos[0] : s.position && (Array.isArray(s.position) || s.position.length !== void 0) ? s.position[0] : typeof s.x == "number" ? s.x : 0)), d = Math.min(...c.map((s) => s.pos && (Array.isArray(s.pos) || s.pos.length !== void 0) ? s.pos[1] : s.position && (Array.isArray(s.position) || s.position.length !== void 0) ? s.position[1] : typeof s.y == "number" ? s.y : 0)), u = p, y = d;
      c.forEach((s) => {
        s.pos || (s.position && Array.isArray(s.position) ? s.pos = s.position : typeof s.x == "number" && typeof s.y == "number" ? s.pos = [s.x, s.y] : s.pos = [0, 0]), s._calculatedSize = s.size && Array.isArray(s.size) ? [s.size[0] || 150, s.size[1] || 100] : typeof s.width == "number" && typeof s.height == "number" ? [s.width, s.height] : [150, 100], Array.isArray(s.pos) || (s.pos = [0, 0]);
      });
      const x = q2(c), k = G2(c, x), gap = _alignGap, f = 0, w = {};
      c.forEach((s) => {
        var S;
        if (s && s.id) {
          const O = ((S = k[s.id]) == null ? void 0 : S.level) ?? 0;
          w[O] || (w[O] = []), w[O].push(s);
        }
      });
      const _snap = _hkSnapshot(c);
      Object.entries(w).forEach(([s, S]) => {
        const O = parseInt(s);
        if (S && S.length > 0) {
          S.sort((g, B) => {
            const K = g && g.id && k[g.id] ? k[g.id].order : 0, V = B && B.id && k[B.id] ? k[B.id].order : 0;
            return K - V;
          });
          let G = isH ? u : y;
          if (O > 0)
            for (let g = 0; g < O; g++) {
              const B = w[g] || [], K = Math.max(...B.map(
                (V) => V && V._calculatedSize && V._calculatedSize[isH ? 0 : 1] ? V._calculatedSize[isH ? 0 : 1] : (isH ? 150 : 100)
              ));
              G += K + gap + f;
            }
          let $ = isH ? y : u;
          S.forEach((g) => {
            if (g && g.pos && g._calculatedSize) {
              if (isH) {
                g.pos[0] = G, g.pos[1] = $, $ += g._calculatedSize[1] + gap;
              } else {
                g.pos[0] = $, g.pos[1] = G, $ += g._calculatedSize[0] + gap;
              }
              typeof g.x == "number" && (g.x = g.pos[0]), typeof g.y == "number" && (g.y = g.pos[1]);
            }
          });
        }
      });
      _hkPushUndo(_snap);
      try {
        (t = (i = window.app) == null ? void 0 : i.canvas) != null && t.setDirtyCanvas ? window.app.canvas.setDirtyCanvas(!0, !0) : (a = (o = window.app) == null ? void 0 : o.graph) != null && a.setDirtyCanvas ? window.app.graph.setDirtyCanvas(!0, !0) : (l = window.app) != null && l.canvas && window.app.canvas.draw(!0, !0);
      } catch {
      }
    } catch {
      k2(isH ? _("errorHFlow") : _("errorVFlow"), "error");
    }
  }
  function x0() { _flowAlignment("horizontal"); }
  function C0() { _flowAlignment("vertical"); }
  let _veInitialized = !1;
  function Ve() {
    var i;
    if (!((i = window.app) != null && i.canvas)) {
      setTimeout(Ve, 100);
      return;
    }
    if (_veInitialized || !window.app.canvas.canvas) return;
    _veInitialized = !0;
    window.app.canvas.canvas.addEventListener("click", () => {
      requestAnimationFrame($2);
    });
    window.app.canvas.canvas.addEventListener("mouseup", () => {
      requestAnimationFrame($2);
    });
    window.app.canvas.canvas.addEventListener("keydown", (e) => {
      const _el = e.target;
      if (_el && (_el.tagName === "INPUT" || _el.tagName === "TEXTAREA" || _el.isContentEditable)) return;
      if (F2 && (e.ctrlKey || e.metaKey) && !e.altKey) {
        const _k = e.key.toLowerCase();
        if (_k === "z" && !e.shiftKey && _hkUndoStack.length > 0) {
          e.preventDefault(), e.stopImmediatePropagation(), _hkUndo();
        } else if ((_k === "y" || (_k === "z" && e.shiftKey)) && _hkRedoStack.length > 0) {
          e.preventDefault(), e.stopImmediatePropagation(), _hkRedo();
        }
      }
    }, !0);
    document.addEventListener("keydown", (t) => {
      (t.ctrlKey || t.metaKey) && requestAnimationFrame($2);
    });
    let _lastSelCheck = 0;
    function _selFallback() {
      if (F2) {
        const now = performance.now();
        if (now - _lastSelCheck > 300) {
          _lastSelCheck = now;
          $2();
        }
        requestAnimationFrame(_selFallback);
      } else {
        setTimeout(_selFallback, 1000);
      }
    }
    requestAnimationFrame(_selFallback);
  }
  function w0(i) {
    if (i.key === "Escape") {
      F2 && (i.preventDefault(), l0());
      return;
    }
    if (F2 && (i.ctrlKey || i.metaKey) && !i.altKey) {
      const _el = i.target;
      if (_el && (_el.tagName === "INPUT" || _el.tagName === "TEXTAREA" || _el.isContentEditable)) return;
      const _k = i.key.toLowerCase();
      if (_k === "z" && !i.shiftKey) {
        if (_hkUndoStack.length > 0) i.preventDefault(), i.stopImmediatePropagation(), _hkUndo();
        return;
      }
      if (_k === "y" || (_k === "z" && i.shiftKey)) {
        if (_hkRedoStack.length > 0) i.preventDefault(), i.stopImmediatePropagation(), _hkRedo();
        return;
      }
    }
    if (i.altKey && !i.ctrlKey && !i.metaKey && !i.shiftKey && (i.key === "v" || i.key === "V")) {
      i.preventDefault(), pe();
    }
  }
  f0(), Ve(), document.addEventListener("keydown", w0);
}
const e2 = {
  active: !1,
  colorOption: null,
  nodes: /* @__PURE__ */ new Map(),
  groups: /* @__PURE__ */ new Map()
};

// Drag-to-snap alignment guides — self-contained module, loaded asynchronously
// so any failure inside snap.js can never block the main Node Alignment panel.
import("./snap.js").catch(() => console.warn("[Node Alignment] snap module failed to load"));
import("./group.js").catch(() => console.warn("[Node Alignment] group module failed to load"));
